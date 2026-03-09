export type UserType = 'admin' | 'customer' | 'research' | 'coach' | 'client';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  is_active: boolean;
  is_first_login?: boolean;
}

export interface UserPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}
