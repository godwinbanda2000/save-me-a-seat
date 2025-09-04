import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, Shield } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (role: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      const success = await login(email, password, role);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md shadow-card backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-4">
          <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-glow">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SaveMeAseat
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                User
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="space-y-4 mt-6">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-smooth"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-smooth"
                />
                <Button 
                  onClick={() => handleLogin('user')}
                  disabled={isLoading}
                  className="w-full gradient-primary text-white shadow-button hover:scale-105 transition-bounce"
                >
                  {isLoading ? 'Signing In...' : 'Sign In as User'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4 mt-6">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-smooth"
                />
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-smooth"
                />
                <Button 
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full shadow-button hover:scale-105 transition-bounce"
                >
                  {isLoading ? 'Signing In...' : 'Sign In as Admin'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <p className="text-sm text-muted-foreground text-center">
            Demo app - use any credentials to sign in
          </p>
        </CardContent>
      </Card>
    </div>
  );
}