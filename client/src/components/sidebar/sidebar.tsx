'use client';

import React from 'react';
import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';

const messages = ['🚀 چت سریع و بدون دردسر با زیچت', '🔒 امنیت بالا برای همه گفتگوها', '🎨 طراحی مدرن و تجربه کاربری روان', '🌙 پشتیبانی از حالت تاریک و روشن', '💬 مناسب برای همه پلتفرم‌ها'];

const ScrollingText = () => {
  const repeatedMessages = [...messages, ...messages]; // برای اسکرول بی‌وقفه

  return (
    <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', position: 'relative' }}>
      <Box sx={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'scroll 45s linear infinite' }}>
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

const MobileView = ({ theme }: { theme: Theme }) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" mt={2}>
    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} gap={1}>
      <Box display={'flex'} alignItems={'center'} gap={1}>
        <img src="/assets/logo/zichat-logo.png" alt="Zichat Logo" width={55} />
        <Typography variant="h6" fontWeight={100} color="text.primary">
          زیچت | Zichat
        </Typography>
      </Box>
      <Box display={'flex'} alignItems={'center'} gap={1}>
        <Typography variant="subtitle1" color="text.primary">
          خوش آمدید به زیچت
        </Typography>
      </Box>
    </Box>
    <Box sx={{ backgroundColor: theme.palette.background.paper, width: '100%', padding: '10px 0', textAlign: 'center', marginTop: '10px', borderRadius: '8px' }}>
      <ScrollingText />
    </Box>
  </Box>
);

export default function SideBar() {
  const theme = useTheme();
  const matchMdDown = useMediaQuery(theme.breakpoints.down('md'));

  return <MobileView theme={theme} />;
}
