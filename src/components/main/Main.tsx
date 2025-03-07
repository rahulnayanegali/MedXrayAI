'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/Navbar';
import Submain from '../submain/Submain';

const Main = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogin = (_email: string, _password: string, _userType: string) => {
    // Implementation here
    return {_email, _password, _userType}
  }

  useEffect(() => {
    const autoLogin = async () => {
      try {
        await handleLogin('patricia.normann@presbytarian.org', '3451231', 'doctor');
      } catch (_error) {
        router.push('/login');
        console.warn(_error)
      }
    };

    if (!user && !loading) {
      autoLogin();
    }
  }, [user, loading, router]); // Added router to the dependency array

  if (loading || !user) {
    return <div className='h-full w-full text-white inline-flex justify-center items-center'>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-secondary justify-start items-center inline-flex">
      <Navbar />
      <Submain>
        Dashboard
        </Submain>
    </div>
  );
};

export default Main;
