
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const AppearanceSettings = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('light');
  const [animations, setAnimations] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveAppearance = async () => {
    setIsLoading(true);
    try {
      // Here you would save the appearance settings
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      toast({
        title: "Appearance updated",
        description: "Your appearance settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appearance settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the appearance of the application. Choose a theme and other visual settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Theme</h3>
            <p className="text-sm text-muted-foreground">
              Select the theme for the dashboard.
            </p>
          </div>
          
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="border rounded-md p-2 bg-white">
                <div className="h-20 rounded-sm border border-gray-200 bg-white" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="border rounded-md p-2 bg-gray-800">
                <div className="h-20 rounded-sm border border-gray-700 bg-gray-900" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System</Label>
              </div>
              <div className="border rounded-md p-2 bg-gradient-to-r from-white to-gray-800">
                <div className="h-20 rounded-sm bg-gradient-to-r from-white to-gray-900 border border-gray-300" />
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Animations</h3>
              <p className="text-sm text-muted-foreground">
                Enable animations for a more dynamic experience.
              </p>
            </div>
            <Switch 
              checked={animations} 
              onCheckedChange={setAnimations} 
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleSaveAppearance} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
