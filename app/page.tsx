import { redirect } from 'next/navigation';

export default function HomePage() {
  // For now, redirect to login
  // In a real app, you'd check authentication status here
  redirect('/login');
}

