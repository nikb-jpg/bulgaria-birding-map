'use client';

import dynamic from 'next/dynamic';

const BirdingApp = dynamic(() => import('@/components/BirdingApp'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  return (
    <main style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      <BirdingApp />
    </main>
  );
}
