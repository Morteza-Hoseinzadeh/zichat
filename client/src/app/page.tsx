'use client';

import React from 'react';

// Mui
import { Box } from '@mui/material';

// Framer Motion
import { motion } from 'framer-motion';

// Components
import SideBar from '@/components/UI/sidebar/sidebar';
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
      </motion.div>
    </Box>
  );
}
