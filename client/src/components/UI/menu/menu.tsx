'use client';

import React, { useState } from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '@/utils/data/data';
import { usePathname, useRouter } from 'next/navigation';

export default function CurvedBottomNavigation() {
  const theme = useTheme();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box position="fixed" bottom={0} left={0} right={0} display="flex" justifyContent="center" pb={2} zIndex={10}>
      <Box sx={styles.container}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;

          return (
            <Box key={item.id} position="relative" flex={1} display="flex" justifyContent="center">
              <AnimatePresence>
                {isActive && (
                  <motion.div layoutId="activeButton" transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ ...styles.navigation_bar, backgroundColor: theme.palette.primary.main }}>
                    <Icon size={28} color="white" />
                  </motion.div>
                )}
              </AnimatePresence>

              <Tooltip title={item.fa_label} arrow placement="top">
                <IconButton onClick={() => router.push(item.id)} sx={{ color: isActive ? 'transparent' : 'text.secondary', zIndex: 1, transition: 'all 0.3s ease', '&:hover': { color: isActive ? 'transparent' : 'primary.main', transform: 'translateY(-4px)' } }}>
                  <Icon size={24} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

const styles: any = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    height: 70,
    backgroundColor: 'background.paper',
    border: '2px dashed',
    borderColor: 'primary.main',
    borderRadius: 40,
    display: 'flex',
    alignItems: 'center',
    px: 3,
    mx: 2,
    boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease-in-out',
  },
  navigation_bar: {
    position: 'absolute',
    top: -32,
    width: 64,
    height: 64,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    zIndex: 2,
    cursor: 'pointer',
  },
};
