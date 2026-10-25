import React from 'react';
import AuthScreen from '@/components/AuthScreen';

export const metadata = {
  title: 'PRISM • Executive Intelligence Authentication & Onboarding',
  description: 'Sign in to your PRISM executive news dossier or create an account with 6-digit cryptographic verification and personalized feeds.',
};

export default function AuthPage() {
  return <AuthScreen />;
}
