export type UserRole = 'marketing' | 'operational' | 'hrd' | 'pengadaan' | 'finance';

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

export interface MenuSection {
  title: string;
  icon: string;
  items: MenuItem[];
  directPath?: string;
}
