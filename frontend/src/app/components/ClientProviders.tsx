'use client';

import { ReactNode } from 'react';
import ReduxProvider from './ReduxProvider';
import SessionLoader from './Auth/SessionLoader';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <SessionLoader />
      {children}
    </ReduxProvider>
  );
}
