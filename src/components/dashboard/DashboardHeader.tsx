
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import GlobalSearch from './search/GlobalSearch';

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  
  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };
  
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };
  
  const firstName = user?.user_metadata?.first_name || 'Guest';
  const initials = firstName.charAt(0).toUpperCase();
  
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'manager':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'user':
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };
  
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold hidden md:block">{title}</h1>
        
        <div className="flex items-center ml-auto space-x-4">
          <Button variant="outline" size="icon" onClick={handleOpenSearch}>
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Badge className={`${getRoleBadgeColor(userRole)} text-white`}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
          
          <Avatar className="cursor-pointer" onClick={() => navigate('/settings')}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      <GlobalSearch isOpen={isSearchOpen} onClose={handleCloseSearch} />
    </>
  );
};

export default DashboardHeader;
