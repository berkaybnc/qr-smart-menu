# 🍽️ Gastronomic Curator: The Digital Sommelier

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

**Gastronomic Curator** is a premium, high-end Smart QR Menu system designed to move away from the "app-like" density of standard platforms toward a **High-End Editorial** experience. It treats the digital menu not just as a list of items, but as a digital atmosphere—a "Digital Sommelier" for luxury hospitality.

---

## ✨ Key Features

### 🎨 The "Digital Sommelier" Experience
- **Luxury Editorial Design:** Uses intentional asymmetry, tonal depth, and breathable whitespace to mimic premium printed menus.
- **Tonal Layering:** Replaces "dirty" shadows and harsh 1px borders with surface hierarchy and light-based depth.
- **Glassmorphism:** Elegant floating headers and navigation with 20px backdrop-blur and semi-transparent surfaces.

### 🛠️ Dynamic Branding Engine
- **Custom QR Designer:** Personalize QR codes with custom colors, shapes (squares/dots), eye styles, and center logos.
- **Brand Identity:** Full control over primary colors, logos, border-radius styles, and typography.
- **The "No-Line" Rule:** Visual boundaries are defined by background shifts, ensuring a clean and spacious UI.

### 🌍 Multi-language & Localization
- **Native Support:** Fully architected for English (EN), Turkish (TR), and Arabic (AR).
- **RTL Optimization:** Seamless layout mirroring for Arabic, ensuring the premium feel remains consistent across cultures.
- **Currency Management:** Flexible currency settings (TRY, USD, EUR, etc.).

### 🚀 Intelligent Campaign System
- **The "3-Second Rule":** Integrated popup logic that respects the user experience by delaying campaign alerts.
- **Popup Management:** Toggleable active states and custom delays for marketing campaigns.

### 📊 Robust Administration
- **Dashboard:** Comprehensive control panel for restaurant owners to manage categories, products, and branding.
- **Image Processing:** Automated image optimization using Sharp for high-performance assets.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite (via Prisma ORM) |
| **Typography** | Plus Jakarta Sans (Display), Inter (Body) |
| **Tools** | Axios, Bcrypt, JWT, Multer, Sharp |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment:
   - Create a `.env` file based on `.env.example` (if available).
   - Set `DATABASE_URL="file:./dev.db"`
4. Run migrations and generate Prisma client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

---

## 📐 Design Philosophy (The "No-Line" Rule)
This project follows a strict design specification:
- **No 1px solid borders:** Boundaries must be defined by background color shifts.
- **Intentional Asymmetry:** Breaking rigid grids for a more tactile, premium feel.
- **Wasted Space is Luxury:** High contrast and vast whitespace are core to the identity.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🇹🇷 Türkçe Özet
**Gastronomic Curator**, lüks restoranlar için tasarlanmış, "Dijital Sommelier" konseptini benimseyen premium bir Akıllı Karekod Menü sistemidir. 
- **Editoryal Tasarım:** Basılı lüks menülerin dokusunu ve ferahlığını dijital ortama taşır.
- **Marka Motoru:** Karekod tasarımlarından renk paletine kadar her detayı markaya özel hale getirir.
- **Çoklu Dil:** Türkçe, İngilizce ve Arapça dillerine tam uyumludur (RTL desteği dahil).
- **Akıllı Kampanyalar:** Kullanıcı deneyimini bozmayan "3 Saniye Kuralı" ile çalışan pop-up sistemi.
