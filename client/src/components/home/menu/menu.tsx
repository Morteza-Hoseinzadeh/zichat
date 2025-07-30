'use client';

import React, { useState } from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { TbMessage, TbRobotFace, TbNews, TbList, TbHome, TbDeviceGamepad, TbSettings } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'home', fa_label: 'صفحه اصلی', icon: TbHome },
  { id: 'message', fa_label: 'پیام‌ها', icon: TbMessage },
  { id: 'chat-gpt', fa_label: 'چت‌بات', icon: TbRobotFace },
  { id: 'game', fa_label: 'بازی', icon: TbDeviceGamepad },
  { id: 'todo-list', fa_label: 'لیست کارها', icon: TbList },
  { id: 'setting', fa_label: 'اخبار', icon: TbSettings },
];

export default function CurvedBottomNavigation() {
  const [active, setActive] = useState('message');
  const theme = useTheme();

  return (
    <Box position="fixed" bottom={0} left={0} right={0} display="flex" justifyContent="center" pb={2} zIndex={10}>
      <Box sx={styles.container}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Box key={item.id} position="relative" flex={1} display="flex" justifyContent="center">
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeButton"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      position: 'absolute',
                      top: -32,
                      width: 64,
                      height: 64,
                      borderRadius: 999,
                      backgroundColor: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      zIndex: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => setActive(item.id)}
                  >
                    <Icon size={28} color="white" />
                  </motion.div>
                )}
              </AnimatePresence>

              <Tooltip title={item.fa_label} arrow placement="top">
                <IconButton
                  onClick={() => setActive(item.id)}
                  sx={{
                    color: isActive ? 'transparent' : 'text.secondary',
                    zIndex: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: isActive ? 'transparent' : 'primary.main',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
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

const styles = {
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
};
