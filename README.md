# PulseFit - Next-Gen Gym Management Platform

PulseFit is a modern, high-performance web application designed to manage premium fitness centers. It combines a sleek, "Apple Wallet" style member experience with a powerful "Mission Control" admin dashboard.

![PulseFit Preview](https://placehold.co/1200x600/10b981/0a0f1c?text=PulseFit+Preview)

## 🚀 Features

### For Members (`/dashboard`)
- **Digital Entry Pass**: Switch between **QR Code** and **Biometric** entry modes.
- **Real-Time Stats**: View active streak, weight trends, and upcoming classes.
- **Mobile-First Design**: Smooth, app-like experience with glassmorphism UI.

### For Admins (`/admin`)
- **Mission Control**: A futuristic dashboard monitoring gym health.
- **Live Occupancy Tracking**: Real-time crowd meter synced across all devices (demonstrates **Zustand** + **BroadcastChannel** state sync).
- **Access Control**: Instantly toggle a member's entry method (QR vs Biometric) remotely.
- **Lead Managment**: Track sales pipeline and member status.

### Public Site (`/`)
- **Immersive Landing Page**: High-performance marketing page with scroll animations.
- **Crowd Meter**: Public-facing widget showing current gym capacity.
- **Multi-Step Checkout**: Frictionless signup flow with "Pay at Gym" reservation support.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom "Neon/Dark" theme.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Client state & Cross-tab sync).
- **Animations**: [Framer Motion](https://www.framer.com/motion/).
- **Icons**: [Lucide React](https://lucide.dev/).
- **QR Codes**: `react-qr-code`.

## 📂 Project Structure

```bash
/
├── app/
│   ├── (admin)/        # Admin Routes (protected layout)
│   ├── (public)/       # Marketing Routes & Member Pages
│   └── layout.tsx      # Root Layout
├── components/
│   ├── admin/          # Admin-specific widgets (Sidebar, Controllers)
│   ├── layout/         # Shared layouts (Navbar, Footer)
│   ├── member/         # Member features (DigitalPass)
│   ├── sections/       # Landing Page sections
│   └── ui/             # Reusable atoms (Buttons, Cards)
├── lib/
│   ├── mockData.ts     # Static data for prototyping
│   ├── store.ts        # Global Zustand store
│   └── utils.ts        # Helper functions (cn for Tailwind)
└── public/             # Static assets
```

## ⚡ Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Public Site: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin`
   - Member Dashboard: `http://localhost:3000/dashboard`

## 🧪 Key Demos

- **Live Sync**: Open `/admin` and `/` in two side-by-side windows. Drag the **Occupancy Slider** in Admin and watch the **Crowd Meter** update instantly on the public site.
- **Dynamic Entry**: Open `/dashboard`. In `/admin`, toggle the **Access Control** switch to see the Digital Pass transform from QR to Biometric.

---
*Built with ❤️ by the WebOrbs Engineering Team.*
