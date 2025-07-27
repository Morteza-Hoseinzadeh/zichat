'use client';

import React from 'react';

// Framer Motion
import { motion } from 'framer-motion';

// Components
import SideBar from '@/components/sidebar/sidebar';
import ChatsPin from '@/components/chats-pin/chatsPin';
import UserInfoHeader from '@/components/user-info-header/userInfoHeader';

export default function page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
      <SideBar />
      <UserInfoHeader />
      <ChatsPin />
    </motion.div>
  );
}
