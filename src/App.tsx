import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Navbar from './components/Navbar';
import MenuBar from './components/MenuBar';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    if (user) {
      setCurrentPage(`/${user.role}/dashboard`);
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <MenuBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pb-8">
        <Dashboard currentPage={currentPage} />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
