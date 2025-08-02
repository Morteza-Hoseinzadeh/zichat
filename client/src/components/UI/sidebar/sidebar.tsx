'use client';

import React from 'react';
import { Box, IconButton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { TbMoon, TbSettings, TbSun } from 'react-icons/tb';
import { useThemeMode } from '@/utils/hooks/useThemeMode';

const messages = ['🚀 چت سریع و بدون دردسر با زیچت', '🔒 امنیت بالا برای همه گفتگوها', '🎨 طراحی مدرن و تجربه کاربری روان', '🌙 پشتیبانی از حالت تاریک و روشن', '💬 مناسب برای همه پلتفرم‌ها'];
const ScrollingText = () => {
  const repeatedMessages = [...messages, ...messages];

  return (
    <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', position: 'relative' }}>
      <Box sx={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'scroll 30s linear infinite' }}>
        {repeatedMessages.map((msg, index) => (
          <Typography key={index} component="span" variant="body2" sx={{ px: 2, color: 'text.primary', display: 'inline-block' }}>
            {msg}
          </Typography>
        ))}
      </Box>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </Box>
  );
};

const MobileView = ({ theme }: { theme: Theme }) => {
  const { toggleTheme, isDarkMode } = useThemeMode();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" mt={2}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} gap={1}>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <img src="/assets/logo/zichat-logo.png" alt="Zichat Logo" width={55} />
          <Typography variant="h6" fontWeight={100} color="text.primary">
            زیچت | Zichat
          </Typography>
        </Box>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <IconButton onClick={toggleTheme}>{isDarkMode ? <TbSun /> : <TbMoon />}</IconButton>
          <IconButton>
            <TbSettings />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: theme.palette.background.paper, width: '100%', padding: '10px 0', textAlign: 'center', marginY: '12px', borderRadius: '8px' }}>
        <ScrollingText />
      </Box>
    </Box>
  );
};

export default function SideBar() {
  const theme = useTheme();

  return <MobileView theme={theme} />;
}
