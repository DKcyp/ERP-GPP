import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { marketingMenu, operationalMenu, hrdMenu, pengadaanMenu, financeMenu } from '../data/menuConfig'; // Added financeMenu
import { ChevronDown, BarChart3, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface MenuBarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuSections = user?.role === 'marketing' ? marketingMenu : 
                      user?.role === 'operational' ? operationalMenu : 
                      user?.role === 'hrd' ? hrdMenu : 
                      user?.role === 'pengadaan' ? pengadaanMenu : 
                      user?.role === 'finance' ? financeMenu : // Added financeMenu
                      marketingMenu; // Default to marketingMenu if role is not recognized

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (sectionTitle: string) => {
    const section = menuSections.find(s => s.title === sectionTitle);
    if (section?.directPath) {
      handleItemClick(section.directPath);
      return;
    }
    setActiveDropdown(activeDropdown === sectionTitle ? null : sectionTitle);
  };

  const handleItemClick = (path: string) => {
    setCurrentPage(path);
    setActiveDropdown(null);
  };

  const handleMainDashboardClick = () => {
    const dashboardPath = `/${user?.role}/dashboard`;
    setCurrentPage(dashboardPath);
    setActiveDropdown(null);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />;
  };

  const isMainDashboard = currentPage === `/${user?.role}/dashboard`;

  return (
    <div className="bg-white sticky top-[4.0rem] z-40 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Menu Bar */}
        <div className="hidden md:flex items-center justify-start px-4 py-2.5 space-x-2">
          {/* Main Dashboard */}
          <button
            onClick={handleMainDashboardClick}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-300 hover:scale-105 transform shadow-sm hover:shadow-md ${
              isMainDashboard 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-600/30 ring-2 ring-blue-200/50' 
                : 'text-gray-800 bg-gray-100 hover:bg-gray-200 hover:text-blue-700 border border-gray-300 hover:border-blue-300'
            }`}
          >
            <div className={`p-0.5 rounded-md ${isMainDashboard ? 'bg-white/20' : 'bg-blue-100'}`}>
              <LucideIcons.Home className="h-3.5 w-3.5" /> {/* Changed to Home icon */}
            </div>
            <span>Main Dashboard</span>
            {isMainDashboard && <Zap className="h-2.5 w-2.5 text-yellow-300" />}
          </button>

          {/* Menu Section Items */}
          {menuSections.filter(section => section.title !== 'Main Dashboard').map((section) => ( // Filter out 'Main Dashboard' as it's handled separately
            <div key={section.title} className="relative">
              <button
                onClick={() => toggleDropdown(section.title)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-300 hover:scale-105 transform shadow-sm hover:shadow-md ${
                  (activeDropdown === section.title || (section.directPath && currentPage === section.directPath) || section.items.some(item => currentPage === item.path))
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-600/30 ring-2 ring-blue-200/50' 
                    : 'text-gray-800 bg-gray-100 hover:bg-gray-200 hover:text-blue-700 border border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className={`p-0.5 rounded-md ${(activeDropdown === section.title || (section.directPath && currentPage === section.directPath) || section.items.some(item => currentPage === item.path)) ? 'bg-white/20' : 'bg-blue-100/80'}`}>
                  <div className="h-3.5 w-3.5">{getIconComponent(section.icon)}</div>
                </div>
                <span>{section.title}</span>
                {!section.directPath && (
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ease-in-out ${
                    activeDropdown === section.title ? 'rotate-180' : ''
                  }`} />
                )}
                {section.directPath && currentPage === section.directPath && <Zap className="h-2.5 w-2.5 text-yellow-300" />}
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === section.title && !section.directPath && section.items.length > 0 && (
                <div className={`absolute top-full left-0 mt-2 bg-white shadow-2xl border border-gray-200 rounded-2xl z-50 animate-in fade-in-0 slide-in-from-top-2 duration-300 ease-out overflow-hidden ${
                  section.title === 'General' || section.title === 'Approval' || section.title === 'Voucher' ? 'w-80 grid grid-cols-1 gap-1' : 'w-64'
                }`}>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <div className={section.title === 'General' || section.title === 'Approval' || section.title === 'Voucher' ? 'py-2' : 'py-3'}>
                    {section.title === 'General' ? (
                      // Special layout for General menu with grouped items
                      <div className="space-y-1">
                        {/* KPI Group */}
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1 rounded-md bg-blue-100">
                              <div className="h-3 w-3">{getIconComponent('BarChart')}</div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">KPI</span>
                          </div>
                          <div className="space-y-1 ml-5">
                            {section.items.slice(0, 3).map((item) => (
                              <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:translate-x-1 transform group rounded-lg ${
                                  currentPage === item.path 
                                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-semibold shadow-sm' 
                                    : 'text-gray-700 hover:text-blue-700'
                                }`}
                              >
                                <div className={`p-1 rounded-md transition-all duration-300 group-hover:scale-110 ${
                                  currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                                }`}>
                                  <div className="h-3 w-3">{getIconComponent(item.icon)}</div>
                                </div>
                                <span className="text-xs font-medium">{item.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Voucher Group */}
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1 rounded-md bg-purple-100">
                              <div className="h-3 w-3">{getIconComponent('Ticket')}</div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Voucher</span>
                          </div>
                          <div className="space-y-1 ml-5">
                            {section.items.slice(3, 5).map((item) => (
                              <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:translate-x-1 transform group rounded-lg ${
                                  currentPage === item.path 
                                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-semibold shadow-sm' 
                                    : 'text-gray-700 hover:text-blue-700'
                                }`}
                              >
                                <div className={`p-1 rounded-md transition-all duration-300 group-hover:scale-110 ${
                                  currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                                }`}>
                                  <div className="h-3 w-3">{getIconComponent(item.icon)}</div>
                                </div>
                                <span className="text-xs font-medium">{item.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Reimburse Group */}
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1 rounded-md bg-green-100">
                              <div className="h-3 w-3">{getIconComponent('Wallet')}</div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Reimburse</span>
                          </div>
                          <div className="space-y-1 ml-5">
                            {section.items.slice(5, 7).map((item) => (
                              <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:translate-x-1 transform group rounded-lg ${
                                  currentPage === item.path 
                                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-semibold shadow-sm' 
                                    : 'text-gray-700 hover:text-blue-700'
                                }`}
                              >
                                <div className={`p-1 rounded-md transition-all duration-300 group-hover:scale-110 ${
                                  currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                                }`}>
                                  <div className="h-3 w-3">{getIconComponent(item.icon)}</div>
                                </div>
                                <span className="text-xs font-medium">{item.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Cash Advance Group */}
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1 rounded-md bg-yellow-100">
                              <div className="h-3 w-3">{getIconComponent('Banknote')}</div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Cash Advance</span>
                          </div>
                          <div className="space-y-1 ml-5">
                            {section.items.slice(7, 9).map((item) => (
                              <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:translate-x-1 transform group rounded-lg ${
                                  currentPage === item.path 
                                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-semibold shadow-sm' 
                                    : 'text-gray-700 hover:text-blue-700'
                                }`}
                              >
                                <div className={`p-1 rounded-md transition-all duration-300 group-hover:scale-110 ${
                                  currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                                }`}>
                                  <div className="h-3 w-3">{getIconComponent(item.icon)}</div>
                                </div>
                                <span className="text-xs font-medium">{item.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Purchase Request Group */}
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1 rounded-md bg-orange-100">
                              <div className="h-3 w-3">{getIconComponent('ShoppingCart')}</div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Purchase Request</span>
                          </div>
                          <div className="space-y-1 ml-5">
                            {section.items.slice(9, 11).map((item) => (
                              <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:translate-x-1 transform group rounded-lg ${
                                  currentPage === item.path 
                                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-semibold shadow-sm' 
                                    : 'text-gray-700 hover:text-blue-700'
                                }`}
                              >
                                <div className={`p-1 rounded-md transition-all duration-300 group-hover:scale-110 ${
                                  currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                                }`}>
                                  <div className="h-3 w-3">{getIconComponent(item.icon)}</div>
                                </div>
                                <span className="text-xs font-medium">{item.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (section.title === 'Approval' || section.title === 'Voucher') ? (
                      // Special layout for Finance Approval and Voucher menus
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleItemClick(item.path)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:translate-x-1 transform group rounded-lg ${
                              currentPage === item.path 
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-semibold shadow-sm' 
                                : 'text-gray-700 hover:text-blue-700'
                            }`}
                          >
                            <div className={`p-1 rounded-md transition-all duration-300 group-hover:scale-110 ${
                              currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                            }`}>
                              <div className="h-3 w-3">{getIconComponent(item.icon)}</div>
                            </div>
                            <span className="text-xs font-medium">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      // Regular layout for other menus
                    section.items.map((item, index) => (
                      <button
                        key={item.path}
                        onClick={() => handleItemClick(item.path)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:translate-x-1 transform group ${
                          currentPage === item.path 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-3 border-blue-500 font-semibold shadow-sm' 
                            : 'text-gray-800 hover:text-blue-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                          currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                        }`}>
                          <div className="h-3.5 w-3.5">{getIconComponent(item.icon)}</div>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm">{item.title}</span>
                          {currentPage === item.path && (
                            <div className="flex items-center space-x-1 mt-0.5">
                              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-xs text-blue-600 font-medium">Active</span>
                            </div>
                          )}
                        </div>
                        {currentPage === item.path && <Zap className="h-2.5 w-2.5 text-blue-500" />}
                      </button>
                    ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden bg-white px-4 py-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleMainDashboardClick}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 transform shadow-sm ${
                isMainDashboard 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-600/30' 
                  : 'text-gray-800 bg-gray-100 hover:bg-gray-200 hover:text-blue-700 border border-gray-300'
              }`}
            >
              <div className={`p-0.5 rounded ${isMainDashboard ? 'bg-white/20' : 'bg-blue-100/80'}`}>
                <LucideIcons.Home className="h-2.5 w-2.5" /> {/* Changed to Home icon */}
              </div>
              <span>Dashboard</span>
            </button>
            
            {menuSections.filter(section => section.title !== 'Main Dashboard').map((section) => ( // Filter out 'Main Dashboard'
              <button
                key={section.title}
                onClick={() => toggleDropdown(section.title)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 transform shadow-sm ${
                  (activeDropdown === section.title || (section.directPath && currentPage === section.directPath) || section.items.some(item => currentPage === item.path))
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-600/30' 
                    : 'text-gray-800 bg-gray-100 hover:bg-gray-200 hover:text-blue-700 border border-gray-300'
                }`}
              >
                <div className={`p-0.5 rounded ${(activeDropdown === section.title || (section.directPath && currentPage === section.directPath) || section.items.some(item => currentPage === item.path)) ? 'bg-white/20' : 'bg-blue-100/80'}`}>
                  <div className="h-2.5 w-2.5">{getIconComponent(section.icon)}</div>
                </div>
                <span>{section.title}</span>
                {!section.directPath && (
                  <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-300 ease-in-out ${
                    activeDropdown === section.title ? 'rotate-180' : ''
                  }`} />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Dropdown */}
          {activeDropdown && !menuSections.find(s => s.title === activeDropdown)?.directPath && (
            <div className={`mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-in slide-in-from-top-2 duration-300 ease-out overflow-hidden ${
              activeDropdown === 'General' || activeDropdown === 'Approval' || activeDropdown === 'Voucher' ? 'max-h-96 overflow-y-auto' : ''
            }`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="py-2">
                {activeDropdown === 'General' ? (
                  // Special mobile layout for General menu
                  <div className="space-y-3">
                    {/* KPI Group */}
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 rounded-md bg-blue-100">
                          <div className="h-3 w-3">{getIconComponent('BarChart')}</div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">KPI</span>
                      </div>
                      <div className="space-y-1 ml-4">
                        {menuSections.find(s => s.title === activeDropdown)?.items.slice(0, 3).map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleItemClick(item.path)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out group rounded-lg ${
                              currentPage === item.path 
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                            }`}
                          >
                            <div className={`p-1 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                              currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                            }`}>
                              <div className="h-2.5 w-2.5">{getIconComponent(item.icon)}</div>
                            </div>
                            <span className="font-medium text-xs">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Voucher Group */}
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 rounded-md bg-purple-100">
                          <div className="h-3 w-3">{getIconComponent('Ticket')}</div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Voucher</span>
                      </div>
                      <div className="space-y-1 ml-4">
                        {menuSections.find(s => s.title === activeDropdown)?.items.slice(3, 5).map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleItemClick(item.path)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out group rounded-lg ${
                              currentPage === item.path 
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                            }`}
                          >
                            <div className={`p-1 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                              currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                            }`}>
                              <div className="h-2.5 w-2.5">{getIconComponent(item.icon)}</div>
                            </div>
                            <span className="font-medium text-xs">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reimburse Group */}
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 rounded-md bg-green-100">
                          <div className="h-3 w-3">{getIconComponent('Wallet')}</div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Reimburse</span>
                      </div>
                      <div className="space-y-1 ml-4">
                        {menuSections.find(s => s.title === activeDropdown)?.items.slice(5, 7).map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleItemClick(item.path)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out group rounded-lg ${
                              currentPage === item.path 
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                            }`}
                          >
                            <div className={`p-1 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                              currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                            }`}>
                              <div className="h-2.5 w-2.5">{getIconComponent(item.icon)}</div>
                            </div>
                            <span className="font-medium text-xs">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cash Advance Group */}
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 rounded-md bg-yellow-100">
                          <div className="h-3 w-3">{getIconComponent('Banknote')}</div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Cash Advance</span>
                      </div>
                      <div className="space-y-1 ml-4">
                        {menuSections.find(s => s.title === activeDropdown)?.items.slice(7, 9).map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleItemClick(item.path)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out group rounded-lg ${
                              currentPage === item.path 
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                            }`}
                          >
                            <div className={`p-1 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                              currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                            }`}>
                              <div className="h-2.5 w-2.5">{getIconComponent(item.icon)}</div>
                            </div>
                            <span className="font-medium text-xs">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Purchase Request Group */}
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 rounded-md bg-orange-100">
                          <div className="h-3 w-3">{getIconComponent('ShoppingCart')}</div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Purchase Request</span>
                      </div>
                      <div className="space-y-1 ml-4">
                        {menuSections.find(s => s.title === activeDropdown)?.items.slice(9, 11).map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleItemClick(item.path)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out group rounded-lg ${
                              currentPage === item.path 
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                            }`}
                          >
                            <div className={`p-1 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                              currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                            }`}>
                              <div className="h-2.5 w-2.5">{getIconComponent(item.icon)}</div>
                            </div>
                            <span className="font-medium text-xs">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (activeDropdown === 'Approval' || activeDropdown === 'Voucher') ? (
                  // Special mobile layout for Finance Approval and Voucher menus
                  <div className="space-y-3">
                    {menuSections.find(s => s.title === activeDropdown)?.items.map((item) => (
                      <div className="px-4 py-2" key={item.path}>
                        <button
                          onClick={() => handleItemClick(item.path)}
                          className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-300 ease-in-out group rounded-lg ${
                            currentPage === item.path 
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500 font-medium' 
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                          }`}
                        >
                          <div className={`p-1 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                          }`}>
                            <div className="h-2.5 w-2.5">{getIconComponent(item.icon)}</div>
                          </div>
                          <span className="font-medium text-xs">{item.title}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Regular mobile layout for other menus
                  menuSections.find(s => s.title === activeDropdown)?.items.map((item, index) => (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-300 ease-in-out group ${
                      currentPage === item.path 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-3 border-blue-500 font-medium' 
                        : 'text-gray-800 hover:bg-gray-50 hover:text-blue-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                      currentPage === item.path ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                    }`}>
                      <div className="h-3 w-3">{getIconComponent(item.icon)}</div>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-xs">{item.title}</span>
                      {currentPage === item.path && (
                        <div className="flex items-center space-x-1 mt-0.5">
                          <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-blue-600 font-medium">Active</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
