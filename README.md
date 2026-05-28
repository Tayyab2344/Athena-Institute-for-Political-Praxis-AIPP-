# Athena Institute for Political Praxis (AIPP)

An international institute advancing women's political leadership, governance research, institutional reform, and strategic public policy.

AIPP combines rigorous political theory with practical application across three core divisions: Strategic Action & Simulation (SAS), Research & Policy Innovation (RPI), and Communication & Public Advocacy (CPA).

---

## 🏛️ Project Architecture & Divisions

The application is built using **Next.js (App Router)** and styled using custom **Vanilla CSS** tokens to maintain design precision and a premium institutional aesthetic.

### 1. ⚔️ Strategic Action & Simulation (SAS) — `/sas`
- Immersive political simulation cases (e.g., *Operation Meridian Shift*, *The Geneva Synthesis*).
- Core lab programs grid, philosophy documentation, and a horizontal journey timeline tracking the progression from analysis to reflection.

### 2. 🔍 Research & Policy Innovation (RPI) — `/rpi`
- Scientific and academic inquiry pillars of modern states.
- 4-column responsive publications catalog featuring peer-reviewed whitepapers, journal articles, and policy briefs.
- Active residency overview for *The Global Fellows Program*.

### 3. 📢 Communication & Public Advocacy (CPA) — `/cpa`
- Campaigns focused on civic literacy, public dialogue, and strategic media engagement.
- Features a split layout with high-impact outreach metrics (`4.2M+` citizens reached) and a deep-blue statement quotes section.
- Side-by-side case studies for ongoing initiatives (e.g., *Transparency in Lobbying*, *Youth Voter Literacy*).

---

## 💎 Custom Engineering Features

### 🌟 Premium Dropdown Navigation
- The "What We Offer" menu features a deep navy glassmorphic mega dropdown on desktop (heavy backdrop blur, low-opacity gold outline, radial highlight glows on hover) and a smooth accordion drawer for touch-friendly mobile screens.

### 🚀 Scroll Reveal System
- Implements a global, high-performance Intersection Scroll Observer component (`ScrollObserver.jsx`) attached to the root layout.
- Listens to Next.js route transitions via `usePathname()` to automatically attach and disconnect listeners, preventing memory leaks while keeping pages static.
- Hardware-accelerated CSS animations (`.reveal-up`, `.reveal-fade`, `.reveal-left`, `.reveal-right`) styled with custom decelerating cubic-bezier curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 🛠️ Development & Commands

### Prerequisites
- Node.js (v18.x or higher)
- npm

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Running Locally
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build and Compilation
Verify static generation and compile the application for production:
```bash
npm run build
```
This prerenders routes (`/`, `/about`, `/sas`, `/rpi`, `/cpa`) into highly optimized static HTML.
