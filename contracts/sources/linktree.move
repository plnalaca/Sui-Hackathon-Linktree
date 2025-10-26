/// On-chain LinkTree module that stores profiles and links on the Sui blockchain.
/// Users can create profiles with customizable links, bio, avatar, and theme.
/// Profiles are owned objects that can be transferred, and a shared registry
/// maps profile names to their object IDs for easy discovery.
module onchain_linktree::linktree {
    use sui::event;
    use sui::table::{Self, Table};

    // ======== Error Codes ========
    
    const ENotOwner: u64 = 1;
    const EInvalidIndex: u64 = 2;
    const ENameAlreadyTaken: u64 = 3;

    // ABI-compatible error aliases
    const E_NOT_OWNER: u64 = ENotOwner;
    const E_OUT_OF_BOUNDS: u64 = EInvalidIndex;
    const E_NAME_ALREADY_TAKEN: u64 = ENameAlreadyTaken;

    // ======== Structs ========

    /// Represents a single link in the profile
    public struct Link has store, copy, drop {
        label: vector<u8>,
        url: vector<u8>,
    }

    /// Main profile object owned by a user
    public struct Profile has key, store {
        id: UID,
        owner: address,
        name: vector<u8>,
        bio: vector<u8>,
        avatar_cid: vector<u8>,
        theme: u64,
        links: vector<Link>,
    }

    /// Global registry to map profile names to their object IDs
    public struct Registry has key {
        id: UID,
        names: Table<vector<u8>, ID>,
    }

    // ======== Events ========

    public struct CreatedProfile has copy, drop {
        profile_id: ID,
        owner: address,
        name: vector<u8>,
    }

    public struct UpdatedProfileBasic has copy, drop {
        profile_id: ID,
        owner: address,
    }

    public struct UpdatedLinks has copy, drop {
        profile_id: ID,
        owner: address,
        links_count: u64,
    }

    public struct TransferredProfile has copy, drop {
        profile_id: ID,
        from: address,
        to: address,
    }

    public struct OwnerUpdated has copy, drop {
        profile_id: ID,
        old_owner: address,
        new_owner: address,
    }

    public struct ProfileDeleted has copy, drop {
        profile_id: ID,
        owner: address,
    }

    // ======== Init Function ========

    /// Initialize the registry on module publish
    fun init(ctx: &mut TxContext) {
        let registry = Registry {
            id: object::new(ctx),
            names: table::new(ctx),
        };
        transfer::share_object(registry);
    }

    // ======== Public Entry Functions ========

    /// Create a new profile and register it in the global registry.
    /// 
    /// # Parameters
    /// - `registry`: Mutable reference to the shared Registry object
    /// - `name`: Unique username for the profile (enforced by registry)
    /// - `bio`: Profile biography text
    /// - `avatar_cid`: IPFS CID or URL for the profile avatar
    /// - `theme`: Theme identifier (numeric)
    /// - `links`: Vector of Link objects to display in the profile
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `CreatedProfile`: Contains profile_id, owner, and name
    /// 
    /// # Access Control
    /// - Anyone can create a profile
    /// - Name must be unique (aborts with E_NAME_ALREADY_TAKEN if taken)
    /// 

    #[allow(lint(self_transfer))]
    public fun create_profile(
        registry: &mut Registry,
        name: vector<u8>,
        bio: vector<u8>,
        avatar_cid: vector<u8>,
        theme: u64,
        links: vector<Link>,
        ctx: &mut TxContext,
    ) {
        // Check if name is already taken
        assert!(!table::contains(&registry.names, name), ENameAlreadyTaken);

        let sender = ctx.sender();
        let profile_uid = object::new(ctx);
        let profile_id = object::uid_to_inner(&profile_uid);

        // Register the name in the registry
        table::add(&mut registry.names, name, profile_id);

        let profile = Profile {
            id: profile_uid,
            owner: sender,
            name,
            bio,
            avatar_cid,
            theme,
            links,
        };

        event::emit(CreatedProfile {
            profile_id,
            owner: sender,
            name: profile.name,
        });

        transfer::public_transfer(profile, sender);
    }

    /// Create a new profile without links (simpler version for frontend)
    /// 
    /// # Parameters
    /// - `registry`: Mutable reference to the shared Registry object
    /// - `name`: Unique username for the profile
    /// - `bio`: Profile biography text
    /// - `avatar_cid`: IPFS CID or URL for the profile avatar
    /// - `theme`: Theme identifier (numeric)
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `CreatedProfile`: Contains profile_id, owner, and name
    /// 
    /// # Access Control
    /// - Anyone can create a profile
    /// - Name must be unique (aborts with E_NAME_ALREADY_TAKEN if taken)
    public fun create_profile_simple(
        registry: &mut Registry,
        name: vector<u8>,
        bio: vector<u8>,
        avatar_cid: vector<u8>,
        theme: u64,
        ctx: &mut TxContext,
    ) {
        // Check if name is already taken
        assert!(!table::contains(&registry.names, name), ENameAlreadyTaken);

        let sender = tx_context::sender(ctx);
        let profile_uid = object::new(ctx);
        let profile_id = object::uid_to_inner(&profile_uid);

        // Register the name in the registry
        table::add(&mut registry.names, name, profile_id);

        let profile = Profile {
            id: profile_uid,
            owner: sender,
            name,
            bio,
            avatar_cid,
            theme,
            links: vector::empty(), // Empty links vector
        };

        event::emit(CreatedProfile {
            profile_id: object::id(&profile),
            owner: sender,
            name: profile.name,
        });

        transfer::transfer(profile, sender);
    }

    /// Update the bio field of a profile.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to the Profile object
    /// - `new_bio`: New biography text
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `UpdatedProfileBasic`: Contains profile_id and owner
    /// 
    /// # Access Control
    /// - Only the profile owner can call this (aborts with E_NOT_OWNER otherwise)
    public fun set_bio(
        profile: &mut Profile,
        new_bio: vector<u8>,
        ctx: &TxContext,
    ) {
        assert_owner(profile, ctx);
        profile.bio = new_bio;
        
        event::emit(UpdatedProfileBasic {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
        });
    }

    /// Update the avatar CID field of a profile.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to the Profile object
    /// - `new_avatar_cid`: New IPFS CID or URL for the avatar
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `UpdatedProfileBasic`: Contains profile_id and owner
    /// 
    /// # Access Control
    /// - Only the profile owner can call this (aborts with E_NOT_OWNER otherwise)
    public fun set_avatar(
        profile: &mut Profile,
        new_avatar_cid: vector<u8>,
        ctx: &TxContext,
    ) {
        assert_owner(profile, ctx);
        profile.avatar_cid = new_avatar_cid;
        
        event::emit(UpdatedProfileBasic {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
        });
    }

    /// Update the theme identifier of a profile.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to the Profile object
    /// - `new_theme`: New theme identifier (numeric value)
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `UpdatedProfileBasic`: Contains profile_id and owner
    /// 
    /// # Access Control
    /// - Only the profile owner can call this (aborts with E_NOT_OWNER otherwise)
    public fun set_theme(
        profile: &mut Profile,
        new_theme: u64,
        ctx: &TxContext,
    ) {
        assert_owner(profile, ctx);
        profile.theme = new_theme;
        
        event::emit(UpdatedProfileBasic {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
        });
    }

    /// Replace all links in a profile with a new set.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to the Profile object
    /// - `new_links`: New vector of Link objects (replaces existing links)
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `UpdatedLinks`: Contains profile_id, owner, and new links_count
    /// 
    /// # Access Control
    /// - Only the profile owner can call this (aborts with E_NOT_OWNER otherwise)
    public fun set_links(
        profile: &mut Profile,
        new_links: vector<Link>,
        ctx: &TxContext,
    ) {
        assert_owner(profile, ctx);
        profile.links = new_links;
        
        event::emit(UpdatedLinks {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
            links_count: vector::length(&profile.links),
        });
    }

    /// Append a new link to the profile's links vector.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to the Profile object
    /// - `label`: Display text for the link
    /// - `url`: URL or destination for the link
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `UpdatedLinks`: Contains profile_id, owner, and updated links_count
    /// 
    /// # Access Control
    /// - Only the profile owner can call this (aborts with E_NOT_OWNER otherwise)
    public fun add_link(
        profile: &mut Profile,
        label: vector<u8>,
        url: vector<u8>,
        ctx: &TxContext,
    ) {
        assert_owner(profile, ctx);
        
        let link = Link { label, url };
        vector::push_back(&mut profile.links, link);
        
        event::emit(UpdatedLinks {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
            links_count: vector::length(&profile.links),
        });
    }

    /// Update an existing link at a specific index in the links vector.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to the Profile object
    /// - `index`: Zero-based index of the link to update
    /// - `new_label`: New display text for the link
    /// - `new_url`: New URL or destination for the link
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `UpdatedLinks`: Contains profile_id, owner, and links_count
    /// 
    /// # Access Control
    /// - Only the profile owner can call this (aborts with E_NOT_OWNER otherwise)
    /// - Index must be valid (aborts with E_OUT_OF_BOUNDS if out of range)
    public fun update_link_at(
        profile: &mut Profile,
        index: u64,
        new_label: vector<u8>,
        new_url: vector<u8>,
        ctx: &TxContext,
    ) {
        assert_owner(profile, ctx);
        assert!(index < vector::length(&profile.links), EInvalidIndex);
        
        let link = vector::borrow_mut(&mut profile.links, index);
        link.label = new_label;
        link.url = new_url;
        
        event::emit(UpdatedLinks {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
            links_count: vector::length(&profile.links),
        });
    }

    /// Remove a link at a specific index from the links vector.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to the Profile object
    /// - `index`: Zero-based index of the link to remove
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `UpdatedLinks`: Contains profile_id, owner, and updated links_count
    /// 
    /// # Access Control
    /// - Only the profile owner can call this (aborts with E_NOT_OWNER otherwise)
    /// - Index must be valid (aborts with E_OUT_OF_BOUNDS if out of range)
    public fun remove_link_at(
        profile: &mut Profile,
        index: u64,
        ctx: &TxContext,
    ) {
        assert_owner(profile, ctx);
        assert!(index < vector::length(&profile.links), EInvalidIndex);
        
        vector::remove(&mut profile.links, index);
        
        event::emit(UpdatedLinks {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
            links_count: vector::length(&profile.links),
        });
    }

    /// Swap two links by their indices to reorder them.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to Profile object
    /// - `index1`: First link index
    /// - `index2`: Second link index
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `UpdatedLinks`: Contains profile_id, owner, and links_count
    /// 
    /// # Access Control
    /// - Only the profile owner can call this (aborts with E_NOT_OWNER otherwise)
    /// - Both indices must be valid (aborts with E_OUT_OF_BOUNDS if out of range)
    public fun swap_links(
        profile: &mut Profile,
        index1: u64,
        index2: u64,
        ctx: &TxContext,
    ) {
        assert_owner(profile, ctx);
        let len = vector::length(&profile.links);
        assert!(index1 < len, EInvalidIndex);
        assert!(index2 < len, EInvalidIndex);
        
        if (index1 != index2) {
            vector::swap(&mut profile.links, index1, index2);
            
            event::emit(UpdatedLinks {
                profile_id: object::uid_to_inner(&profile.id),
                owner: profile.owner,
                links_count: len,
            });
        };
    }

    /// Transfer profile ownership to a new recipient address.
    /// 
    /// # Parameters
    /// - `profile`: Profile object to transfer (consumed by value)
    /// - `recipient`: Address of the new owner
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `TransferredProfile`: Contains profile_id, from address, and to address
    /// 
    /// # Access Control
    /// - Only the current profile owner can call this (aborts with E_NOT_OWNER otherwise)
    /// 
    /// # Note
    /// The recipient should call `update_owner` to update the internal owner field
    public fun transfer_profile(
        profile: Profile,
        recipient: address,
        ctx: &TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert!(profile.owner == sender, ENotOwner);
        
        event::emit(TransferredProfile {
            profile_id: object::uid_to_inner(&profile.id),
            from: sender,
            to: recipient,
        });
        
        transfer::transfer(profile, recipient);
    }

    /// Update the internal owner field after a profile transfer.
    /// 
    /// # Parameters
    /// - `profile`: Mutable reference to the Profile object
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `OwnerUpdated`: Contains profile_id, old_owner, and new_owner
    /// 
    /// # Access Control
    /// - Should be called by the new owner after receiving a transferred profile
    /// - No ownership check (anyone who possesses the profile can update the field)
    public fun update_owner(
        profile: &mut Profile,
        ctx: &TxContext,
    ) {
        let old_owner = profile.owner;
        let new_owner = tx_context::sender(ctx);
        profile.owner = new_owner;

        event::emit(OwnerUpdated {
            profile_id: object::uid_to_inner(&profile.id),
            old_owner,
            new_owner,
        });
    }

    /// Delete a profile permanently
    /// 
    /// # Parameters
    /// - `registry`: Mutable reference to the shared Registry object
    /// - `profile`: Profile object to delete (consumed by value)
    /// - `ctx`: Transaction context
    /// 
    /// # Emits
    /// - `ProfileDeleted`: Contains profile_id and owner
    /// 
    /// # Access Control
    /// - Only the profile owner can delete their profile
    /// 
    /// # Note
    /// This removes the profile from the registry and destroys the object
    public fun delete_profile(
        registry: &mut Registry,
        profile: Profile,
        ctx: &TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert!(profile.owner == sender, ENotOwner);

        let profile_id = object::uid_to_inner(&profile.id);
        
        // Remove from registry
        if (table::contains(&registry.names, profile.name)) {
            table::remove(&mut registry.names, profile.name);
        };

        // Emit event
        event::emit(ProfileDeleted {
            profile_id,
            owner: sender,
        });

        // Destroy the profile
        let Profile { id, owner: _, name: _, bio: _, avatar_cid: _, theme: _, links: _ } = profile;
        object::delete(id);
    }

    // ======== Public Constructor Functions ========

    /// Create a Link struct (public constructor for transaction arguments)
    public fun new_link(label: vector<u8>, url: vector<u8>): Link {
        Link { label, url }
    }

    // ======== View Functions ========

    /// Get profile owner
    public fun owner(profile: &Profile): address {
        profile.owner
    }

    /// Get profile name
    public fun name(profile: &Profile): vector<u8> {
        profile.name
    }

    /// Get profile bio
    public fun bio(profile: &Profile): vector<u8> {
        profile.bio
    }

    /// Get profile avatar CID
    public fun avatar_cid(profile: &Profile): vector<u8> {
        profile.avatar_cid
    }

    /// Get profile theme
    public fun theme(profile: &Profile): u64 {
        profile.theme
    }

    /// Get all links
    public fun links(profile: &Profile): &vector<Link> {
        &profile.links
    }

    /// Get link label
    public fun link_label(link: &Link): vector<u8> {
        link.label
    }

    /// Get link url
    public fun link_url(link: &Link): vector<u8> {
        link.url
    }

    /// Look up a profile ID by name in the registry
    public fun lookup_profile(registry: &Registry, name: vector<u8>): Option<ID> {
        if (table::contains(&registry.names, name)) {
            option::some(*table::borrow(&registry.names, name))
        } else {
            option::none()
        }
    }

    // ======== Private Helper Functions ========

    /// Assert that the transaction sender is the profile owner
    fun assert_owner(profile: &Profile, ctx: &TxContext) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
    }

    // ======== Test Functions ========

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}

