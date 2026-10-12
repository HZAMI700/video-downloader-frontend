export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: 'How to download TikTok videos without watermark using Playzy?',
    a: 'To download TikTok videos without watermark, copy the TikTok video or short link, paste it into the Playzy search bar at the top, and click Download. Playzy automatically extracts the direct clean MP4 stream without any watermark in original HD resolution.',
  },
  {
    q: 'How do I download videos and pins from Pinterest?',
    a: 'Copy the Pinterest video pin URL (including pin.it short links), paste it into Playzy, and press Download. Playzy unshortens the pin link, extracts the highest quality 1080p/720p MP4 video directly from Pinterest CDN, and lets you save it to your device instantly.',
  },
  {
    q: 'Can I download Facebook Reels and Watch videos in HD?',
    a: 'Yes. Playzy supports all public Facebook Reels, fb.watch links, and Watch video posts. Simply paste your Facebook URL to download the video in 1080p Full HD or 720p MP4 with full integrated sound and zero buffering.',
  },
  {
    q: 'How to convert videos to MP3 320kbps crystal audio?',
    a: 'Paste the media link from YouTube, TikTok, Facebook, or Instagram, and select the "MP3 (320kbps)" option in the download card. Our high-performance FFmpeg engine will extract and encode the soundtrack into crystal clear high-bitrate MP3 audio.',
  },
  {
    q: 'Is Playzy free, safe, and legal to use?',
    a: 'Playzy is 100% free and safe to use with zero registration, no software downloads, and no intrusive ads. You can legally download publicly accessible videos and content that you own or have permission to save for offline personal viewing.',
  },
  {
    q: 'Does Playzy work on iPhone (iOS), Android, and desktop PC?',
    a: 'Yes! Playzy is a responsive progressive web app that runs directly in any modern browser including Safari on iPhone/iPad, Chrome on Android, and all desktop browsers on Windows, Mac, and Linux without requiring extensions.',
  },
  {
    q: 'Are downloaded media files stored on your servers?',
    a: 'No. Playzy values your privacy. Downloaded media files are stored temporarily in an isolated, sandboxed cache and are automatically purged from our cloud servers after 15 minutes. We never log or sell your download activity.',
  },
];
