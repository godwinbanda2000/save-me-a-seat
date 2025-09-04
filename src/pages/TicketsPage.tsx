import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Clock, Ticket, Plus } from 'lucide-react';

export default function TicketsPage() {
  const { userTickets, user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Login Required</h2>
          <p className="text-muted-foreground">Please login to view your tickets</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const upcomingTickets = userTickets.filter(ticket => new Date(ticket.eventDate) >= new Date());
  const pastTickets = userTickets.filter(ticket => new Date(ticket.eventDate) < new Date());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="flex items-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">My Tickets</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {userTickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="gradient-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Ticket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Tickets Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start exploring amazing events and get your first ticket!
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="gradient-primary text-white shadow-button hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Browse Events
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upcoming Tickets */}
            {upcomingTickets.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Upcoming Events</h2>
                  <Badge variant="secondary">{upcomingTickets.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {upcomingTickets.map((ticket) => (
                    <Card 
                      key={ticket.id} 
                      className="overflow-hidden shadow-card hover:shadow-glow transition-smooth cursor-pointer"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{ticket.eventTitle}</h3>
                            <Badge variant="outline" className="text-xs">
                              {ticket.ticketNumber}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
                              ${ticket.price}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{ticket.eventTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{ticket.eventVenue}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Valid
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Tap to view QR code
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Tickets */}
            {pastTickets.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Past Events</h2>
                  <Badge variant="outline">{pastTickets.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {pastTickets.map((ticket) => (
                    <Card 
                      key={ticket.id} 
                      className="overflow-hidden opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{ticket.eventTitle}</h3>
                            <Badge variant="outline" className="text-xs">
                              {ticket.ticketNumber}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-muted-foreground">
                              ${ticket.price}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{ticket.eventTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{ticket.eventVenue}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                          <Badge variant="outline" className="text-muted-foreground">
                            Used
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Tap to view details
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}