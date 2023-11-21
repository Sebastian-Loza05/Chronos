import React, { createContext, useState, useEffect } from 'react';
import { fetchUserProfile } from './api'; // Asegúrate de ajustar la ruta de importación según sea necesario

export const UserProfileContext = createContext(null);

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      const result = await fetchUserProfile();
      if (result.profile) {
        setUserProfile(result.profile);
      } else if (result.error) {
        console.error('Error fetching user profile:', result.error);
      }
    };

    getUserProfile();
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

