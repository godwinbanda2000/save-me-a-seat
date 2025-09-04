import React, { useState } from 'react';
import { EventCard } from './EventCard';
import { useAuth, Event } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Ticket, TrendingUp, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  activeTab: string;
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const { events, addEvent, updateEvent, deleteEvent } = useAuth();
  const { toast } = useToast();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    price: 0,
    description: '',
    totalTickets: 100,
    category: 'Music',
    image: '/api/placeholder/400/300'
  });

  const resetForm = () => {
    setEventForm({
      title: '',
      date: '',
      time: '',
      venue: '',
      price: 0,
      description: '',
      totalTickets: 100,
      category: 'Music',
      image: '/api/placeholder/400/300'
    });
  };

  const handleAddEvent = () => {
    addEvent({
      ...eventForm,
      soldTickets: 0
    });
    setIsAddingEvent(false);
    resetForm();
    toast({
      title: "Event Created!",
      description: "New event has been successfully created.",
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      price: event.price,
      description: event.description,
      totalTickets: event.totalTickets,
      category: event.category,
      image: event.image
    });
  };

  const handleUpdateEvent = () => {
    if (editingEvent) {
      updateEvent(editingEvent.id, {
        ...eventForm,
        soldTickets: editingEvent.soldTickets
      });
      setEditingEvent(null);
      resetForm();
      toast({
        title: "Event Updated!",
        description: "Event has been successfully updated.",
      });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    toast({
      title: "Event Deleted!",
      description: "Event has been successfully deleted.",
    });
  };

  const totalRevenue = events.reduce((sum, event) => sum + (event.soldTickets * event.price), 0);
  const totalTicketsSold = events.reduce((sum, event) => sum + event.soldTickets, 0);

  const renderDashboard = () => (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Ticket className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
                <p className="text-2xl font-bold">{totalTicketsSold}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold">+12%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.soldTickets} tickets sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${event.soldTickets * event.price}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEvents = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Manage Events</h2>
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white shadow-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Event title"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                />
                <Input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                />
              </div>
              <Input
                placeholder="Venue"
                value={eventForm.venue}
                onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Price"
                  value={eventForm.price}
                  onChange={(e) => setEventForm({...eventForm, price: Number(e.target.value)})}
                />
                <Input
                  type="number"
                  placeholder="Total tickets"
                  value={eventForm.totalTickets}
                  onChange={(e) => setEventForm({...eventForm, totalTickets: Number(e.target.value)})}
                />
              </div>
              <Input
                placeholder="Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              />
              <Button onClick={handleAddEvent} className="w-full">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            showAdminActions
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        ))}
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Event title"
              value={eventForm.title}
              onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
              />
              <Input
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
              />
            </div>
            <Input
              placeholder="Venue"
              value={eventForm.venue}
              onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Price"
                value={eventForm.price}
                onChange={(e) => setEventForm({...eventForm, price: Number(e.target.value)})}
              />
              <Input
                type="number"
                placeholder="Total tickets"
                value={eventForm.totalTickets}
                onChange={(e) => setEventForm({...eventForm, totalTickets: Number(e.target.value)})}
              />
            </div>
            <Input
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
            />
            <Button onClick={handleUpdateEvent} className="w-full">
              Update Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Analytics</h2>
      <div className="text-center py-12">
        <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
        <p className="text-muted-foreground">
          Detailed analytics coming soon
        </p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Settings</h2>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            General Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Payment Configuration
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Email Templates
          </Button>
          <Button variant="outline" className="w-full justify-start">
            User Management
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = {
    dashboard: renderDashboard,
    events: renderEvents,
    analytics: renderAnalytics,
    settings: renderSettings
  };

  return tabs[activeTab as keyof typeof tabs]?.() || renderDashboard();
}