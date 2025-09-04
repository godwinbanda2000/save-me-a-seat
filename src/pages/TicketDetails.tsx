import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, Clock, Download, Share } from 'lucide-react';

export default function TicketDetails() {
  const { ticketId } = useParams();
  const { userTickets } = useAuth();
  const navigate = useNavigate();

  const ticket = userTickets.find(t => t.id === ticketId);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Ticket Not Found</h2>
          <Button onClick={() => navigate('/tickets')}>Back to My Tickets</Button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `ticket-${ticket.ticketNumber}.png`;
    link.href = ticket.qrCode;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="flex items-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/tickets')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">My Ticket</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card className="gradient-card border-0 shadow-glow overflow-hidden">
          <CardContent className="p-0">
            {/* Ticket Header */}
            <div className="gradient-hero p-6 text-white text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-1">{ticket.eventTitle}</h2>
                <p className="text-white/90 text-sm">SaveMeAseat</p>
                <div className="absolute -right-8 -top-8 w-24 h-24 border border-white/20 rounded-full"></div>
                <div className="absolute -left-12 -bottom-6 w-20 h-20 border border-white/10 rounded-full"></div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-6 text-center bg-white dark:bg-background">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-inner mb-4">
                <img 
                  src={ticket.qrCode} 
                  alt="Ticket QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-lg font-bold mb-1">{ticket.ticketNumber}</p>
              <p className="text-sm text-muted-foreground">Scan this code at the venue</p>
            </div>

            <Separator />

            {/* Event Details */}
            <div className="p-6 space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{new Date(ticket.eventDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p className="text-sm text-muted-foreground">Event Date</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{ticket.eventTime}</p>
                    <p className="text-sm text-muted-foreground">Start Time</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{ticket.eventVenue}</p>
                    <p className="text-sm text-muted-foreground">Venue</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Purchase Date</span>
                <span>{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount Paid</span>
                <span className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
                  ${ticket.price}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Present this ticket at the venue entrance. Keep it safe and do not share screenshots.
          </p>
        </div>
      </div>
    </div>
  );
}