'use client';

import React from 'react';

// Components
import SideBar from '@/components/sidebar/sidebar';
import ChatsPin from '@/components/chats-pin/chatsPin';

// Utils
import { useThemeMode } from '@/utils/hooks/useThemeMode';

// Framer Motion
import { motion } from 'framer-motion';

export default function page() {
  const { toggleTheme, isDarkMode } = useThemeMode();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
      <SideBar />
      <ChatsPin />
      <button onClick={toggleTheme}>Toggle Theme</button>
    </motion.div>
  );
}
