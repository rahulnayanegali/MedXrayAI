'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoBellFill } from "react-icons/go";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/firebase';
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';

interface NotificationItem {
  id?: string;
  reportid: string;
  date: string;
  status: string;
  message: string;
}

const Notification = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Set up listener for changes in x-ray database
    const q = query(collection(db, "X-ray"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const modifiedData = change.doc.data();
        const documentId = change.doc.id;
        if (change.type === "modified") {
          // Create a notification and upload it to the notification table
          const notificationData: NotificationItem = {
            reportid: documentId,
            date: new Date().toLocaleString(),
            status: modifiedData.status,
            message: modifiedData.mp_comment || 'No comment provided'
          };

          setNotifications(prevNotifications => [...prevNotifications, notificationData]);
          addNotification(notificationData);
        }
      });
    });
    return () => unsubscribe();
  }, [user]);

  const addNotification = async (notificationData: NotificationItem) => {
    try {
      const docRef = await addDoc(collection(db, "Notifications"), notificationData);
      console.log("Notification added with ID #: ", docRef.id);
    } catch (e) {
      console.error("Error adding notification: ", e);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const handlenavigate = (url: string) => {
    router.push(`/reportdetails/${url}`);
  };

  return (
    <div className="relative h-full" ref={dropdownRef}>
      <div className="flex justify-center items-center gap-1 bg-neutral-900 rounded-full h-full p-1.5">
        <GoBellFill
          className="w-12 h-8 text-white cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {notifications.length > 0 && (
          <div style={{ position: 'absolute', top: '10px', right: '14px', width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(166, 252, 175, 1), rgba(181, 167, 247, 1), rgba(88, 84, 129, 1))' }} />
        )}
      </div>
      {isDropdownOpen && (
        <div className="absolute top-full right-2 mt-1 w-auto bg-primary p-3 shadow-lg rounded-lg z-50">
          <ul className='gap-2.5'>
            {notifications.map((notification, index) => (
              <li key={index} onClick={() => handlenavigate(notification.reportid)} className="cursor-pointer">
                <div className="Notification w-full h-16 justify-center items-center gap-2.5 inline-flex">
                  <div className="Details grow shrink basis-0 p-2.5 bg-stone-900 rounded-2xl flex-col justify-center items-start gap-1">
                    <div className="Frame7 self-stretch justify-between items-center inline-flex">
                      <div className="Frame5 justify-start items-start gap-2.5 flex">
                        <div>
                          <span className="text-indigo-300 text-base font-normal">Report ID: </span>
                          <span className="text-white text-base font-normal">{notification.reportid}</span>
                          <span className="text-indigo-300 text-base font-normal"> </span>
                        </div>
                        <span className="text-indigo-300 text-base font-normal">Date: </span>
                        <div className="Report text-white text-base font-normal">{notification.date}</div>
                        <span className="text-indigo-300 text-base font-normal">Report Status: </span>
                        <div className="ReportStatus text-base font-normal text-white">
                          {notification.status === "1" ? "Reviewed" : "Reviewing"}
                        </div>
                      </div>
                      <div className="Frame6" />
                    </div>
                    <span className="text-indigo-300 text-base font-normal">Doctor&apos;s comment: </span>
                    <div className="self-stretch text-white text-base font-normal">{notification.message}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
