import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { marketingMenu, operationalMenu, hrdMenu, pengadaanMenu, financeMenu, gudangMenu, MenuSection, MenuSubSection } from '../data/menuConfig'; // Import MenuSection and MenuSubSection
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

  const menuSections: MenuSection[] = user?.role === 'marketing' ? marketingMenu :
                      user?.role === 'operational' ? operationalMenu :
                      user?.role === 'hrd' ? hrdMenu :
                      user?.role === 'pengadaan' ? pengadaanMenu :
                      user?.role === 'finance' ? financeMenu :
                      user?.role === 'gudang' ? gudangMenu :
                      marketingMenu; // Default to marketingMenu if role is not recognized

  // Add these logs to diagnose which menu is being loaded
  useEffect(() => {
    console.log('MenuBar Effect: User role:', user?.role);
    console.log('MenuBar Effect: Loaded menu sections (titles):', menuSections.map(s => s.title));
  }, [user?.role, menuSections]); // Re-run when user role or menu sections change

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
    console.log('MenuBar: Setting currentPage to:', path);
    setCurrentPage(path);
    setActiveDropdown(null);
  };

  const handleMainDashboardClick = () => {
    const dashboardPath = `/${user?.role}/dashboard`;
    console.log('MenuBar: Setting main dashboard currentPage to:', dashboardPath);
    setCurrentPage(dashboardPath);
    setActiveDropdown(null);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />;
  };

  const isMainDashboard = currentPage === `/${user?.role}/dashboard`;

  // Helper to check if any item in a sub-section is active
  const isSubSectionActive = (subSection: MenuSubSection) => {
    return subSection.items.some(item => currentPage === item.path);
  };

  // Helper to check if any item in a main section (with sub-sections) is active
  const isSectionWithSubSectionsActive = (section: MenuSection) => {
    return section.subSections?.some(subSection => isSubSectionActive(subSection));
  };

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
              <LucideIcons.Home className="h-3.5 w-3.5" />
            </div>
            <span>Main Dashboard</span>
            {isMainDashboard && <Zap className="h-2.5 w-2.5 text-yellow-300" />}
          </button>

          {/* Menu Section Items */}
          {menuSections.filter(section => section.title !== 'Main Dashboard').map((section) => (
            <div key={section.title} className="relative">
              <button
                onClick={() => toggleDropdown(section.title)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-300 hover:scale-105 transform shadow-sm hover:shadow-md ${
                  (activeDropdown === section.title || (section.directPath && currentPage === section.directPath) || (section.items && section.items.some(item => currentPage === item.path)) || isSectionWithSubSectionsActive(section))
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-600/30 ring-2 ring-blue-200/50'
                    : 'text-gray-800 bg-gray-100 hover:bg-gray-200 hover:text-blue-700 border border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className={`p-0.5 rounded-md ${((activeDropdown === section.title || (section.directPath && currentPage === section.directPath) || (section.items && section.items.some(item => currentPage === item.path)) || isSectionWithSubSectionsActive(section))) ? 'bg-white/20' : 'bg-blue-100/80'}`}>
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
              {activeDropdown === section.title && !section.directPath && (section.items?.length > 0 || section.subSections?.length > 0) && (
                <div className={`absolute top-full left-0 mt-2 bg-white shadow-2xl border border-gray-200 rounded-2xl z-50 animate-in fade-in-0 slide-in-from-top-2 duration-300 ease-out overflow-hidden ${
                  section.title === 'General' || section.title === 'Approval' || section.title === 'Voucher' || section.title === 'Pengembalian Barang' || section.title === 'Stock Opname' ? 'w-80 grid grid-cols-1 gap-1' : 'w-64'
                }`}>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <div className={section.title === 'General' || section.title === 'Approval' || section.title === 'Voucher' || section.title === 'Pengembalian Barang' || section.title === 'Stock Opname' ? 'py-2' : 'py-3'}>
                    {section.subSections && section.subSections.length > 0 ? (
                      // New layout for General menu with sub-sections
                      <div className="space-y-1">
                        {section.subSections.map((subSection) => (
                          <div key={subSection.title} className="px-3 py-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="p-1 rounded-md bg-blue-100">
                                <div className="h-3 w-3">{getIconComponent(subSection.icon)}</div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{subSection.title}</span>
                            </div>
                            <div className="space-y-1 ml-5">
                              {subSection.items.map((item) => (
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
                        ))}
                      </div>
                    ) : (section.title === 'Approval' || section.title === 'Voucher' || section.title === 'Pengembalian Barang' || section.title === 'Stock Opname') ? (
                      // Special layout for Finance Approval and Voucher menus
                      <div className="space-y-1">
                        {section.items?.map((item) => (
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
                    section.items?.map((item, index) => (
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
                <LucideIcons.Home className="h-2.5 w-2.5" />
              </div>
              <span>Dashboard</span>
            </button>

            {menuSections.filter(section => section.title !== 'Main Dashboard').map((section) => (
              <button
                key={section.title}
                onClick={() => toggleDropdown(section.title)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 transform shadow-sm ${
                  (activeDropdown === section.title || (section.directPath && currentPage === section.directPath) || (section.items && section.items.some(item => currentPage === item.path)) || isSectionWithSubSectionsActive(section))
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-600/30'
                    : 'text-gray-800 bg-gray-100 hover:bg-gray-200 hover:text-blue-700 border border-gray-300'
                }`}
              >
                <div className={`p-0.5 rounded ${((activeDropdown === section.title || (section.directPath && currentPage === section.directPath) || (section.items && section.items.some(item => currentPage === item.path)) || isSectionWithSubSectionsActive(section))) ? 'bg-white/20' : 'bg-blue-100/80'}`}>
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
          {activeDropdown && !menuSections.find(s => s.title === activeDropdown)?.directPath && (menuSections.find(s => s.title === activeDropdown)?.items?.length > 0 || menuSections.find(s => s.title === activeDropdown)?.subSections?.length > 0) && (
            <div className={`mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-in slide-in-from-top-2 duration-300 ease-out overflow-hidden ${
              activeDropdown === 'General' || activeDropdown === 'Approval' || activeDropdown === 'Voucher' || activeDropdown === 'Pengembalian Barang' || activeDropdown === 'Stock Opname' ? 'max-h-96 overflow-y-auto' : ''
            }`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="py-2">
                {menuSections.find(s => s.title === activeDropdown)?.subSections && menuSections.find(s => s.title === activeDropdown)?.subSections?.length > 0 ? (
                  // New mobile layout for General menu with sub-sections
                  <div className="space-y-3">
                    {menuSections.find(s => s.title === activeDropdown)?.subSections?.map((subSection) => (
                      <div className="px-4 py-2" key={subSection.title}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="p-1 rounded-md bg-blue-100">
                            <div className="h-3 w-3">{getIconComponent(subSection.icon)}</div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{subSection.title}</span>
                        </div>
                        <div className="space-y-1 ml-4">
                          {subSection.items.map((item) => (
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
                    ))}
                  </div>
                ) : (activeDropdown === 'Approval' || activeDropdown === 'Voucher' || activeDropdown === 'Pengembalian Barang' || activeDropdown === 'Stock Opname') ? (
                  // Special mobile layout for Finance Approval, Voucher, Gudang Pengembalian Barang and Stock Opname menus
                  <div className="space-y-3">
                    {menuSections.find(s => s.title === activeDropdown)?.items?.map((item) => (
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
                  menuSections.find(s => s.title === activeDropdown)?.items?.map((item, index) => (
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
