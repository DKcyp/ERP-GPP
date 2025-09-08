import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, User, LogOut, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                <span className="text-white font-bold text-sm">ERP</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Enterprise System
              </span>
              <div className="flex items-center space-x-1 mt-0.5">
                <Sparkles className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">Professional</span>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/70 hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100 backdrop-blur-sm"
            >
              {/* Removed profile photo as requested */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-blue-600 capitalize font-medium">{user?.role}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                profileDropdown ? 'rotate-180' : ''
              }`} />
            </button>

            {profileDropdown && (
              <div className="absolute right-0 top-full mt-3 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 py-3 animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <button className="w-full flex items-center space-x-3 px-5 py-3 text-left hover:bg-blue-50 text-gray-700 transition-all duration-200 hover:translate-x-1 transform">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Profile Settings</span>
                </button>
                <hr className="my-2 border-blue-100" />
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-5 py-3 text-left hover:bg-red-50 text-red-600 transition-all duration-200 hover:translate-x-1 transform"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
