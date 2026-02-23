'use client';

import dynamic from 'next/dynamic';

const NotesClient = dynamic(() => import('./NotesClient'), { ssr: false });

export default function Notes() {
  return <NotesClient />;
}
