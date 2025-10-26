# Blucky - On-Chain LinkTree Presentation

## 🎯 Project Overview

**Blucky** is a fully decentralized LinkTree alternative built on the Sui blockchain, leveraging Walrus for storage and SuiNS for human-readable domain names.

---

## 🚀 What is LinkTree?

LinkTree allows users to create a single landing page with multiple links to their social media, websites, and content. 

**Our Solution**: Move this concept on-chain, making it:
- ✅ Truly decentralized
- ✅ Censorship-resistant
- ✅ User-owned
- ✅ Transparent

---

## 🏗️ Technology Stack

### Blockchain Layer
- **Sui Blockchain** (Testnet)
  - Move smart contracts for profile storage
  - Shared Registry for name resolution
  - Owned objects for user profiles

### Storage Layer
- **Walrus Sites**
  - Decentralized blob storage
  - Frontend hosted on Walrus
  - Immutable and distributed

### Frontend Layer
- **React + TypeScript + Vite**
- **@mysten/dapp-kit** - Wallet integration
- **@mysten/sui** - Transaction building
- **TailwindCSS** - Styling

### Naming Layer
- **SuiNS** - Human-readable `.sui` domains

---

## 📦 Smart Contract Architecture

### Profile Structure
```move
public struct Profile has key, store {
    id: UID,
    owner: address,
    name: vector<u8>,      // Unique username
    bio: vector<u8>,       // Profile bio
    avatar_cid: vector<u8>, // Avatar URL/IPFS
    theme: u64,            // Theme ID (1-5)
    links: vector<Link>,   // List of links
}
```

### Registry (Shared Object)
```move
public struct Registry has key {
    id: UID,
    names: Table<vector<u8>, ID>, // name -> profile_id
}
```

### Key Features
- ✅ Name uniqueness enforced on-chain
- ✅ Profile ownership transfer
- ✅ Dynamic link management (add, edit, delete, reorder)
- ✅ Lookup by name (DNS-like)

---

## 🎨 Core Features

### 1. Profile Management
- Create profile with unique username
- Update bio, avatar, theme
- Transfer ownership
- Delete profile

### 2. Link Management
- Add unlimited links
- Edit existing links
- Delete links
- Reorder with drag & drop
- Each link has: label + URL

### 3. Themes
5 pre-designed themes:
1. 🌊 Ocean Blue
2. 🌅 Sunset Orange
3. 🌲 Forest Green
4. 💜 Purple Dream
5. 🌑 Dark Mode

### 4. Name Registry
- Human-readable usernames
- On-chain name → profile_id mapping
- Prevents duplicate names
- Easy profile discovery

---

## 🎁 Bonus Features

### 1. Analytics Dashboard 📊
- Track total profile views
- Track link clicks
- Calculate click-through rates
- Identify most popular links
- Real-time statistics

### 2. QR Code Generator 📱
- Dynamic QR code generation
- Customizable size
- Download as PNG
- Share via native APIs

### 3. Social Sharing 🔗
- One-click share to:
  - Twitter
  - Facebook
  - WhatsApp
  - Telegram
- Copy link to clipboard
- Native share API support

---

## 🌐 Walrus Sites Integration

### Why Walrus?
- **Decentralized**: No single point of failure
- **Permanent**: Data stored across network
- **Efficient**: Blob-based storage
- **Cost-effective**: Pay per epoch

### Deployment Process
1. Build frontend: `npm run build`
2. Configure `ws-resources.json`
3. Deploy: `site-builder deploy ./dist --epochs 1`
4. Get B36 object ID
5. Access via: `https://<object_id>.trwal.app/`

### Configuration
```yaml
# ~/.walrus/sites-config.yaml
default_context: testnet
contexts:
  testnet:
    portal: trwal.app
    package: 0xf99aee9f...
    walrus_package: 0xd84704c1...
```

---

## 🔗 SuiNS Integration

### What is SuiNS?
- Naming service for Sui blockchain
- Similar to ENS on Ethereum
- Maps `.sui` domains to objects/addresses

### Our Implementation
1. Register domain on [testnet.suins.io](https://testnet.suins.io/)
2. Point domain to Walrus Site object
3. Access via: `https://<yourname>.trwal.app/`

### Benefits
- ✅ Memorable URLs
- ✅ Professional branding
- ✅ Easy sharing
- ✅ No object IDs needed

---

## 🔄 User Flow

### Creating a Profile
1. User visits site
2. Connects Sui wallet
3. Clicks "Create Profile"
4. Fills form:
   - Username (checked for uniqueness)
   - Bio
   - Avatar URL
   - Theme selection
5. Signs transaction
6. Profile created on-chain
7. Name registered in Registry

### Viewing a Profile
1. User visits: `https://site.trwal.app/profile/<object_id>`
2. Frontend fetches profile from Sui RPC
3. Renders profile with links
4. Tracks view in analytics
5. Clicking link:
   - Tracks click
   - Opens URL in new tab

---

## 📊 Smart Contract Statistics

- **Total Lines**: ~600 lines of Move code
- **Functions**: 20+ public functions
- **Tests**: 2 comprehensive test suites
- **Events**: 6 event types for tracking
- **Error Codes**: 3 well-defined errors

### Deployed Contract
- **Package**: `0x1dbf331569f949091d2217ba3e85204f7d1313185d49dc4030697ccf8136f62b`
- **Registry**: `0x73cf4301d9ce60c36cb76fa0339a9a0f8ac31fa32f9863f08621b6c7e84486f9`
- **Network**: Sui Testnet
- **Explorer**: [SuiScan](https://suiscan.xyz/testnet)

---

## 🧪 Testing

### Smart Contract Tests
```bash
sui move test --verbose
```
- ✅ Profile creation
- ✅ Owner update after transfer
- ✅ Access control (non-owner rejection)

### Frontend Tests
```bash
npm run test
```
- Playwright E2E tests
- Component unit tests
- Integration tests

---

## 🎯 Hackathon Requirements

### ✅ Mandatory Features
- [x] **Smart Contract**: Profile + Registry on Sui
- [x] **Dynamic Fields**: Name → ObjectID mapping
- [x] **Web App**: React + dApp Kit + TypeScript SDK
- [x] **Walrus Sites**: Deployed on Walrus
- [x] **SuiNS**: Domain integration

### ✅ Recommended Features
- [x] **Mysten dApp Kit**: Wallet connection
- [x] **RPC Queries**: Read profile data
- [x] **Flatland Pattern**: Object → Page mapping
- [x] **Bonus Features**: QR, Analytics, Sharing

---

## 🚀 Future Improvements

### Phase 1 (Post-Hackathon)
- [ ] NFT-gated links
- [ ] Custom domains (CNAME)
- [ ] Profile themes marketplace
- [ ] Link scheduling
- [ ] Advanced analytics

### Phase 2 (Growth)
- [ ] Mobile app
- [ ] Browser extension
- [ ] API for developers
- [ ] White-label solution
- [ ] Sponsored transactions (zkLogin)

### Phase 3 (Monetization)
- [ ] Premium themes
- [ ] Advanced analytics
- [ ] Custom branding
- [ ] Team accounts
- [ ] API access tiers

---

## 💡 Key Innovations

1. **Fully On-Chain**
   - No centralized database
   - Profiles are blockchain objects
   - Transparent and auditable

2. **Name Registry**
   - Unique usernames enforced
   - DNS-like resolution
   - Future: marketplace for names

3. **Walrus Storage**
   - Decentralized frontend hosting
   - Permanent availability
   - Cost-efficient

4. **Rich Features**
   - Beyond basic LinkTree
   - Analytics, QR codes, sharing
   - Professional-grade UX

---

## 📈 Market Opportunity

### Current Market
- **LinkTree**: 40M+ users
- **Bio.fm, Beacons, Tap.bio**: Competitors
- **Problem**: Centralized, no ownership, censorship

### Our Advantage
- ✅ True ownership (blockchain)
- ✅ No platform risk
- ✅ Transparent
- ✅ Censorship-resistant
- ✅ Web3-native features

### Target Users
- Crypto influencers
- NFT artists
- DAOs and projects
- Web3 developers
- Content creators in Web3

---

## 🎬 Demo

### Live Demo URLs
- **Frontend**: `http://localhost:5179` (dev)
- **Walrus Site**: `https://<object_id>.trwal.app/`
- **SuiNS Domain**: `https://<name>.trwal.app/`

### Demo Walkthrough
1. Connect wallet ✅
2. Create profile ✅
3. Add/edit links ✅
4. Change theme ✅
5. Generate QR code ✅
6. View analytics ✅
7. Share profile ✅

---

## 📞 Contact & Links

- **GitHub**: [github.com/kdrturan/Blucky](https://github.com/kdrturan/Blucky)
- **Demo Video**: [VIDEO_LINK_HERE]
- **Documentation**: See README.md
- **Explorer**: [SuiScan Testnet](https://suiscan.xyz/testnet)

---

## 🙏 Thank You!

### Built For
**Sui Hackathon 2025**

### Powered By
- Sui Blockchain
- Walrus Storage
- SuiNS
- Mysten Labs SDK

### Resources
- [Sui Docs](https://docs.sui.io/)
- [Walrus Docs](https://docs.wal.app/)
- [SuiNS Docs](https://docs.suins.io/)

---

## ❓ Q&A

**Questions?**

Let's discuss:
- Technical implementation
- Smart contract design
- Walrus integration
- Future roadmap
- Market fit

---

**Thank you for your attention!** 🎉
