export interface Movie {
  id: number;
  title: string;
  image: string;
  category?: string;
  tag?: string; // e.g. "S02E04" or "(2)"
  timestamp?: number; // Epoch time for "Time Ago" feature
  description?: string;
  videoUrl?: string;
}

export interface NavItem {
  label: string;
  id: string; // Changed href to id for internal routing
  active?: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}