# 🌿 CarbonVault

> **Blockchain-Based Carbon Credit Verification & Trading Platform**  
> An enterprise-grade, transparent prototype simulating the end-to-end carbon credit lifecycle: from ecological project due diligence and land record verification to tokenization, secondary market exchange, and permanent offset retirement.

---

## 📌 Product Overview

**CarbonVault** addresses integrity, provenance, and transparency challenges in voluntary and compliance carbon markets. By combining structured due diligence (revenue land records, GIS boundary mapping, and carbon sequestration models) with blockchain-inspired tokenization (ERC-721 NFT credit batches), the platform provides an auditable lifecycle:

```text
PRODUCER                    CERTIFIER                    MARKETPLACE               PARTICIPANT / ADMIN
┌──────────────┐     ┌─────────────────────┐     ┌─────────────────┐     ┌────────────────────┐
│ Create       │ ──► │ Due Diligence Audit │ ──► │ Tokenize (NFT)  │ ──► │ Buy, Trade, Transfer│
│ Proposal     │     │ & 7/12 Validation   │     │ & List Credits  │     │ or Permanently Burn│
└──────────────┘     └─────────────────────┘     └─────────────────┘     └────────────────────┘
```

---

## 🎯 Role-Based Modules & Key Features

The platform provides dedicated workspaces tailored to four distinct personas across the carbon credit lifecycle:

### 🌾 1. Producer Workspace (`/producer/*`)
* **Project Creation Wizard**: 4-step structured submission collecting project parameters, methodology, cadastral survey/Gat numbers, and expected $\text{tCO}_2\text{e}$ removals.
* **Geospatial & Revenue Proof**: Interactive boundary mapping with GPS coordinates and multi-file evidence upload (Maharashtra 7/12 & 8A extracts, baseline satellite imagery, plantation logs).
* **Verification Pipeline Tracking**: Real-time stage tracking with feedback & document resubmission directly to verification authorities.
* **Tokenized Inventory & Exchange Listing**: View issued ERC-721 token batches and list credits on the order book with automatic custody fee calculations in INR ($\text{₹}$).
* **Order & Transaction Ledger**: Track active bids, matched trades, and on-chain transfer records.

### 🛡️ 2. Certifier / Verification Authority (`/certifier/*`)
* **Verification Request Queue**: Centralized auditor backlog filterable by project type, region, and readiness.
* **Interactive Project Audit**:
  * **Cadastral & Land Consistency Check**: Geometric congruence validation against digital 7/12 land records.
  * **Geospatial Overlap Inspection**: Multi-temporal satellite boundary verification via `MockMap`.
  * **Document-by-Document Sign-off**: Individual verify, flag, or reject controls.
  * **10-Point Auditor Checklist**: Real-time progress bar ensuring complete due diligence before issuing credits.
* **Regulatory Decision Modals**:
  * *Approve & Certify*: Automatically mints NFT tokens (`NFT-...`) into developer wallets and generates issuance transactions.
  * *Request Clarification*: Issues structured feedback back to the producer.
  * *Formal Rejection*: Records regulatory grounds and audit notes.
* **Official Compliance Reports**: Generates printable *Certificates of Carbon Verification* with Accredited Carbon Verification Agency (ACV) seals under the BEE compliance framework.

### 💼 3. Market Participant Desk (`/market/*`)
* **Carbon Credit Exchange**: Filterable marketplace with price sliders, methodology filters, and project search.
* **Credit Provenance & History**: Transparent view of baseline satellite boundaries, ACV verifier audit findings, smart contract addresses, and complete lifecycle provenance.
* **Simulated Web3 Buy Flow**: Volume picker, cost breakdown (subtotal + 1% custody fee in $\text{₹}$), and wallet signature confirmation with gas fee simulation.
* **Order Book & Matching Engine**: Depth chart displaying live Bids vs. Asks with an interactive automated order matching simulator.
* **Custody Transfers & Permanent Retirement**:
  * Peer-to-peer on-chain token transfer to external wallet addresses.
  * Irreversible offset burning generating unique certificates (e.g. `RET-00091`) with specific ESG cause classifications.
* **Environmental Impact Dashboard**: Tracks realized net-zero offsets, equivalent tree seedlings planted, and passenger vehicle kilometers neutralized.

### ⚙️ 4. Admin & Governance Portal (`/admin/*`)
* **Platform Control Center**: Real-time metrics across 1,200+ users, 350+ projects, and 185,000+ tokenized credits.
* **User & Role Management**: Directory with controls to adjust role permissions and suspend/activate accounts.
* **Central Registries**: Platform-wide master registers for all projects, accredited certifiers, active/revoked credit batches, and secondary marketplace orders.
* **Blockchain Activity Stream**: Live feed of on-chain smart contract events with block confirmations and transaction hashes.
* **Compliance & Audit Logs**: ISO 14064 tamper-evident action trail logging every platform event.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (`react`, `react-dom`) | Component-driven UI and role-based workspaces |
| **Language** | TypeScript | Strong typing and data model integrity |
| **Build Tool** | Vite | Lightning-fast HMR and optimized production bundling |
| **Styling & Design** | Tailwind CSS | Clean, responsive, enterprise fintech & climate-tech aesthetic |
| **Icons** | Lucide React | Modern interface iconography |
| **Routing** | React Router DOM (v6) | Declarative role-based routing and route guards |
| **State Management** | React Context API | Global reactive state (`AuthContext`, `AppContext`) with LocalStorage persistence |
| **Geospatial & Maps** | `MockMap` Component | Simulated satellite contours, parcel boundaries, and GPS coordinates |
| **Forms & Validation** | React Hook Form + Zod | Multi-step form management and validation |

---

## 📂 Project Structure

```text
CarbonVault/
├── src/
│   ├── components/
│   │   ├── layout/            # AppShell, Header, Sidebar, NotificationPanel, MockWalletModal
│   │   └── ui/                # CreditCard, DataTable, StatCard, StatusBadge, MockMap, ConfirmModal, etc.
│   ├── context/
│   │   ├── AuthContext.tsx    # Mock authentication, role detection, session storage
│   │   └── AppContext.tsx     # Reactive state for projects, credits, orders, transactions, notifications
│   ├── data/                  # Static fixtures (users, projects, credits, orders, transactions, auditLogs)
│   ├── lib/
│   │   └── utils.ts           # Currency (INR), date formatting, status styling, mock ID generators
│   ├── pages/
│   │   ├── auth/              # LoginPage
│   │   ├── producer/          # 10 Producer pages (Dashboard, CreateProject, Verification, Credits, etc.)
│   │   ├── certifier/         # 9 Certifier pages (Queue, Review, Documents, LandRecords, Reports, etc.)
│   │   ├── market/            # 12 Market pages (Marketplace, Buy, Portfolio, OrderBook, Retire, Impact, etc.)
│   │   └── admin/             # 12 Admin pages (Users, Projects, Verification, Blockchain, AuditLogs, etc.)
│   ├── routes/                # Router tree and ProtectedRoute guards
│   ├── types/                 # Shared TypeScript interfaces and domain models
│   ├── App.tsx                # App root provider wrapper
│   ├── index.css              # Tailwind base, utilities, and scrollbar styling
│   └── main.tsx               # Entry point mounting React DOM
├── index.html                 # HTML template with Inter font preload
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Custom palette (forest green, emerald, slate)
├── tsconfig.json              # TypeScript compilation configuration
└── vite.config.ts             # Vite build and path aliases
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (version 9 or higher)

### Installation & Local Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd c:\Users\Abhaykumar\Downloads\CarbonVault
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```text
   http://localhost:5173
   ```

### Production Build
To create an optimized production build:
```bash
npm run build
```
The compiled assets will be output to the `dist/` directory.

---

## 🔑 Demo Persona Accounts

For quick evaluation, select any of the pre-configured personas on the login screen or click **"Connect Simulated Wallet"**:

| Role | Name | Email | Organization |
| :--- | :--- | :--- | :--- |
| **Producer** | Rajesh Patil | `rajesh@greenroots.in` | GreenRoots Farms |
| **Producer** | Priya Sharma | `priya@solarfarm.in` | SolarGrid Energy |
| **Certifier** | Demo Verification Officer | `verify@greencert.in` | Green Certification Agency |
| **Market Participant** | Abhay Kumar | `abhay@abccorp.com` | ABC Corporation |
| **Market Participant** | Meera Joshi | `meera@ecobuyers.com` | EcoBuyers Ltd. |
| **Administrator** | Platform Administrator | `admin@carbonvault.demo` | CarbonVault Core |

*Default password for all demo accounts:* `demo123`

---

## 📜 License

This project is a functional prototype built for educational and demonstration purposes. All blockchain transactions, token IDs, wallet signatures, and government registry checks are simulated.
