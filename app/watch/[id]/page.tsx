import type { Metadata } from 'next';
import { WatchPlayerClient } from './WatchPlayerClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Watch Video Stream - Torrent Media | Playzy`,
    description: `Stream torrent video in high definition using Webtor engine. ID: ${id}`,
  };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WatchPlayerClient id={id} />;
}
