'use client';

import React from 'react';
import Footer from '../footer/Footer';
import Topbar from '../topbar/Topbar';
// import { usePathname } from 'next/navigation';

const Submain = ({ children }: { children: React.ReactNode }) => {
  // const pathname = usePathname();
  
  // // Optional: Add path-based styling if needed
  // const isReportPage = pathname?.startsWith('/reportdetails/');

  return (
    <div className="h-full w-full flex flex-col">
      <Topbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Submain;
