'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function App() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';

      // Clear the 'userId' cookie
      document.cookie = 'userId=; Max-Age=0; path=/;';

      // Redirect to the login page or homepage
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};
