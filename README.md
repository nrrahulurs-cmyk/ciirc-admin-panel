# CIIRC Admin OS

> **Centre for Intelligent and Interactive Robotics and Cybernetics**  
> Enterprise Research & Institution Management Console

A production-grade, meticulously refined administrative operating system for managing research initiatives, faculty directories, publication indexes, grant portfolios, events, media assets, workflow approvals, and institutional analytics at CIIRC.

---

## Architecture & Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a curated enterprise design system token set
- **Typography**: [Inter](https://rsms.me/inter/) font system with optical kerning and subpixel antialiasing
- **Data Visualizations**: [Recharts](https://recharts.org/) (Smooth natural spline curves, responsive containers)
- **Icons**: [Lucide React](https://lucide.dev/) (Exact 1.85 stroke width, consistent sizing)
- **Theme**: Bi-directional light/dark research console with persistence

---

## Core Modules & Features

1. **Executive Dashboard**:
   - 5 KPI summary cards with dominating bold typography, contextual icons, and trend indicators
   - Research & Activity momentum dual-series area chart
   - Actionable "Requires Attention" operational priority feed
   - Real-time institutional activity stream
   - Quick-action creation tiles and modal launcher

2. **Research & Grants Management**:
   - Full researcher and faculty directory with search, filtering by department, and detail inspector drawer
   - Active grant and funded project tracking with milestone progress bars
   - Publication database with BibTeX exports and DOI links

3. **Event Management**:
   - Institutional symposium, workshop, and guest lecture calendar
   - Attendee capacity progress tracking and roster management

4. **Analytics & Reports**:
   - Multi-metric analytics dashboard with funding distribution and citation trajectories

5. **Content & Governance CMS**:
   - Institutional page and announcement CMS with live Google SERP preview
   - Multi-tier workflow approval pipeline (Draft → Review → Governance → Published)

6. **Media Library & Form Studio**:
   - Institutional media asset manager with grid/list filtering
   - Interactive Form Builder canvas with live preview and submission ledger

7. **Security & Administration**:
   - Role-Based Access Control (RBAC) permission matrix
   - Immutable security audit log stream
   - System settings with profile, security, and integration options

8. **Global Command Palette**:
   - Triggered via `⌘K` or top search pill for rapid keyboard navigation

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/nrrahulurs-cmyk/ciirc-admin-panel.git
cd ciirc-admin-panel

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) to view the application.

### Production Build
```bash
npm run build
npm start
```

---

## Design System Tokens

| Token | Specification |
| :--- | :--- |
| **Primary Color** | CIIRC Blue (`#0066cc`) |
| **Accent Indigo** | Soft Indigo (`#7c8cf8`) |
| **Card Surface** | Light glassmorphism `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(14px)` |
| **Corner Radius** | App Shell: `22px`, Cards: `16px`, Inputs & Buttons: `8–12px` |
| **Typography** | Inter sans-serif: Titles (25px/700), Sections (15px/600), Body (13.5px), Nav (12.5px) |

---

## Institutional Attribution

Developed for the **Centre for Intelligent and Interactive Robotics and Cybernetics (CIIRC)**. All rights reserved.
