"use client"

import dynamic from 'next/dynamic';

const AccreditationClient = dynamic(() => import('./client'), { ssr: false });

export default function AccreditationPage() {
  return <AccreditationClient />;
}
