'use client';

import React from 'react';
import { Box } from '@mui/material';

import ChatsPin from '@/components/routes/Chats/chats-pin/chatsPin';
import CurvedBottomNavigation from '@/components/UI/menu/menu';
import ChatsList from '@/components/routes/Chats/chats-list/chatsList';

import { motion } from 'framer-motion';
import AnimatedMotion from '@/components/AnimatedMotion';
import SideBar from '@/components/UI/sidebar/sidebar';
import UserInfoHeader from '@/components/routes/Chats/user-info-header/userInfoHeader';

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function page() {
  return (
    <Box position="relative">
      <AnimatedMotion>
        <SideBar />
      </AnimatedMotion>
      <AnimatedMotion>
        <UserInfoHeader />
      </AnimatedMotion>
      <AnimatedMotion>
        <ChatsList />
      </AnimatedMotion>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <CurvedBottomNavigation />
      </motion.div>
    </Box>
  );
}
