'use client';

import React from 'react';
import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';

function GlitchText({ text }: { text: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        fontWeight: 'bold',
        color: 'text.primary',
        textTransform: 'uppercase',
        letterSpacing: 1,
        '&::before, &::after': { content: `"${text}"`, position: 'absolute', top: 0, left: 0, width: '100%', overflow: 'hidden', color: '#A970FF', clipPath: 'inset(0 0 0 0)' },
        '&::before': { animation: 'glitchTop 2s infinite linear alternate-reverse', zIndex: -1 },
        '&::after': { animation: 'glitchBottom 2s infinite linear alternate-reverse', zIndex: -2, color: '#00FFAA' },
      }}
    >
      {text}
      <style jsx global>{`
        @keyframes glitchTop {
          0% {
            transform: translate(0);
            clip-path: inset(0 0 85% 0);
          }
          20% {
            transform: translate(-2px, -2px);
          }
          40% {
            transform: translate(2px, 2px);
          }
          60% {
            transform: translate(-1px, 1px);
            clip-path: inset(0 0 20% 0);
          }
          80% {
            transform: translate(1px, -1px);
          }
          100% {
            transform: translate(0);
            clip-path: inset(0 0 85% 0);
          }
        }

        @keyframes glitchBottom {
          0% {
            transform: translate(0);
            clip-path: inset(85% 0 0 0);
          }
          20% {
            transform: translate(2px, 2px);
          }
          40% {
            transform: translate(-2px, -1px);
          }
          60% {
            transform: translate(1px, 1px);
            clip-path: inset(60% 0 10% 0);
          }
          80% {
            transform: translate(-1px, -2px);
          }
          100% {
            transform: translate(0);
            clip-path: inset(85% 0 0 0);
          }
        }
      `}</style>
    </Box>
  );
}

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
        <GlitchText text="خوش اومدی به زیچت مرتضی💜" />
      </Box>
    </Box>
    <Box sx={{ backgroundColor: theme.palette.background.paper, width: '100%', padding: '10px 0', textAlign: 'center', marginY: '12px', borderRadius: '8px' }}>
      <ScrollingText />
    </Box>
  </Box>
);

export default function SideBar() {
  const theme = useTheme();

  return <MobileView theme={theme} />;
}
