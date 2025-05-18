
import { ReactNode } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

const RoleBasedAccess = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleBasedAccessProps) => {
  const { hasAccess } = useAuth();
  
  return hasAccess(allowedRoles) ? <>{children}</> : <>{fallback}</>;
};

export default RoleBasedAccess;
