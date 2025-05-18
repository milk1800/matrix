import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/asset-analytics');
  // redirect() must be called outside of a try/catch block.
  // It also must be the last thing called in a Server Action or Route Handler.
  // As this is a page, it should work fine.
  // We return null because redirect throws a NEXT_REDIRECT error.
  return null;
}
