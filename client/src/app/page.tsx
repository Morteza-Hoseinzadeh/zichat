'use client';

import React from 'react';

// Mui
import { Box } from '@mui/material';

// Framer Motion
import { motion } from 'framer-motion';

// Components
import AnimatedMotion from '@/components/AnimatedMotion';
import SideBar from '@/components/UI/sidebar/sidebar';
import Home from '@/components/routes/home/Home';
import UserInfoHeader from '@/components/routes/Chats/user-info-header/userInfoHeader';

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
          <Home />
        </AnimatedMotion>
      </motion.div>
    </Box>
  );
}
