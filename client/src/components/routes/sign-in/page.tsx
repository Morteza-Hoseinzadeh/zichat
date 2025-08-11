'use client';

import React, { useState } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';

// Icons
import { TbArrowLeft, TbArrowRight, TbMoon, TbSun } from 'react-icons/tb';

import { motion, AnimatePresence } from 'framer-motion';

import axiosInstance from '@/utils/hooks/axiosInstance';
import { useThemeMode } from '@/utils/hooks/useThemeMode';

// Import tab components
import TabWelcome from '@/components/routes/sign-in/tabs/TabWelcome';
import TabPhone from '@/components/routes/sign-in/tabs/TabPhone';
import TabOtp from '@/components/routes/sign-in/tabs/TabOtp';
import TabConfirm from '@/components/routes/sign-in/tabs/TabConfirm';

export default function SignIn() {
  const theme = useTheme();
  const { toggleTheme, isDarkMode } = useThemeMode();

  const [form, setForm] = useState({ username: '', phone: '', profile_picture: '' });

  const [otpCode, setOtpCode] = useState('');

  const [isUserExist, setIsUserExist] = useState({});

  const [currentTab, setCurrentTab] = useState(0);
  const tabs = [
    { title: 'خوش آمدید', component: <TabWelcome /> },
    { title: 'شماره تلفن خود را وارد کنید', component: <TabPhone form={form} setForm={setForm} /> },
    { title: 'کد تایید', component: <TabOtp otpCode={otpCode} setOtpCode={setOtpCode} /> },
    { title: 'تایید اطلاعات', component: <TabConfirm form={form} /> },
  ];

  const handleCheckPhoneValidation = async () => {
    if (currentTab === 1 && form.phone.trim() !== '')
      try {
        console.log(form.phone);
        const response = await axiosInstance.get(`/api/check/check-phone/+98${form.phone}`);
        return setIsUserExist(response?.data);
      } catch (error) {
        console.log(error);
      }
  };

  const handleTabs = (action) => {
    handleCheckPhoneValidation();
    if (action === 'plus') {
      return tabs.length - 1 > currentTab && setCurrentTab((prev) => prev + 1);
    }
    return setCurrentTab((prev) => prev - 1);
  };

  return (
    <Box sx={{ ...styles.container, background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 45%)` }}>
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

        {/* Current Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={currentTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {tabs[currentTab].component}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, '& .MuiButton-root': { borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } } }}>
          <Button onClick={() => handleTabs('plus')} variant="contained" color="primary" size="large" startIcon={<TbArrowRight size={20} style={{ marginLeft: 4 }} />} sx={{ boxShadow: `0 4px 12px ${theme.palette.primary.light}` }}>
            {currentTab === tabs.length - 1 ? 'تایید' : 'بعدی'}
          </Button>
          <Button onClick={() => handleTabs('minus')} disabled={currentTab === 0} variant="outlined" color="secondary" size="large" endIcon={<TbArrowLeft size={20} style={{ marginRight: 4 }} />}>
            برگشت
          </Button>
        </Box>

        {/* Tab Indicators */}
        <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row-reverse'} gap={1} mt={3}>
          <AnimatePresence>
            {tabs.map((_, index) => (
              <motion.div
                key={index}
                layout
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: currentTab === index ? 1.2 : 1, opacity: 1, width: currentTab === index ? '20px' : '8px' }}
                exit={{ scale: 0.8, opacity: 0.6 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30, opacity: { duration: 0.2 } }}
                onClick={() => setCurrentTab(index)}
                style={{ height: '8px', display: 'inline-block', backgroundColor: theme.palette.primary.main, borderRadius: currentTab === index ? '8px' : '50%', cursor: 'pointer', originX: 0.5 }}
              />
            ))}
          </AnimatePresence>
        </Box>

        {/* Footer Note */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, opacity: 0.6, fontSize: '0.75rem', textDecoration: 'underline' }}>
          <a href="/privacy">با ورود یا ثبت نام، با شرایط و قوانین موافقت می‌کنید</a>
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
