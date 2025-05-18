
import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UpdateUserRoleDialog from './UpdateUserRoleDialog';
import { UserRole } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  created_at: string;
}

interface UsersListProps {
  users: User[];
  onUpdate: () => void;
}

const UsersList = ({ users, onUpdate }: UsersListProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateRoleDialogOpen, setIsUpdateRoleDialogOpen] = useState(false);
  const { toast } = useToast();

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'manager':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'user':
      default:
        return 'bg-green-500 hover:bg-green-600 text-white';
    }
  };
  
  const getInitials = (firstName: string | null, lastName: string | null) => {
    let initials = '';
    if (firstName) initials += firstName.charAt(0).toUpperCase();
    if (lastName) initials += lastName.charAt(0).toUpperCase();
    return initials || '?';
  };
  
  const handleResendInvite = async (email: string) => {
    // In a real app, you would call an API to resend the invitation
    toast({
      title: "Invitation Resent",
      description: `A new invitation has been sent to ${email}`
    });
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(user.first_name, user.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {/* In a real app, you'd get the email from your users table */}
                        {`user-${user.id.substring(0, 6)}@example.com`}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(user.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedUser(user);
                        setIsUpdateRoleDialogOpen(true);
                      }}>
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        // In a real app, you'd use the user's actual email
                        handleResendInvite(`user-${user.id.substring(0, 6)}@example.com`);
                      }}>
                        Resend Invitation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedUser && (
        <UpdateUserRoleDialog 
          isOpen={isUpdateRoleDialogOpen}
          onClose={() => setIsUpdateRoleDialogOpen(false)}
          user={selectedUser}
          onSuccess={() => {
            onUpdate();
            setIsUpdateRoleDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UsersList;
