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
      // Set a stable default page on first load based on role only.
      if (user.role === 'operational') {
        setCurrentPage('/operational/timesheet/dashboard');
      } else {
        setCurrentPage(`/${user.role}/dashboard`);
      }
    }
  }, [user]);

  // Listen to URL changes and sync to currentPage (so clicks that change URL also re-render)
  useEffect(() => {
    const syncFromLocation = () => {
      const pathFromHash = window.location.hash?.slice(1) || '';
      const pathFromPathname = window.location.pathname || '';
      const next = pathFromHash || pathFromPathname;
      if (next && next !== currentPage) {
        setCurrentPage(next);
      }
    };

    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

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
