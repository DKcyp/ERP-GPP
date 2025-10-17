import React, { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import MenuBar from "./components/MenuBar";
import Dashboard from "./components/Dashboard";

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState("");

  const navigate = useCallback((path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPage(path);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, ensure we are on the login page
      if (window.location.pathname !== "/login") {
        navigate("/login");
      } else {
        setCurrentPage("/login");
      }
    } else if (isAuthenticated && user) {
      // If authenticated and on the login page, redirect to default dashboard
      if (window.location.pathname === "/login") {
        const defaultPage =
          user.role === "operational"
            ? "/operational/timesheet/dashboard"
            : `/${user.role}/dashboard`;
        navigate(defaultPage);
      } else if (!currentPage) {
        // If authenticated but currentPage is empty (e.g., direct access to a dashboard route)
        setCurrentPage(window.location.pathname);
      }
    }
  }, [isAuthenticated, user, currentPage, navigate]);

  // Listen to URL changes and sync to currentPage (so clicks that change URL also re-render)
  useEffect(() => {
    const syncFromLocation = () => {
      const path = window.location.pathname;
      if (path && path !== currentPage) {
        setCurrentPage(path);
      }
    };

    window.addEventListener("popstate", syncFromLocation);
    window.addEventListener("hashchange", syncFromLocation); // hashchange is still relevant if old links use hashes
    return () => {
      window.removeEventListener("popstate", syncFromLocation);
      window.removeEventListener("hashchange", syncFromLocation);
    };
  }, [currentPage]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <MenuBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pb-8">
        <Dashboard currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
