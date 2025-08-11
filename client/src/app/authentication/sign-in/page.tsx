'use client';

import React, { useEffect } from 'react';

// Mui
import { Box } from '@mui/material';

// Framer Motion
import { motion } from 'framer-motion';

// Components
import SignIn from '@/components/routes/sign-in/page';

// Variants
const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function Page() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <SignIn />
    </motion.div>
  );
}
