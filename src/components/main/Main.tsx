'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/Navbar';
// import Submain from '../submain/Submain';

const Main = () => {
  const { user, setUser, setUserType, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = (email: string, password: string, userType: string) => {

  }

  useEffect(() => {
    const autoLogin = async () => {
      try {
        await handleLogin('patricia.normann@presbytarian.org', '3451231', 'doctor');
      } catch (error) {
        router.push('/login');
      }
    };

    if (!user && !loading) {
      autoLogin();
    }
  }, [user, loading]);

  if (loading || !user) {
    return <div className='h-full w-full text-white inline-flex justify-center items-center'>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-secondary justify-start items-center inline-flex">
      <Navbar />
      {/* <Submain /> */}
      Dashboard
    </div>
  );
};

export default Main;
