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
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-bold ml-12 lg:ml-0">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="outline" size="icon" onClick={handleOpenSearch} className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Badge className={`${getRoleBadgeColor(userRole)} text-white hidden sm:flex`}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
          
          <Avatar className="cursor-pointer" onClick={() => navigate('/settings')}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      {isSearchOpen && <GlobalSearch />}
    </>
  );
};

export default DashboardHeader;
