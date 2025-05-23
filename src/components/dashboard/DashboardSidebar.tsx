import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart2, PieChart, FilePlus, Database, CreditCard, Tag, Settings, ChevronLeft, FileText, Users, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/context/AuthContext';
import RoleBasedAccess from '@/components/auth/RoleBasedAccess';

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { userRole } = useAuth();
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      allowedRoles: ['admin', 'manager', 'user'] as UserRole[],
    },
    {
      title: 'Transactions',
      icon: CreditCard,
      path: '/transactions',
      allowedRoles: ['admin', 'manager', 'user'] as UserRole[],
    },
    {
      title: 'Categories',
      icon: Tag,
      path: '/categories',
      allowedRoles: ['admin', 'manager', 'user'] as UserRole[],
    },
    {
      title: 'Invoices',
      icon: FileText,
      path: '/invoices',
      allowedRoles: ['admin', 'manager'] as UserRole[],
    },
    {
      title: 'Reports',
      icon: BarChart2,
      path: '/reports',
      allowedRoles: ['admin', 'manager', 'user'] as UserRole[],
    },
    {
      title: 'Users',
      icon: Users,
      path: '/users',
      allowedRoles: ['admin'] as UserRole[],
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={cn(
          'bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 fixed lg:relative z-40',
          collapsed ? 'w-16' : 'w-64',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold text-gradient">
              FinTrackr
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full p-2 hidden lg:flex",
              collapsed && "mx-auto"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft 
              className={cn(
                "h-5 w-5 text-gray-500 transition-transform",
                collapsed && "rotate-180"
              )} 
            />
          </Button>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <RoleBasedAccess key={item.path} allowedRoles={item.allowedRoles}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    'flex items-center px-3 py-2 rounded-lg transition-colors',
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100',
                    collapsed && 'justify-center'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={cn("h-5 w-5", collapsed ? 'mx-0' : 'mr-3')} />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </RoleBasedAccess>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              'flex items-center px-3 py-2 rounded-lg transition-colors',
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100',
              collapsed && 'justify-center'
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className={cn("h-5 w-5", collapsed ? 'mx-0' : 'mr-3')} />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
        
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {userRole.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
                <p className="text-xs text-gray-500">Role-based access</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default DashboardSidebar;
