# Poosala Lokesh — Senior Full Stack & Cloud Developer Portfolio

[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Google Cloud Certified](https://img.shields.io/badge/Google_Cloud-Certified_Architect-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://cloud.google.com/certification)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Storage-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

> Production-grade, cloud-architected developer portfolio and headless CMS studio built with React 19, TypeScript, Tailwind CSS v4, and dual-cloud real-time persistence (Supabase + Firebase Firestore).

---

## 🌟 Key Highlights & Features

- **Integrated Developer Studio CMS (`/studio`)**:
  - Full-featured, password-protected administrative dashboard to update profile, work experience, projects, skills, education, Google Cloud credentials, and testimonials without touching code.
  - Multi-tab navigation with instant database persistence and offline local caching.

- **Official Belvo Letter of Recommendation (LOR) Showcase**:
  - Direct vector and PDF document viewer for the official recommendation letter issued by **Hrishikesh Mishra (CEO, Belvo Company)** on 22-09-2026.
  - Full management controls inside the Studio: Replace PDF, change signatory details, toggle visibility, or delete/re-attach anytime.
  - Unblocked native vector rendering immune to browser iframe security restrictions.

- **Live ATS-Optimized Resume Sheet & Document Manager**:
  - Dynamic, live A4 sheet generated directly from portfolio data.
  - One-click **Copy Formatted Plain Text** for rapid job board and ATS applications.
  - Interactive zoom controls, direct print/save-to-PDF (`window.print()`), and instant PDF downloads (`Poosala_Lokesh_Resume.pdf`).
  - Version history archive with Supabase storage integration.

- **Google Cloud Certified — Professional Cloud Architect**:
  - Verifiable cloud credential showcase with credential verification links, skills taxonomy, and interactive preview modal.

- **Dual-Cloud Data Persistence**:
  - **Supabase**: Relational database tables, real-time sync, and S3-compatible cloud storage for PDFs and project media assets.
  - **Firebase Firestore**: Multi-role security rules and backup cloud synchronization.

- **Executive Cyberpunk Aesthetics & Responsive Design**:
  - Tailwind CSS v4 design system with ambient glows, glassmorphism, and hardware-accelerated animations using Framer Motion.
  - Embedded vector cursive signature with zero layout shifts and offline font data.
  - Fully responsive across desktop, tablet, and mobile displays.

- **Multilingual Support (i18n)**:
  - English, Hindi (हिंदी), Spanish (Español), and French (Français) with instant localized translations.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev), [Vite 8](https://vitejs.dev), [TypeScript](https://www.typescriptlang.org) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com), [Lucide React](https://lucide.dev), [Framer Motion](https://www.framer.com/motion/) |
| **Cloud & Backend** | [Supabase](https://supabase.com) (PostgreSQL & Storage CDN), [Firebase Firestore](https://firebase.google.com) |
| **Document Engine** | PDF-Lib, Opentype.js, Vector SVG Sheet Renderer |
| **Hosting & CI/CD** | [Vercel](https://vercel.com) Edge Network, GitHub Actions |

---

## 📁 Repository Structure

```text
├── components/
│   ├── core/                    # Low-level UI primitives & motion effects
│   ├── portfolio/               # Section components
│   │   ├── hero.tsx             # Hero banner with dynamic roles
│   │   ├── about-section.tsx    # Bio, technical focus & stats
│   │   ├── experience-section.tsx # Timeline & Belvo LOR showcase
│   │   ├── certifications-section.tsx # Google Cloud certifications
│   │   ├── project-card.tsx     # Interactive project display
│   │   ├── contact-section.tsx  # Inquiries form & social links
│   │   └── belvo-lor-modal.tsx  # Unblocked LOR document viewer
│   └── ui/                      # Signature, docks, and utility components
├── lib/
│   ├── portfolio-context.tsx    # Global React Context with dual-cloud sync
│   ├── portfolio-types.ts      # TypeScript interfaces & domain models
│   ├── supabase.ts              # Supabase client & media storage helpers
│   ├── firebase.ts              # Firebase Firestore client
│   └── signature-font.ts        # Embedded font curves for instant signature
├── public/
│   ├── belvo-company-logo.svg   # Belvo brand vector asset
│   ├── belvo-lor-page.svg       # Official Belvo LOR high-res vector sheet
│   ├── belvo-lor.pdf            # Official Belvo LOR PDF document
│   ├── resume-page.svg          # High-resolution vector resume sheet
│   └── resume.pdf               # Downloadable ATS resume PDF
├── src/
│   ├── studio/                  # Developer Studio CMS Admin Panel
│   │   ├── StudioLayout.tsx     # Studio navigation & layout wrapper
│   │   └── tabs/                # Tab panels (Profile, Experience, Resume, Projects, etc.)
│   ├── App.tsx                  # Root application router
│   └── main.tsx                 # Application entry point
├── package.json                 # Dependencies & project scripts
├── vite.config.ts               # Vite bundler configuration
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or later (LTS recommended)
- **npm** or **bun** / **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Lokesh-81/lokesh.portfolio.git
   cd lokesh.portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Fill in your configuration:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_PROJECT_ID=your-firebase-project-id

   # Studio Admin Credentials
   VITE_STUDIO_PASSWORD=your-secure-studio-password
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Type Check & Lint**:
   ```bash
   npm run lint
   ```

---

## 🌐 Deploying to Vercel

This repository is pre-configured for zero-configuration deployments on **Vercel**:

1. Import the repository in [Vercel](https://vercel.com/new).
2. Set the **Framework Preset** to `Vite`.
3. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Add your environment variables in Vercel project settings (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.).
5. Click **Deploy**.

---

## 📄 Credentials & Certifications

- **Google Cloud Certified**: Professional Cloud Architect
- **Internship**: Web Development Intern & Frontend Lead @ Belvo Company (Mumbai, India)
- **Education**: Bachelor of Technology (B.Tech) in Computer Science & Engineering (2026)

---

## 📬 Contact & Connect

- **Engineer**: Poosala Lokesh
- **Email**: [poosala15@gmail.com](mailto:poosala15@gmail.com)
- **GitHub**: [@Lokesh-81](https://github.com/Lokesh-81)
- **LinkedIn**: [linkedin.com/in/poosala-lokesh](https://linkedin.com/in/poosala-lokesh)

---

## 📝 License

Distributed under the [MIT License](LICENSE). Built with ❤️ by Poosala Lokesh.
