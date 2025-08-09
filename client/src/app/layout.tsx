'use client';

import { Provider } from 'react-redux';
import store from '@/utils/toolkit/store';
import ThemedLayout from '@/components/ThemedLayout';
import '@/utils/styles/globals.css';
import { AuthProvider } from '@/utils/context/AuthContext';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode | any }>) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <ThemedLayout>{children}</ThemedLayout>
      </Provider>
    </AuthProvider>
  );
}
