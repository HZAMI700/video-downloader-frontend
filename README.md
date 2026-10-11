# Video Downloader Frontend (Next.js 15 + Tailwind CSS)

A modern, high-performance web interface for downloading videos and audio from YouTube, TikTok, Instagram, Twitter/X, Vimeo, Reddit, and hundreds more platforms. Engineered specifically for seamless deployment to **Vercel** with direct integration to a **Botkeep Cloud** Python/FastAPI backend.

---

## Features

- **Modern SaaS UI:** Responsive dark-mode interface with glassmorphism, responsive cards, and clean typography.
- **Direct Backend Integration:** Reads `NEXT_PUBLIC_BACKEND_URL` exclusively. The browser communicates directly with the Python API on Botkeep.
- **No Heavy Binaries on Vercel:** Zero dependency on Python, yt-dlp, or FFmpeg inside Vercel serverless functions, completely bypassing Vercel timeout (10s/60s) and bundle-size limitations.
- **Live Capability Reporting:** Displays real-time backend connection status and FFmpeg status directly in the navigation bar.
- **Genuine Progress Feedback:** Polling-based download state machine tracking true byte count, speed, ETA, and media muxing states.
- **Format & Audio Extraction:** Supports multiple MP4 resolutions (1080p, 720p, 480p, 360p) and audio extraction (MP3 / M4A) according to verified backend availability.
- **Direct File Delivery:** Direct client download link from backend with proper Content-Disposition and MIME types.

---

## Local Development Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm 9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of `video-downloader-frontend`:
```ini
NEXT_PUBLIC_BACKEND_URL=http://node5.botkeep.cloud:41076
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build Check
```bash
npm run build
```

---

## Vercel Deployment Instructions

Follow these step-by-step instructions to deploy to Vercel:

### Step 1: Import Project into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository: `HZAMI700/video-downloader-frontend`.

### Step 2: Build & Output Settings
- **Framework Preset:** Next.js (automatically detected)
- **Root Directory:** `./` (leave default)
- **Build Command:** `next build` (or leave default)
- **Output Directory:** `.next` (or leave default)
- **Install Command:** `npm install` (or leave default)

### Step 3: Configure Environment Variables
In the **Environment Variables** section on Vercel:
- **Key:** `NEXT_PUBLIC_BACKEND_URL`
- **Value:** `http://node5.botkeep.cloud:41076`

### Step 4: Deploy
Click **"Deploy"**. Vercel will build and deploy the application globally to edge nodes in under a minute.

### Step 5: Updating Environment Variables
If your Botkeep URL changes:
1. Go to **Settings** -> **Environment Variables** in your Vercel project.
2. Edit `NEXT_PUBLIC_BACKEND_URL` with your new backend URL.
3. Go to **Deployments** -> Click the three dots `...` on the latest deployment -> **Redeploy** (ensure "Use existing Build Cache" is unchecked so the new environment variable is embedded into the client bundle).

---

## Connection Checklist

- [ ] Backend is running on Botkeep and `https://your-backend.botkeep.app/healthz` returns `{"status":"ok"}`.
- [ ] Backend's `FRONTEND_ORIGINS` includes your Vercel domain (e.g. `https://your-app.vercel.app`).
- [ ] Vercel's `NEXT_PUBLIC_BACKEND_URL` is set to `https://your-backend.botkeep.app` without a trailing slash.
- [ ] Vercel deployment was rebuilt after setting `NEXT_PUBLIC_BACKEND_URL`.
- [ ] The status badge in the navbar shows "API Online".
