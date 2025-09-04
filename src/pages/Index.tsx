import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { AppLayout } from '@/components/AppLayout';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm onSuccess={() => {}} />;
  }

  return <AppLayout />;
};

export default Index;
