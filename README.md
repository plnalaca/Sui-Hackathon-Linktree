# 🔗 Blucky - On-Chain LinkTree on Sui Blockchain

[![Sui](https://img.shields.io/badge/Sui-Blockchain-blue)](https://sui.io/)
[![Walrus](https://img.shields.io/badge/Walrus-Storage-green)](https://walrus.xyz/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> A decentralized LinkTree alternative built on Sui blockchain with Walrus storage, enabling users to create and share customizable profile pages with links, all stored on-chain.

## 🌟 Features

### Core Features
- ✅ **On-Chain Profiles**: All profile data stored on Sui blockchain
- ✅ **Dynamic Link Management**: Add, edit, delete, and reorder links
- ✅ **Custom Themes**: 5 beautiful pre-designed themes
- ✅ **Avatar Support**: Profile avatars with IPFS/URL support
- ✅ **Wallet Integration**: Seamless connection with Sui wallets
- ✅ **Name Registry**: Human-readable profile names (like DNS)

### Bonus Features 🎁
- 📊 **Analytics Dashboard**: Track views and link clicks
- 📱 **QR Code Generator**: Share profiles via QR codes
- 🔗 **Social Sharing**: One-click share to Twitter, Facebook, WhatsApp
- 🎨 **Drag & Drop**: Reorder links with intuitive drag-and-drop

### Technology Stack
- **Blockchain**: Sui Move smart contracts
- **Storage**: Walrus Sites (decentralized blob storage)
- **Frontend**: React + TypeScript + Vite
- **SDK**: @mysten/dapp-kit + @mysten/sui
- **Styling**: TailwindCSS
- **Domain**: SuiNS integration

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│         (React + Vite + TailwindCSS)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Mysten dApp Kit & TypeScript SDK                │
│         (Wallet Connection + Transaction Builder)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Sui Blockchain (Testnet)                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │   Profile Objects (Owned by Users)                 │    │
│  │   • name, bio, avatar, theme, links[]              │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │   Registry (Shared Object)                          │    │
│  │   • name → profile_id mapping                       │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Walrus Sites (Blob Storage)                     │
│         Frontend assets stored as blobs                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    SuiNS Domain                              │
│              <yourname>.sui → Site Object                    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and npm/pnpm
- **Sui CLI** (install via [Sui docs](https://docs.sui.io/guides/developer/getting-started/sui-install))
- **Walrus CLI** (for deployment)
- **Sui Wallet** (browser extension)
- **Testnet SUI tokens** (from faucet)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kdrturan/Blucky.git
cd Blucky/onchain-linktree
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Run development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Smart Contract

### Contract Details
- **Package ID**: `0x1dbf331569f949091d2217ba3e85204f7d1313185d49dc4030697ccf8136f62b`
- **Registry ID**: `0x73cf4301d9ce60c36cb76fa0339a9a0f8ac31fa32f9863f08621b6c7e84486f9`
- **Network**: Sui Testnet
- **Module**: `onchain_linktree::linktree`

### Key Functions

```move
// Create a new profile
public fun create_profile(
    registry: &mut Registry,
    name: vector<u8>,
    bio: vector<u8>,
    avatar_cid: vector<u8>,
    theme: u64,
    links: vector<Link>,
    ctx: &mut TxContext
)

// Add a link
public fun add_link(
    profile: &mut Profile,
    label: vector<u8>,
    url: vector<u8>,
    ctx: &TxContext
)

// Update profile bio
public fun set_bio(
    profile: &mut Profile,
    new_bio: vector<u8>,
    ctx: &TxContext
)

// Look up profile by name
public fun lookup_profile(
    registry: &Registry,
    name: vector<u8>
): Option<ID>
```

### Build & Test Contracts

```bash
cd contracts
sui move build
sui move test --verbose
```

## 🌐 Deployment

### Deploy to Walrus Sites

1. **Build frontend**
```bash
cd frontend
npm run build
```

2. **Deploy to Walrus** (requires site-builder)
```bash
site-builder deploy ./dist --epochs 1
```

3. **Copy the Site Object ID** from output

4. **Access your site**
- Via B36 ID: `https://<object_id>.trwal.app/`
- Via SuiNS: `https://<name>.sui.trwal.app/` (after domain setup)

### SuiNS Domain Setup

1. Visit [testnet.suins.io](https://testnet.suins.io/)
2. Register your desired `.sui` domain
3. Point it to your Walrus Site object
4. Access via: `https://<yourname>.trwal.app/`

## 📖 Usage Guide

### Creating a Profile

1. **Connect Wallet**: Click "Connect Wallet" and select your Sui wallet
2. **Create Profile**: Click "Create Profile" button
3. **Fill Details**:
   - Choose a unique username
   - Add bio and avatar URL
   - Select a theme
   - Add your links
4. **Submit**: Sign the transaction with your wallet

### Managing Links

- **Add Link**: Click "Add Link" button
- **Edit Link**: Click edit icon on any link
- **Delete Link**: Click delete icon
- **Reorder**: Drag and drop links to reorder

### Sharing Your Profile

- **Direct Link**: Share your profile URL
- **QR Code**: Generate and download QR code
- **Social Media**: Use quick share buttons

## 🧪 Testing

### Run Playwright Tests
```bash
cd frontend
npm run test
```

### Manual Testing Checklist
- [ ] Wallet connection works
- [ ] Profile creation successful
- [ ] Links can be added/edited/deleted
- [ ] Theme switching works
- [ ] QR code generation works
- [ ] Analytics tracking works
- [ ] Social sharing works

## 🔧 Configuration

### Environment Variables

Create `.env` in `frontend/`:
```env
VITE_SUI_NETWORK=testnet
VITE_PACKAGE_ID=0x1dbf331569f949091d2217ba3e85204f7d1313185d49dc4030697ccf8136f62b
VITE_REGISTRY_ID=0x73cf4301d9ce60c36cb76fa0339a9a0f8ac31fa32f9863f08621b6c7e84486f9
```

### Walrus Configuration

Located at `~/.walrus/sites-config.yaml`:
```yaml
default_context: testnet
contexts:
  testnet:
    portal: trwal.app
    package: 0xf99aee9f21493e1590e7e5a9aea6f343a1f381031a04a732724871fc294be799
    general:
      wallet_env: testnet
      walrus_context: testnet
```

## 📱 Screenshots

[Add screenshots here]

## 🎥 Demo Video

🎬 **[Watch Demo Video](VIDEO_LINK_HERE)** (3-5 minutes)

Demo includes:
- Profile creation
- Link management
- Theme customization
- Bonus features (QR, Analytics, Sharing)
- Walrus Sites access
- SuiNS domain resolution

## 📊 Project Stats

- **Smart Contract**: ~600 lines of Move code
- **Frontend**: React + TypeScript (~3000+ lines)
- **Components**: 15+ React components
- **Tests**: Unit tests + E2E tests with Playwright
- **Themes**: 5 customizable themes
- **Bonus Features**: 3 advanced features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Sui Foundation](https://sui.io/) - Blockchain platform
- [Walrus](https://walrus.xyz/) - Decentralized storage
- [Mysten Labs](https://mystenlabs.com/) - Development tools
- [SuiNS](https://suins.io/) - Naming service

## 📞 Contact

- **GitHub**: [@kdrturan](https://github.com/kdrturan)
- **Project Link**: [https://github.com/kdrturan/Blucky](https://github.com/kdrturan/Blucky)

## 🔗 Links

- [Sui Documentation](https://docs.sui.io/)
- [Walrus Documentation](https://docs.wal.app/)
- [SuiNS Documentation](https://docs.suins.io/)
- [Mysten SDK](https://sdk.mystenlabs.com/)

---

**Built with ❤️ for the Sui Hackathon**
