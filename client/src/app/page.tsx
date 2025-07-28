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

// Variants
const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// TODO: Create a seperate custom component to add this effect for all of the components

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function Page() {
  return (
    <Box position="relative">
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants}>
          <SideBar />
        </motion.div>

        <motion.div variants={itemVariants}>
          <UserInfoHeader />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChatsPin />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChatsList />
        </motion.div>

        <motion.div variants={containerVariants}>
          <Menu />
        </motion.div>
      </motion.div>
    </Box>
  );
}
