import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Clock, Ticket, ArrowLeft, Users, Star, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EventDetails() {
  const { eventId } = useParams();
  const { events, purchaseTicket, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Event Not Found</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const availableTickets = event.totalTickets - event.soldTickets;
  const soldPercentage = (event.soldTickets / event.totalTickets) * 100;

  const handlePurchaseTicket = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase tickets.",
        variant: "destructive"
      });
      return;
    }

    setIsPurchasing(true);
    try {
      const ticket = await purchaseTicket(event.id, 1);
      if (ticket) {
        toast({
          title: "Ticket Purchased Successfully!",
          description: `Your ticket for ${event.title} has been purchased.`,
        });
        navigate('/tickets');
      } else {
        toast({
          title: "Purchase Failed",
          description: "This event is sold out or unavailable.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="flex items-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">Event Details</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <Badge variant="secondary" className="backdrop-blur-sm bg-white/20 text-white border-white/30">
                {event.category}
              </Badge>
              {soldPercentage > 80 && (
                <Badge variant="destructive" className="backdrop-blur-sm animate-pulse">
                  Almost Sold Out!
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight">{event.title}</h1>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">{event.soldTickets} attending</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Event Information</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p className="text-sm text-muted-foreground">Event Date</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{event.time}</p>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{event.venue}</p>
                  <p className="text-sm text-muted-foreground">Venue</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">About This Event</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          <Separator />

          {/* Ticket Info */}
          <Card className="gradient-card border-0 shadow-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">Ticket Price</h3>
                  <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                    ${event.price}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Ticket className="w-4 h-4" />
                    <span className="text-sm">{availableTickets} tickets left</span>
                  </div>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${soldPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handlePurchaseTicket}
                disabled={availableTickets === 0 || isPurchasing}
                className="w-full h-12 gradient-primary text-white shadow-button hover:scale-105 transition-all duration-200"
                size="lg"
              >
                {isPurchasing ? 'Processing...' : 
                 availableTickets === 0 ? 'Sold Out' : 
                 'Buy Ticket Now'}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Secure payment • Instant confirmation
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}