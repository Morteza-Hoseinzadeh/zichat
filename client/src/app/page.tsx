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
import AnimatedMotion from '@/components/AnimatedMotion';

// Variants
const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function Page() {
  return (
    <Box position="relative">
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <AnimatedMotion>
          <SideBar />
        </AnimatedMotion>

        <AnimatedMotion>
          <UserInfoHeader />
        </AnimatedMotion>

        <AnimatedMotion>
          <ChatsPin />
        </AnimatedMotion>

        <AnimatedMotion>
          <Box sx={fade_content}>
            <ChatsList />
          </Box>
        </AnimatedMotion>

        <motion.div variants={containerVariants}>
          <Menu />
        </motion.div>
      </motion.div>
    </Box>
  );
}

const fade_content = {
  maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0) 100%)',
  overflow: 'auto',
};
