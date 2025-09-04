import React from 'react';
import { Home, Search, Ticket, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { user } = useAuth();

  const userTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'events', label: 'Events', icon: Ticket },
    { id: 'analytics', label: 'Analytics', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const tabs = user?.role === 'admin' ? adminTabs : userTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border">
      <nav className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
              activeTab === id
                ? 'text-primary scale-110 gradient-primary bg-clip-text text-transparent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon 
              className={`w-5 h-5 mb-1 transition-all duration-300 ${
                activeTab === id ? 'text-primary scale-110' : ''
              }`} 
            />
            <span className="text-xs font-medium">{label}</span>
            {activeTab === id && (
              <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-glow" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}