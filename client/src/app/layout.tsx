'use client';

import { Provider } from 'react-redux';
import store from '@/utils/toolkit/store';
import ThemedLayout from '@/components/ThemedLayout';
import '@/utils/styles/globals.css';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <Provider store={store}>
        <ThemedLayout>{children}</ThemedLayout>
      </Provider>
    </html>
  );
}
