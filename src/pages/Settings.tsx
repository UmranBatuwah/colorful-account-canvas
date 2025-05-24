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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 overflow-x-auto">
            <TabsTrigger value="profile" className="whitespace-nowrap">Profile</TabsTrigger>
            <TabsTrigger value="account" className="whitespace-nowrap">Account</TabsTrigger>
            <TabsTrigger value="appearance" className="whitespace-nowrap">Appearance</TabsTrigger>
            <TabsTrigger value="notifications" className="whitespace-nowrap">Notifications</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 px-2 md:px-0">
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
