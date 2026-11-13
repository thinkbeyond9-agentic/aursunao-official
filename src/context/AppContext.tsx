import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Story, UserState, VentBounty } from '../types';

interface AppContextType {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  lang: 'en' | 'hi';
  setLang: React.Dispatch<React.SetStateAction<'en' | 'hi'>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  // Add other shared state hooks as needed
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>({ name: 'Guest', anon: true, avatar: '', isRegistered: false });
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [stories, setStories] = useState<Story[]>([]);

  return (
    <AppContext.Provider value={{ user, setUser, lang, setLang, stories, setStories }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
