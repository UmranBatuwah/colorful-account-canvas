
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification settings
  const [settings, setSettings] = useState({
    email: {
      transactionAlerts: true,
      invoiceReminders: true,
      monthlyReport: true,
      securityAlerts: true,
    },
    push: {
      transactionAlerts: false,
      invoiceReminders: true,
      monthlyReport: false,
      securityAlerts: true,
    },
  });
  
  const toggleSetting = (channel: 'email' | 'push', setting: string) => {
    setSettings({
      ...settings,
      [channel]: {
        ...settings[channel],
        [setting]: !settings[channel][setting as keyof typeof settings[typeof channel]],
      },
    });
  };
  
  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // Here you would save the notification settings
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Manage how you receive notifications and alerts from the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-sm">Transaction Alerts</h4>
                  <p className="text-xs text-muted-foreground">
                    Get notified when a new transaction is recorded
                  </p>
                </div>
                <Switch
                  checked={settings.email.transactionAlerts}
                  onCheckedChange={() => toggleSetting('email', 'transactionAlerts')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-sm">Invoice Reminders</h4>
                  <p className="text-xs text-muted-foreground">
                    Receive reminders about upcoming and overdue invoices
                  </p>
                </div>
                <Switch
                  checked={settings.email.invoiceReminders}
                  onCheckedChange={() => toggleSetting('email', 'invoiceReminders')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-sm">Monthly Reports</h4>
                  <p className="text-xs text-muted-foreground">
                    Get a monthly summary of your financial activities
                  </p>
                </div>
                <Switch
                  checked={settings.email.monthlyReport}
                  onCheckedChange={() => toggleSetting('email', 'monthlyReport')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-sm">Security Alerts</h4>
                  <p className="text-xs text-muted-foreground">
                    Be notified about important security events
                  </p>
                </div>
                <Switch
                  checked={settings.email.securityAlerts}
                  onCheckedChange={() => toggleSetting('email', 'securityAlerts')}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-sm">Transaction Alerts</h4>
                  <p className="text-xs text-muted-foreground">
                    Get push notifications for new transactions
                  </p>
                </div>
                <Switch
                  checked={settings.push.transactionAlerts}
                  onCheckedChange={() => toggleSetting('push', 'transactionAlerts')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-sm">Invoice Reminders</h4>
                  <p className="text-xs text-muted-foreground">
                    Receive push reminders about invoices
                  </p>
                </div>
                <Switch
                  checked={settings.push.invoiceReminders}
                  onCheckedChange={() => toggleSetting('push', 'invoiceReminders')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-sm">Monthly Reports</h4>
                  <p className="text-xs text-muted-foreground">
                    Get push notifications for monthly reports
                  </p>
                </div>
                <Switch
                  checked={settings.push.monthlyReport}
                  onCheckedChange={() => toggleSetting('push', 'monthlyReport')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-sm">Security Alerts</h4>
                  <p className="text-xs text-muted-foreground">
                    Receive critical security notifications
                  </p>
                </div>
                <Switch
                  checked={settings.push.securityAlerts}
                  onCheckedChange={() => toggleSetting('push', 'securityAlerts')}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleSaveNotifications} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
