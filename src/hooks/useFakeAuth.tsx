import { createContext, useContext, useState, ReactNode } from 'react';

interface FakeAuthContextType {
  isFakeLoggedIn: boolean;
  toggleFakeAuth: () => void;
}

const FakeAuthContext = createContext<FakeAuthContextType | undefined>(undefined);

export const FakeAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isFakeLoggedIn, setIsFakeLoggedIn] = useState(false);

  const toggleFakeAuth = () => {
    setIsFakeLoggedIn(!isFakeLoggedIn);
  };

  return (
    <FakeAuthContext.Provider value={{ isFakeLoggedIn, toggleFakeAuth }}>
      {children}
    </FakeAuthContext.Provider>
  );
};

export const useFakeAuth = () => {
  const context = useContext(FakeAuthContext);
  if (context === undefined) {
    throw new Error('useFakeAuth must be used within a FakeAuthProvider');
  }
  return context;
};
