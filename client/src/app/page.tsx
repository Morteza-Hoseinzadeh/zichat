'use client';

import React from 'react';

// Mui
import { Box } from '@mui/material';

// Framer Motion
import { motion } from 'framer-motion';

// Components
import SideBar from '@/components/sidebar/sidebar';
import ChatsPin from '@/components/chats-pin/chatsPin';
import UserInfoHeader from '@/components/user-info-header/userInfoHeader';
import ChatsList from '@/components/chats-list/chatsList';
import Menu from '@/components/menu/menu';

export default function page() {
  return (
    <Box position={'relative'}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <SideBar />
        <UserInfoHeader />
        <ChatsPin />
        <ChatsList />
        <Menu />
      </motion.div>
    </Box>
  );
}
