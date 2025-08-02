'use client';

import React from 'react';
import { Box } from '@mui/material';

import { motion } from 'framer-motion';

import CurvedBottomNavigation from '@/components/UI/menu/menu';
import AnimatedMotion from '@/components/AnimatedMotion';
import SideBar from '@/components/UI/sidebar/sidebar';
import CryptoDashboard from '@/components/routes/News/CryptoDashboard';
import ApexChart from '@/components/routes/News/ApexChart';

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
        <CryptoDashboard />
      </AnimatedMotion>
      <AnimatedMotion>
        <ApexChart />
      </AnimatedMotion>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <CurvedBottomNavigation />
      </motion.div>
    </Box>
  );
}
