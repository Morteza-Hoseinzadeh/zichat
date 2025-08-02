'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { navItems } from '@/utils/data/data';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import WelcomeCard from './WellcomeCard';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <WelcomeCard userName={'Morteza'} />
      <Box sx={styles.mainContainer}>
        <Typography align="center" mb={4} variant="h4" sx={styles.title}>
          دسترسی سریع به خدمات
        </Typography>

        <Box sx={styles.gridContainer}>
          {navItems.slice(1).map((item, index) => (
            <motion.div key={index} whileHover={{ y: -8, scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <Box sx={styles.card} onClick={() => router.push(item.id)}>
                <Box sx={styles.cardContent}>
                  <Typography variant="h2" sx={styles.emoji}>
                    {item.emoji.toString()}
                  </Typography>
                  <Typography variant="h6" sx={styles.label}>
                    {item.fa_label}
                  </Typography>
                </Box>
                <Box sx={styles.hoverIndicator} />
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </>
  );
}

const styles = {
  mainContainer: {
    py: 4,
    px: 2,
    maxWidth: 1200,
    mx: 'auto',
  },
  title: {
    color: 'text.primary',
    fontWeight: 100,
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 80,
      height: 4,
      backgroundColor: 'primary.main',
      borderRadius: 2,
    },
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, 1fr)',
      sm: 'repeat(3, 1fr)',
      md: 'repeat(4, 1fr)',
      lg: 'repeat(5, 1fr)',
    },
    gap: 3,
    justifyContent: 'center',
  },
  card: {
    cursor: 'pointer',
    position: 'relative',
    height: 180,
    backgroundColor: 'background.paper',
    borderRadius: '16px',
    p: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
    position: 'relative',
  },
  emoji: {
    fontSize: '3.5rem',
    mb: 1.5,
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1) rotate(5deg)',
    },
  },
  label: {
    color: 'text.primary',
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.4,
  },
  hoverIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 4,
    backgroundColor: 'primary.main',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
    '.MuiBox-root:hover &': {
      transform: 'scaleX(1)',
    },
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, 1fr)',
      sm: 'repeat(3, 1fr)',
      md: 'repeat(4, 1fr)',
    },
    gap: 3,
    mb: 4,
  },
  statCard: {
    backgroundColor: 'background.paper',
    borderRadius: 2,
    p: 3,
    boxShadow: 1,
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  statTitle: {
    color: 'text.secondary',
    mb: 1,
  },
  statValue: {
    fontWeight: 700,
    color: 'text.primary',
  },
};
