#[test_only]
module onchain_linktree::linktree_tests {
    use sui::test_scenario;
    use onchain_linktree::linktree::{Self, Profile, Registry, Link};

    /// Test that a profile owner can successfully update their bio
    #[test]
    fun test_create_and_owner_update_allowed() {
        let owner = @0xA11CE;
        let mut scenario = test_scenario::begin(owner);

        // Initialize the module and get the registry
        {
            let ctx = test_scenario::ctx(&mut scenario);
            linktree::init_for_testing(ctx);
        };

        // Create a profile
        test_scenario::next_tx(&mut scenario, owner);
        {
            let mut registry = test_scenario::take_shared<Registry>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);
            
            let links = vector::empty<Link>();
            linktree::create_profile(
                &mut registry,
                b"alice",
                b"Hello, I'm Alice!",
                b"QmAliceAvatar",
                1,
                links,
                ctx
            );

            test_scenario::return_shared(registry);
        };

        // Owner updates the bio - should succeed
        test_scenario::next_tx(&mut scenario, owner);
        {
            let mut profile = test_scenario::take_from_sender<Profile>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);
            
            linktree::set_bio(&mut profile, b"Updated bio!", ctx);
            
            // Verify the bio was updated
            assert!(linktree::bio(&profile) == b"Updated bio!", 0);
            
            test_scenario::return_to_sender(&scenario, profile);
        };

        test_scenario::end(scenario);
    }

    /// Test that a non-owner cannot update another user's profile
    #[test]
    #[expected_failure(abort_code = linktree::E_NOT_OWNER)]
    fun test_non_owner_update_aborts() {
        let owner = @0xA11CE;
        let attacker = @0xBAD;
        let mut scenario = test_scenario::begin(owner);

        // Initialize the module
        {
            let ctx = test_scenario::ctx(&mut scenario);
            linktree::init_for_testing(ctx);
        };

        // Owner creates a profile
        test_scenario::next_tx(&mut scenario, owner);
        {
            let mut registry = test_scenario::take_shared<Registry>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);
            
            let links = vector::empty<Link>();
            linktree::create_profile(
                &mut registry,
                b"alice",
                b"Hello, I'm Alice!",
                b"QmAliceAvatar",
                1,
                links,
                ctx
            );

            test_scenario::return_shared(registry);
        };

        // Transfer profile to attacker's address (simulating them getting access)
        test_scenario::next_tx(&mut scenario, owner);
        {
            let profile = test_scenario::take_from_sender<Profile>(&scenario);
            transfer::public_transfer(profile, attacker);
        };

        // Attacker tries to update bio without calling update_owner first
        // This should fail because profile.owner is still the original owner
        test_scenario::next_tx(&mut scenario, attacker);
        {
            let mut profile = test_scenario::take_from_sender<Profile>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);
            
            // This should abort with E_NOT_OWNER
            linktree::set_bio(&mut profile, b"Hacked!", ctx);
            
            test_scenario::return_to_sender(&scenario, profile);
        };

        test_scenario::end(scenario);
    }
}


