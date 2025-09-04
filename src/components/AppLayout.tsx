import React, { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { UserDashboard } from './UserDashboard';
import { AdminDashboard } from './AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function AppLayout() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'dashboard' : 'home');

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    if (user?.role === 'admin') {
      return <AdminDashboard activeTab={activeTab} />;
    } else {
      return <UserDashboard activeTab={activeTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-lg border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              SaveMeAseat
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 min-h-[calc(100vh-140px)]">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}