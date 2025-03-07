'use client';

import React from 'react';
import Searchbar from '../searchbar/Searchbar';
import Notification from '../notification/Notification';
import Profile from '../profile/Profile';

const Topbar = () => {
  return (
    <div className="flex justify-between items-center p-3 gap-2.5 h-[90px]">
      <Searchbar />
      <Notification />
      <Profile />
    </div>
  );
};

export default Topbar;
