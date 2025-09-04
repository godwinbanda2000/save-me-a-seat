import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EventCard } from './EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, TrendingUp, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserDashboardProps {
  activeTab: string;
}

export function UserDashboard({ activeTab }: UserDashboardProps) {
  const { events, purchaseTicket, userTickets } = useAuth();
  const { toast } = useToast();

  const handlePurchaseTicket = async (eventId: string) => {
    const ticket = await purchaseTicket(eventId, 1);
    if (ticket) {
      toast({
        title: "Ticket Purchased!",
        description: "Your ticket has been successfully purchased.",
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: "This event is sold out or unavailable.",
        variant: "destructive"
      });
    }
  };

  const renderHome = () => (
    <div className="p-4 space-y-6">
      {/* Hero Section */}
      <div className="gradient-hero rounded-2xl p-6 text-white shadow-glow">
        <h2 className="text-2xl font-bold mb-2">Discover Amazing Events</h2>
        <p className="text-white/90 mb-4">Find and book tickets for the hottest events in your city</p>
        <Button variant="secondary" className="shadow-button">
          <Star className="w-4 h-4 mr-2" />
          Explore Now
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Popular Categories</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Music', 'Technology', 'Sports', 'Arts', 'Food'].map((category) => (
            <Badge 
              key={category} 
              variant="outline" 
              className="flex-shrink-0 px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-smooth cursor-pointer"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Featured Events */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Featured Events</h3>
          <Button variant="ghost" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid gap-4">
          {events.slice(0, 3).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPurchase={handlePurchaseTicket}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events..."
            className="pl-10 pr-12"
          />
          <Button size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPurchase={handlePurchaseTicket}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Tickets</h2>
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/tickets'}
          className="text-primary"
        >
          View All
        </Button>
      </div>
      
      {userTickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
          <p className="text-muted-foreground mb-4">
            Purchase your first ticket to see it here
          </p>
          <Button className="gradient-primary text-white shadow-button">
            Browse Events
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {userTickets.slice(0, 3).map((ticket) => (
            <Card 
              key={ticket.id} 
              className="cursor-pointer hover:shadow-glow transition-smooth"
              onClick={() => window.location.href = `/ticket/${ticket.id}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{ticket.eventTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ticket.eventDate).toLocaleDateString()} • {ticket.eventTime}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Valid
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Ticket: {ticket.ticketNumber}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Profile</h2>
      <div className="space-y-4">
        <div className="gradient-card rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Payment Methods
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Help & Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = {
    home: renderHome,
    search: renderSearch,
    tickets: renderTickets,
    profile: renderProfile
  };

  return tabs[activeTab as keyof typeof tabs]?.() || renderHome();
}