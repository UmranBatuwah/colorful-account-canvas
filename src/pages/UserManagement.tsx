import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, UserPlus } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import InviteUserDialog from '@/components/users/InviteUserDialog';
import UsersList from '@/components/users/UsersList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RoleBasedAccess from '@/components/auth/RoleBasedAccess';

const UserManagement = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data: users, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role, created_at, email')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return users || [];
      } catch (error: any) {
        toast({
          title: "Error loading users",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
    }
  });

  const handleInviteSuccess = () => {
    toast({
      title: "Invitation sent",
      description: "An invitation email has been sent to the user.",
    });
    refetch();
    setIsInviteDialogOpen(false);
  };

  return (
    <DashboardLayout title="User Management">
      <RoleBasedAccess allowedRoles={['admin']}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Manage users and their roles</p>
            </div>
            <Button 
              onClick={() => setIsInviteDialogOpen(true)}
              className="w-full sm:w-auto flex items-center"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <UsersList users={users || []} onUpdate={refetch} />
          )}
          
          <InviteUserDialog 
            isOpen={isInviteDialogOpen} 
            onClose={() => setIsInviteDialogOpen(false)} 
            onSuccess={handleInviteSuccess}
          />
        </div>
      </RoleBasedAccess>
    </DashboardLayout>
  );
};

export default UserManagement;
