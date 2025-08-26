export interface User {
  username: string;
  role: UserRole;
  fullName: string;
  profilePicture: string;
}

export type UserRole = 'marketing' | 'operational' | 'hrd' | 'pengadaan' | 'finance' | 'gudang' | 'management' | 'qhse';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface MenuItem {
  title: string;
  icon: string;
  path: string;
}

export interface MenuSubSection {
  title: string;
  icon: string;
  items: MenuItem[];
}

export interface MenuSection {
  title: string;
  icon: string;
  items?: MenuItem[];
  subSections?: MenuSubSection[];
  directPath?: string; // For sections that directly link to a page without a dropdown
}
