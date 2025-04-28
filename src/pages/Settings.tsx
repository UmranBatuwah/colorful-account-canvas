
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/settings/ProfileSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="account">
              <AccountSettings />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
