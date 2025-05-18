// This is a simplified authentication library
// In a real application, you would implement proper JWT handling

export type UserRole = 'user' | 'expert' | 'moderator' | 'admin' | 'super-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock function to get the current user
// In production, this would decode the JWT from cookies
export function getCurrentUser(): User | null {
  // Mock user for demonstration
  return {
    id: '1',
    name: 'Admin User',
    email: 'admin@expertinthecity.com',
    role: 'super-admin',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
  };
}

// Check if user has required role
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'user': 1,
    'expert': 2,
    'moderator': 3,
    'admin': 4,
    'super-admin': 5,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}