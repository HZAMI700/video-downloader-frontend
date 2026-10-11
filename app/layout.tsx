import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GrabVid — Download Any Video in Seconds',
  description: 'The fastest way to save video and audio from YouTube, TikTok, Instagram, Facebook, and 100+ other platforms. Free, safe, and unlimited.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
