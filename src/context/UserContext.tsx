import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User } from '@/types';

const UserContext = createContext<{ user: User | null; clearCache: () => void } | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state to handle the async data fetching

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user data is in localStorage
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          console.log(JSON.parse(cachedUser));
          setLoading(false);
          return;
        }

        const userId = Cookies.get('userId');
        if (userId) {
          // Make an API call to fetch the user's data
          const response = await fetch('/api/users/me');

          if (response.ok) {
            const userData = await response.json();
            console.log(userData);
            setUser(userData);

            // Cache the user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            console.error('Failed to fetch user data:', response.statusText);
            setUser(null); // Handle any issues by resetting user to null
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null); // Reset user in case of an error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserData();
  }, []);

  const clearCache = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, clearCache }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
