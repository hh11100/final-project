'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';

      // Clear the 'userId' cookie
      document.cookie = 'userId=; Max-Age=0; path=/;';

      // Redirect to the login page or homepage
      router.push('/login');
    }
  }, []);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
