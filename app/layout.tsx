import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VidStream Pro — Fast & Secure Video Downloader',
  description: 'Universal media downloader powered by FastAPI, yt-dlp, and Next.js. Deployed on Vercel and Botkeep Cloud.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
