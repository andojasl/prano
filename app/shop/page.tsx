import { redirect } from 'next/navigation';

export default function Shop() {
  // Redirect /shop to /shop/all
  redirect('/shop/all');
} 