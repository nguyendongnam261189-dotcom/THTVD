import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import { subscribeToAuth } from './services/storage';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = subscribeToAuth((currentUser) => {
        setUser(currentUser);
        setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <>
      {!user ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
