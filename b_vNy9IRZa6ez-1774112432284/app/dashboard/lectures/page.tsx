"use client"

import dynamic from 'next/dynamic';

const LecturesClient = dynamic(() => import('./client'), { ssr: false });

export default function LecturesPage() {
  return <LecturesClient />;
}
