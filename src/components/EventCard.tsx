import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import { Event } from '@/contexts/AuthContext';

interface EventCardProps {
  event: Event;
  onPurchase?: (eventId: string) => void;
  showAdminActions?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({ 
  event, 
  onPurchase, 
  showAdminActions = false,
  onEdit,
  onDelete 
}: EventCardProps) {
  const availableTickets = event.totalTickets - event.soldTickets;
  const soldPercentage = (event.soldTickets / event.totalTickets) * 100;

  return (
    <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-smooth hover:scale-[1.02] animate-slide-up">
      <div className="relative overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover transition-smooth hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="backdrop-blur-sm bg-white/90 dark:bg-black/90 shadow-card">
            {event.category}
          </Badge>
        </div>
        {soldPercentage > 80 && (
          <div className="absolute top-4 left-4">
            <Badge variant="destructive" className="backdrop-blur-sm animate-glow">
              Almost Sold Out!
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-card-foreground line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <MapPin className="w-4 h-4" />
              <span>{event.venue}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                ${event.price}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Ticket className="w-3 h-3" />
                {availableTickets} left
              </div>
            </div>
            
            {!showAdminActions ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = `/event/${event.id}`}
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button 
                  onClick={() => onPurchase?.(event.id)}
                  disabled={availableTickets === 0}
                  className="flex-1 gradient-primary text-white shadow-button hover:scale-105 transition-bounce"
                >
                  {availableTickets === 0 ? 'Sold Out' : 'Quick Buy'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit?.(event)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete?.(event.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}