'use client';

import React from 'react';

// Utils
import { useAuth } from '@/utils/contexts/AuthContext';
import { useThemeMode } from '@/utils/hooks/useThemeMode';

import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';

// Icons
import { TbArrowLeft, TbArrowRight, TbMoon, TbSun } from 'react-icons/tb';

export default function SignIn() {
  const theme = useTheme();

  const { user } = useAuth();
  const { toggleTheme, isDarkMode } = useThemeMode();

  const matchMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const signUpTabs = ['خوش آمدید', 'شماره تلفن خود را وارد کنید', 'کد تایید', 'وارد کردن اطلاعات', 'تایید اطلاعات'];
  const signInTabs = ['خوش آمدید', 'شماره تلفن خود را وارد کنید', 'کد تایید', 'تایید اطلاعات'];

  return (
    <Box sx={{ ...styles.container, background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 45%)` }}>
      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500, width: '100%', textAlign: 'center', p: 2, borderRadius: 4, backgroundColor: 'background.paper', boxShadow: '0 15px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'left'}>
          <IconButton onClick={toggleTheme}>{isDarkMode ? <TbSun /> : <TbMoon />}</IconButton>
        </Box>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
          <img src="/assets/logo/zichat-logo.png" alt="zichat-logo.png" style={{ width: 80, height: 80, objectFit: 'contain' }} />
          <Typography variant="h3" fontWeight={100} color="primary.main" sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            زیچت
          </Typography>
        </Box>

        {/* Welcome Text */}
        <Box sx={{ mb: 4 }}>
          <Typography variant={matchMdDown ? 'h5' : 'h4'} fontWeight={900} color="text.primary" sx={{ mb: 1 }}>
            به زیچت خوش آمدید 🎉
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ opacity: 0.8 }}>
            پیام‌رسان هوشمند فارسی
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, '& .MuiButton-root': { borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } } }}>
          <Button variant="contained" color="primary" size="large" startIcon={<TbArrowRight size={20} style={{ marginLeft: 4 }} />} sx={{ boxShadow: `0 4px 12px ${theme.palette.primary.light}` }}>
            ادامه
          </Button>
          <Button variant="outlined" color="secondary" size="large" endIcon={<TbArrowLeft size={20} style={{ marginRight: 4 }} />}>
            برگشت
          </Button>
        </Box>

        {/* Footer Note */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, opacity: 0.6, fontSize: '0.75rem', textDecoration: 'underline' }}>
          <a href="/privacy">با ورود یا نام، با شرایط و قوانین موافقت می‌کنید</a>
        </Typography>
      </Box>

      {/* Decorative Elements */}
      <Box sx={{ position: 'absolute', bottom: -100, left: 50, width: 300, height: 300, background: `radial-gradient(circle, ${theme.palette.secondary.light} 0%, transparent 70%)`, opacity: 0.15, zIndex: 0 }} />
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    p: 3,
    overflow: 'hidden !important',
    position: 'relative',
    '&:before': { content: '""', position: 'absolute', top: '-50%', right: '-50%', width: '0%', height: '0%', opacity: 0.2, zIndex: 0 },
  },
};
