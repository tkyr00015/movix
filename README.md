# Movix - Netflix-Style Movie & TV Streaming Platform 🎬

A modern, responsive, 100% login-free Netflix clone built with **Next.js 14**, **Tailwind CSS**, and **TMDB API**, featuring real ad-free multi-server streaming (Vidly, VidLink, AutoEmbed, Vidy, Vidbolt).

---

## ✨ Features

- 🍿 **Authentic Netflix UI & Theme:**
  - Immersive Hero Billboard with trending backdrop, title, overview, and quick-play.
  - Smooth horizontal sliding carousels for Bollywood, South Indian Cinema, Hollywood, and Web Series.
  - Iconic Netflix **Top 10 Today** row with large typography rank numbers.
  - Hover previews and Netflix-style detail modal with synopsis, cast, and similar recommendations.
- 📺 **Ad-Free Multi-Server Video Player:**
  - Clean video player with a **Multi-Server Switcher** (Server 1: *Vidly*, Server 2: *VidLink*, Server 3: *AutoEmbed*, etc.).
  - **Strict Sandbox Protection:** Kills 99% of popup ads, redirects, and new tabs.
  - Full TV Show support with **Season & Episode Pickers** and **Next Episode** quick button.
- 🇮🇳 **Optimized for Indian & Global Audiences:**
  - Dedicated Bollywood and South Indian (Telugu, Tamil, Malayalam, Kannada) categories.
  - Ultra-fast loading optimized for mobile data (Jio, Airtel 4G/5G).
  - Built-in TMDB API proxy (`/api/tmdb/...`) so Indian ISPs never block metadata or posters.
- ⚡ **100% Login-Free & Privacy First:**
  - No email, no passwords, no registration required.
  - **"Continue Watching"** and **"My Watchlist"** work automatically using browser `localStorage`.
- 💰 **$0 Running Cost:**
  - Free hosting on Vercel or Cloudflare Pages.
  - Free metadata and image CDN from TMDB.
  - Unlimited video streaming bandwidth handled by embed providers.

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd movix
npm install
```

### 2. Set Up TMDB API Key
Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```
Add your free TMDB API Key from [themoviedb.org](https://www.themoviedb.org/settings/api):
```env
TMDB_API_KEY=your_actual_tmdb_api_key_here
NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_api_key_here
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel for Free ($0)

1. Push this folder to a new repository on **[GitHub](https://github.com/)**.
2. Go to **[Vercel](https://vercel.com/)** and click **"Add New Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `TMDB_API_KEY` = `your_tmdb_api_key`
5. Click **Deploy**. Your site will be live on a free `.vercel.app` domain with automatic HTTPS!

---

## 🛠️ Changing Website Name & Brand

To change the site name, color theme, or add more servers, simply edit **`src/lib/siteConfig.ts`**:
```typescript
export const siteConfig = {
  name: "YourBrandName", // Change to whatever you like!
  accentColor: "#E50914", // Netflix Red
  servers: [ ... ],       // Add or reorder stream providers
};
```
Everything across the website updates automatically!
