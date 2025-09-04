import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
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
  login: (email: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  purchaseTicket: (eventId: string, quantity: number) => boolean;
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
    image: '/src/assets/music-festival.jpg',
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
    image: '/src/assets/tech-conference.jpg',
    description: 'The biggest tech conference of the year with industry leaders.',
    totalTickets: 500,
    soldTickets: 320,
    category: 'Technology'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);

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

  const purchaseTicket = (eventId: string, quantity: number): boolean => {
    const event = events.find(e => e.id === eventId);
    if (!event || event.soldTickets + quantity > event.totalTickets) {
      return false;
    }

    updateEvent(eventId, { soldTickets: event.soldTickets + quantity });
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      events,
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