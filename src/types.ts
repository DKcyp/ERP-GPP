export type UserRole = 'marketing' | 'operational' | 'hrd' | 'pengadaan' | 'finance' | 'gudang';

export interface User {
  username: string;
  role: UserRole;
  fullName: string;
  profilePicture: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface MenuItem {
  title: string;
  icon: string;
  path: string;
}

export interface MenuSubSection { // New interface for nested groups
  title: string;
  icon: string;
  items: MenuItem[];
}

export interface MenuSection {
  title: string;
  icon: string;
  items?: MenuItem[]; // Optional for directPath or subSections
  directPath?: string;
  subSections?: MenuSubSection[]; // New: for nested groups
}
