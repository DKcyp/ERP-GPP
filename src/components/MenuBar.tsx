import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  marketingMenu,
  operationalMenu,
  hrdMenu,
  pengadaanMenu,
  financeMenu,
  gudangMenu,
  managementMenu,
  qhseMenu,
  accountingMenu,
  taxMenu,
  proconMenu,
  gaMenu,
} from "../data/menuConfig";
import { MenuSection, MenuSubSection, MenuItem } from "../types";
import { ChevronDown, BarChart3, Zap } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface MenuBarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuSections: MenuSection[] =
    user?.role === "marketing"
      ? marketingMenu
      : user?.role === "operational"
      ? operationalMenu
      : user?.role === "hrd"
      ? hrdMenu
      : user?.role === "pengadaan"
      ? pengadaanMenu
      : user?.role === "finance"
      ? financeMenu
      : user?.role === "gudang"
      ? gudangMenu
      : user?.role === "management"
      ? managementMenu
      : user?.role === "qhse"
      ? qhseMenu
      : user?.role === "accounting"
      ? accountingMenu
      : user?.role === "tax"
      ? taxMenu
      : user?.role === "procon"
      ? proconMenu // Add proconMenu
      : user?.role === "ga"
      ? gaMenu
      : marketingMenu; // Default to marketingMenu if role is not recognized

  // Add these logs to diagnose which menu is being loaded
  useEffect(() => {
    console.log("MenuBar Effect: User role:", user?.role);
    console.log(
      "MenuBar Effect: Loaded menu sections (titles):",
      menuSections.map((s) => s.title)
    );
  }, [user?.role, menuSections]); // Re-run when user role or menu sections change

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (sectionTitle: string) => {
    const section = menuSections.find((s) => s.title === sectionTitle);
    if (section?.directPath) {
      handleItemClick(section.directPath);
      return;
    }
    setActiveDropdown(activeDropdown === sectionTitle ? null : sectionTitle);
  };

  const handleItemClick = (path: string) => {
    console.log("MenuBar: Setting currentPage to:", path);
    setCurrentPage(path);
    setActiveDropdown(null);
  };

  const handleMainDashboardClick = () => {
    const dashboardPath = `/${user?.role}/dashboard`;
    console.log(
      "MenuBar: Setting main dashboard currentPage to:",
      dashboardPath
    );
    setCurrentPage(dashboardPath);
    setActiveDropdown(null);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? (
      <IconComponent className="h-4 w-4" />
    ) : (
      <BarChart3 className="h-4 w-4" />
    );
  };

  const isMainDashboard = currentPage === `/${user?.role}/dashboard`;

  // Helper to check if any item in a sub-section is active
  const isSubSectionActive = (subSection: MenuSubSection) => {
    return subSection.items.some((item) => currentPage === item.path);
  };

  // Helper to check if any item in a main section (with sub-sections) is active
  const isSectionWithSubSectionsActive = (section: MenuSection) => {
    return section.subSections?.some((subSection) =>
      isSubSectionActive(subSection)
    );
  };

  return (
    <div className="bg-surface sticky top-[4.0rem] z-40 shadow-lg border-b border-border">
      <div className="w-full">
        {/* Desktop Menu Bar */}
        <div className="hidden md:flex items-center justify-start px-3 py-1.5 space-x-1.5">
          {/* Main Dashboard - Only show for non-accounting roles */}
          {user?.role !== "accounting" && (
            <button
              onClick={handleMainDashboardClick}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl font-medium text-xs transition-all duration-300 hover:scale-105 transform shadow-sm hover:shadow-md min-w-0 ${
                isMainDashboard
                  ? "bg-primary text-white shadow-primary/30 ring-2 ring-blue-200/50"
                  : "text-text bg-gray-100 hover:bg-gray-200 hover:text-primary border border-border hover:border-primary/50"
              }`}
            >
              <div
                className={`p-0.5 rounded-md ${
                  isMainDashboard ? "bg-white/20" : "bg-blue-100"
                }`}
              >
                <LucideIcons.Home className="h-3 w-3" />
              </div>
              <span className="whitespace-nowrap truncate max-w-[12rem]">
                Dashboard
              </span>
              {isMainDashboard && <Zap className="h-2 w-2 text-yellow-300" />}
            </button>
          )}

          {/* Menu Section Items */}
          {menuSections
            .filter(
              (section) => section.directPath !== `/${user?.role}/dashboard`
            )
            .map((section: MenuSection) => (
              <div key={section.title} className="relative">
                <button
                  onClick={() => toggleDropdown(section.title)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl font-medium text-xs transition-all duration-300 hover:scale-105 transform shadow-sm hover:shadow-md min-w-0 ${
                    activeDropdown === section.title ||
                    (section.directPath &&
                      currentPage === section.directPath) ||
                    (section.items &&
                      section.items.some(
                        (item) => currentPage === item.path
                      )) ||
                    isSectionWithSubSectionsActive(section)
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30 ring-2 ring-blue-200/50"
                      : "text-text bg-gray-100 hover:bg-gray-200 hover:text-primary border border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`p-0.5 rounded-md ${
                      activeDropdown === section.title ||
                      (section.directPath &&
                        currentPage === section.directPath) ||
                      (section.items &&
                        section.items.some(
                          (item) => currentPage === item.path
                        )) ||
                      isSectionWithSubSectionsActive(section)
                        ? "bg-white/20"
                        : "bg-blue-100/80"
                    }`}
                  >
                    <div className="h-3 w-3">
                      {getIconComponent(section.icon)}
                    </div>
                  </div>
                  <span className="whitespace-nowrap truncate max-w-[12rem]">
                    {section.title}
                  </span>
                  {!section.directPath && (
                    <ChevronDown
                      className={`h-2.5 w-2.5 transition-transform duration-300 ease-in-out ${
                        activeDropdown === section.title ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  {section.directPath && currentPage === section.directPath && (
                    <Zap className="h-2.5 w-2.5 text-yellow-300" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === section.title &&
                  !section.directPath &&
                  (section.items?.length > 0 ||
                    section.subSections?.length > 0) && (
                    <div
                      className={`absolute top-full left-0 mt-2 bg-surface shadow-2xl border border-border rounded-2xl z-50 animate-in fade-in-0 slide-in-from-top-2 duration-300 ease-out overflow-hidden ${
                        section.title === "General" ||
                        section.title === "Approval" ||
                        section.title === "Voucher" ||
                        section.title === "Pengembalian Barang" ||
                        section.title === "Stock Opname" ||
                        section.title === "AP" ||
                        section.title === "AR" ||
                        section.title === "Accounting" ||
                        section.title === "Tax"
                          ? "w-80 grid grid-cols-1 gap-1"
                          : "w-64"
                      }`}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                      <div
                        className={
                          section.title === "General" ||
                          section.title === "Approval" ||
                          section.title === "Voucher" ||
                          section.title === "Pengembalian Barang" ||
                          section.title === "Stock Opname" ||
                          section.title === "AP" ||
                          section.title === "AR" ||
                          section.title === "Accounting" ||
                          section.title === "Tax"
                            ? "py-1.5 max-h-96 overflow-y-auto"
                            : "py-2"
                        }
                      >
                        {section.subSections &&
                        section.subSections.length > 0 ? (
                          // New layout for General menu with sub-sections
                          <div className="space-y-1">
                            {section.subSections.map((subSection) => (
                              <div
                                key={subSection.title}
                                className="px-2.5 py-1.5"
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="p-1 rounded-md bg-blue-100">
                                    <div className="h-2.5 w-2.5">
                                      {getIconComponent(subSection.icon)}
                                    </div>
                                  </div>
                                  <span className="text-xs font-semibold text-text uppercase tracking-wide">
                                    {subSection.title}
                                  </span>
                                </div>
                                <div className="space-y-1 ml-5">
                                  {subSection.items.map((item: MenuItem) => (
                                    <button
                                      key={item.path}
                                      onClick={() => handleItemClick(item.path)}
                                      className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-left transition-all duration-300 ease-in-out hover:bg-primary/5 hover:translate-x-1 transform group rounded-lg ${
                                        currentPage === item.path
                                          ? "bg-primary/5 text-primary border-r-2 border-primary font-semibold shadow-sm"
                                          : "text-text hover:text-primary"
                                      }`}
                                    >
                                      <div
                                        className={`p-0.5 rounded-md transition-all duration-300 group-hover:scale-110 ${
                                          currentPage === item.path
                                            ? "bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm"
                                            : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100"
                                        }`}
                                      >
                                        <div className="h-2.5 w-2.5">
                                          {getIconComponent(item.icon)}
                                        </div>
                                      </div>
                                      <span className="text-[11px] font-medium">
                                        {item.title}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : section.title === "Approval" ||
                          section.title === "Voucher" ||
                          section.title === "Pengembalian Barang" ||
                          section.title === "Stock Opname" ||
                          section.title === "AP" ||
                          section.title === "AR" ||
                          section.title === "Accounting" ||
                          section.title === "Tax" ? (
                          // Special layout for Finance Approval and Voucher menus
                          <div className="space-y-1">
                            {section.items?.map((item: MenuItem) => (
                              <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-left transition-all duration-300 ease-in-out hover:bg-primary/5 hover:translate-x-1 transform group rounded-lg ${
                                  currentPage === item.path
                                    ? "bg-primary/5 text-primary border-r-2 border-primary font-semibold shadow-sm"
                                    : "text-text hover:text-primary"
                                }`}
                              >
                                <div
                                  className={`p-0.5 rounded-md transition-all duration-300 group-hover:scale-110 ${
                                    currentPage === item.path
                                      ? "bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm"
                                      : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100"
                                  }`}
                                >
                                  <div className="h-2.5 w-2.5">
                                    {getIconComponent(item.icon)}
                                  </div>
                                </div>
                                <span className="text-[11px] font-medium">
                                  {item.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          // Regular layout for other menus
                          section.items?.map((item, index) => (
                            <button
                              key={item.path}
                              onClick={() => handleItemClick(item.path)}
                              className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:bg-primary/5 hover:translate-x-1 transform group ${
                                currentPage === item.path
                                  ? "bg-primary/5 text-primary border-r-3 border-primary font-semibold shadow-sm"
                                  : "text-text hover:text-primary"
                              }`}
                            >
                              <div
                                className={`p-1 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                  currentPage === item.path
                                    ? "bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm"
                                    : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100"
                                }`}
                              >
                                <div className="h-3 w-3">
                                  {getIconComponent(item.icon)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-xs">
                                  {item.title}
                                </span>
                                {currentPage === item.path && (
                                  <div className="flex items-center space-x-1 mt-0.5">
                                    <div className="h-1 w-1 bg-primary rounded-full"></div>
                                    <span className="text-xs text-primary font-medium">
                                      Active
                                    </span>
                                  </div>
                                )}
                              </div>
                              {currentPage === item.path && (
                                <Zap className="h-2 w-2 text-primary" />
                              )}
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
        <div className="md:hidden bg-surface px-3 py-2 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {/* Main Dashboard - Only show for non-accounting roles */}
            {user?.role !== "accounting" && (
              <button
                onClick={handleMainDashboardClick}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 transform shadow-sm ${
                  isMainDashboard
                    ? "bg-primary text-white shadow-primary/30"
                    : "text-text bg-gray-100 hover:bg-gray-200 hover:text-primary border border-border"
                }`}
              >
                <div
                  className={`p-0.5 rounded ${
                    isMainDashboard ? "bg-white/20" : "bg-blue-100/80"
                  }`}
                >
                  <LucideIcons.Home className="h-2.5 w-2.5" />
                </div>
                <span>Dashboard</span>
              </button>
            )}

            {menuSections
              .filter((section) => section.title !== "Main Dashboard")
              .map((section) => (
                <button
                  key={section.title}
                  onClick={() => toggleDropdown(section.title)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 transform shadow-sm ${
                    activeDropdown === section.title ||
                    (section.directPath &&
                      currentPage === section.directPath) ||
                    (section.items &&
                      section.items.some(
                        (item) => currentPage === item.path
                      )) ||
                    isSectionWithSubSectionsActive(section)
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30"
                      : "text-text bg-gray-100 hover:bg-gray-200 hover:text-primary border border-border"
                  }`}
                >
                  <div
                    className={`p-0.5 rounded ${
                      activeDropdown === section.title ||
                      (section.directPath &&
                        currentPage === section.directPath) ||
                      (section.items &&
                        section.items.some(
                          (item) => currentPage === item.path
                        )) ||
                      isSectionWithSubSectionsActive(section)
                        ? "bg-white/20"
                        : "bg-blue-100/80"
                    }`}
                  >
                    <div className="h-2.5 w-2.5">
                      {getIconComponent(section.icon)}
                    </div>
                  </div>
                  <span>{section.title}</span>
                  {!section.directPath && (
                    <ChevronDown
                      className={`h-2.5 w-2.5 transition-transform duration-300 ease-in-out ${
                        activeDropdown === section.title ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              ))}
          </div>

          {/* Mobile Dropdown */}
          {activeDropdown &&
            !menuSections.find((s) => s.title === activeDropdown)?.directPath &&
            (menuSections.find((s) => s.title === activeDropdown)?.items
              ?.length > 0 ||
              menuSections.find((s) => s.title === activeDropdown)?.subSections
                ?.length > 0) && (
              <div
                className={`mt-2.5 bg-surface rounded-2xl shadow-2xl border border-border animate-in slide-in-from-top-2 duration-300 ease-out overflow-hidden ${
                  activeDropdown === "General" ||
                  activeDropdown === "Approval" ||
                  activeDropdown === "Voucher" ||
                  activeDropdown === "Pengembalian Barang" ||
                  activeDropdown === "Stock Opname" ||
                  activeDropdown === "AP" ||
                  activeDropdown === "AR" ||
                  activeDropdown === "Accounting" ||
                  activeDropdown === "Tax"
                    ? "max-h-96 overflow-y-auto"
                    : ""
                }`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                <div className="py-1.5">
                  {menuSections.find((s) => s.title === activeDropdown)
                    ?.subSections &&
                  menuSections.find((s) => s.title === activeDropdown)
                    ?.subSections?.length > 0 ? (
                    // New mobile layout for General menu with sub-sections
                    <div className="space-y-3">
                      {menuSections
                        .find((s) => s.title === activeDropdown)
                        ?.subSections?.map((subSection: MenuSubSection) => (
                          <div className="px-3 py-1.5" key={subSection.title}>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="p-1 rounded-md bg-blue-100">
                                <div className="h-2.5 w-2.5">
                                  {getIconComponent(subSection.icon)}
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-text uppercase tracking-wide">
                                {subSection.title}
                              </span>
                            </div>
                            <div className="space-y-1 ml-4">
                              {subSection.items.map((item) => (
                                <button
                                  key={item.path}
                                  onClick={() => handleItemClick(item.path)}
                                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-left transition-all duration-300 ease-in-out group rounded-lg ${
                                    currentPage === item.path
                                      ? "bg-primary/5 text-primary border-r-2 border-primary font-medium"
                                      : "text-text hover:bg-gray-50 hover:text-primary"
                                  }`}
                                >
                                  <div
                                    className={`p-0.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                      currentPage === item.path
                                        ? "bg-gradient-to-br from-blue-100 to-purple-100"
                                        : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100"
                                    }`}
                                  >
                                    <div className="h-2.5 w-2.5">
                                      {getIconComponent(item.icon)}
                                    </div>
                                  </div>
                                  <span className="font-medium text-xs">
                                    {item.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : activeDropdown === "Approval" ||
                    activeDropdown === "Voucher" ||
                    activeDropdown === "Pengembalian Barang" ||
                    activeDropdown === "Stock Opname" ||
                    activeDropdown === "AP" ||
                    activeDropdown === "AR" ||
                    activeDropdown === "Accounting" ||
                    activeDropdown === "Tax" ? (
                    // Special mobile layout for Finance Approval, Voucher, Gudang Pengembalian Barang and Stock Opname menus
                    <div className="space-y-3">
                      {menuSections
                        .find((s) => s.title === activeDropdown)
                        ?.items?.map((item: MenuItem) => (
                          <div className="px-3 py-1.5" key={item.path}>
                            <button
                              onClick={() => handleItemClick(item.path)}
                              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-left transition-all duration-300 ease-in-out group rounded-lg ${
                                currentPage === item.path
                                  ? "bg-primary/5 text-primary border-r-2 border-primary font-medium"
                                  : "text-text hover:bg-gray-50 hover:text-primary"
                              }`}
                            >
                              <div
                                className={`p-0.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                  currentPage === item.path
                                    ? "bg-gradient-to-br from-blue-100 to-purple-100"
                                    : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100"
                                }`}
                              >
                                <div className="h-2.5 w-2.5">
                                  {getIconComponent(item.icon)}
                                </div>
                              </div>
                              <span className="font-medium text-xs">
                                {item.title}
                              </span>
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    // Regular mobile layout for other menus
                    menuSections
                      .find((s) => s.title === activeDropdown)
                      ?.items?.map((item: MenuItem, index: number) => (
                        <button
                          key={item.path}
                          onClick={() => handleItemClick(item.path)}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left transition-all duration-300 ease-in-out group ${
                            currentPage === item.path
                              ? "bg-primary/5 text-primary border-r-3 border-primary font-medium"
                              : "text-text hover:bg-gray-50 hover:text-primary"
                          }`}
                        >
                          <div
                            className={`p-1 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                              currentPage === item.path
                                ? "bg-gradient-to-br from-blue-100 to-purple-100"
                                : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100"
                            }`}
                          >
                            <div className="h-2.5 w-2.5">
                              {getIconComponent(item.icon)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-xs">
                              {item.title}
                            </span>
                            {currentPage === item.path && (
                              <div className="flex items-center space-x-1 mt-0.5">
                                <div className="h-1 w-1 bg-primary rounded-full"></div>
                                <span className="text-xs text-primary font-medium">
                                  Active
                                </span>
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
