'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Submain from '../submain/Submain';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/firebase/firebase';
import Dashboard from '../dashboard/Dashboard';

const Main = () => {
  const { user, setUser, setUserType, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string, type: string) => {
    try {
      // Authenticate user
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      if (currentUser) {
        // Check user type
        const userTypeDocRef = doc(db, 'Medical Professional', currentUser.uid);
        const userTypeDocSnapshot = await getDoc(userTypeDocRef);

        if (userTypeDocSnapshot.exists()) {
          // Authorized user
          setUser(currentUser);
          setUserType(type);
          localStorage.setItem('user', JSON.stringify(currentUser));
          localStorage.setItem('userType', type);
          router.push('/');
        } else {
          // Unauthorized user
          setError("You are not authorized to log in as a doctor.");
          await signOut(auth);
        }
      } else {
        console.log("No user signed in");
        // Handle case where no user is signed in
      }
    } catch (error: unknown) {
      // Handle errors
      if (error instanceof Error) {
        setError(error.message); // Display error message to user
        console.error("Login error:", error);
      } else {
        setError("An unknown error occurred");
        console.error("Unknown login error:", error);
      }
    }
  };

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const email = process.env.NEXT_PUBLIC_FIREBASE_EMAIL;
        const password = process.env.NEXT_PUBLIC_FIREBASE_PASSWORD;
        
        if (email && password) {
          await handleLogin(email, password, 'doctor');
        } else {
          console.error('Firebase credentials not found in environment variables');
          router.push('/login');
        }
      } catch (_error: unknown) {
        router.push('/login');
        console.warn(_error);
      }
    };

    if (!user && !loading) {
      autoLogin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router]);


  if (loading || !user) {
    return <div className='h-full w-full text-white inline-flex justify-center items-center'>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-secondary justify-start items-center inline-flex">
      <Submain>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Dashboard />
        )}
      </Submain>
    </div>
  );
};

export default Main;
