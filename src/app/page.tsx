// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/asset-analytics');
  // Note: redirect() throws a NEXT_REDIRECT error, so code below this line might not execute as expected.
  // For a component, returning null or the redirect itself is typical.
  return null;
}
