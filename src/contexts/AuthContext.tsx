import React, { createContext, useContext, useState, useEffect } from 'react';
import musicFestivalImage from '@/assets/music-festival.jpg';
import techConferenceImage from '@/assets/tech-conference.jpg';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  price: number;
  purchaseDate: string;
  qrCode: string;
  ticketNumber: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  image: string;
  description: string;
  totalTickets: number;
  soldTickets: number;
  category: string;
}

interface AuthContextType {
  user: User | null;
  events: Event[];
  userTickets: Ticket[];
  login: (email: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  purchaseTicket: (eventId: string, quantity: number) => Promise<Ticket | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    date: '2024-07-15',
    time: '18:00',
    venue: 'Central Park',
    price: 89,
    image: musicFestivalImage,
    description: 'Join us for an amazing summer music festival featuring top artists!',
    totalTickets: 1000,
    soldTickets: 650,
    category: 'Music'
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    date: '2024-08-22',
    time: '09:00',
    venue: 'Convention Center',
    price: 299,
    image: techConferenceImage,
    description: 'The biggest tech conference of the year with industry leaders.',
    totalTickets: 500,
    soldTickets: 320,
    category: 'Technology'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('savemeaseat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load events from localStorage
    const savedEvents = localStorage.getItem('savemeaseat_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      localStorage.setItem('savemeaseat_events', JSON.stringify(mockEvents));
    }

    // Load user tickets from localStorage
    const savedTickets = localStorage.getItem('savemeaseat_tickets');
    if (savedTickets) {
      setUserTickets(JSON.parse(savedTickets));
    }
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    // Mock authentication
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: role === 'admin' ? 'Admin User' : 'Regular User',
      role
    };

    setUser(mockUser);
    localStorage.setItem('savemeaseat_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('savemeaseat_user');
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('savemeaseat_events', JSON.stringify(updatedEvents));
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    const updatedEvents = events.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('savemeaseat_events', JSON.stringify(updatedEvents));
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('savemeaseat_events', JSON.stringify(updatedEvents));
  };

  const purchaseTicket = async (eventId: string, quantity: number): Promise<Ticket | null> => {
    const event = events.find(e => e.id === eventId);
    if (!event || event.soldTickets + quantity > event.totalTickets || !user) {
      return null;
    }

    const QRCode = (await import('qrcode')).default;
    
    // Generate ticket
    const ticketId = Math.random().toString(36).substr(2, 12).toUpperCase();
    const ticketNumber = `SMS-${ticketId}`;
    const qrData = JSON.stringify({
      ticketId: ticketNumber,
      eventId,
      userId: user.id,
      eventTitle: event.title,
      venue: event.venue,
      date: event.date,
      time: event.time
    });
    
    const qrCode = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const newTicket: Ticket = {
      id: ticketId,
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      price: event.price,
      purchaseDate: new Date().toISOString(),
      qrCode,
      ticketNumber
    };

    const updatedTickets = [...userTickets, newTicket];
    setUserTickets(updatedTickets);
    localStorage.setItem('savemeaseat_tickets', JSON.stringify(updatedTickets));
    
    updateEvent(eventId, { soldTickets: event.soldTickets + quantity });
    return newTicket;
  };

  return (
    <AuthContext.Provider value={{
      user,
      events,
      userTickets,
      login,
      logout,
      addEvent,
      updateEvent,
      deleteEvent,
      purchaseTicket
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}