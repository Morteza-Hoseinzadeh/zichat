'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';

// Icons
import { TbArrowLeft, TbArrowRight, TbMoon, TbSun } from 'react-icons/tb';

import { motion, AnimatePresence } from 'framer-motion';

import axiosInstance from '@/utils/hooks/axiosInstance';
import { useAuth } from '@/utils/contexts/AuthContext';
import { useThemeMode } from '@/utils/hooks/useThemeMode';

// Import tab components
import TabWelcome from '@/components/routes/sign-in/tabs/TabWelcome';
import TabPhone from '@/components/routes/sign-in/tabs/TabPhone';
import TabOtp from '@/components/routes/sign-in/tabs/TabOtp';
import TabConfirm from '@/components/routes/sign-in/tabs/TabConfirm';
import CustomSnackbar from '@/components/custom/CustomSnackbar';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const { user } = useAuth();
  const { toggleTheme, isDarkMode } = useThemeMode();

  const theme = useTheme();

  const router = useRouter();

  const [form, setForm] = useState({ username: '', phone: '', profile_picture: '' });

  const [otpCode, setOtpCode] = useState('');

  const [isUserExist, setIsUserExist] = useState<any>({});

  const [currentTab, setCurrentTab] = useState(0);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState<any>('success');

  const [loading, setLoading] = useState(false);

  const handleCheckPhoneValidation = async () => {
    if (currentTab === 1 && form.phone.trim() !== '') {
      const response = await axiosInstance.get(`/api/check/check-phone/${form.phone}`);
      return setIsUserExist(response?.data);
    }
  };

  const handleSubmit = async () => {
    setLoading(false);
    try {
      const response = await axiosInstance.post('/api/auth/sign-in', {
        username: form.username || isUserExist?.user?.username,
        phone: form.phone || isUserExist?.user?.phone,
        profile_picture: form.profile_picture || isUserExist?.user?.profile_picture,
        status: 'active',
        role: 'user',
      });

      setShowSnackbar(true);
      setSnackbarMsg(`خوش اومدی ${form.username || isUserExist?.user?.username}`);
      setSnackbarVariant('success');

      const localStorageItem: any = { token: response?.data?.token, user_id: response?.data?.user_id };
      localStorage.setItem('user-id', JSON.stringify(localStorageItem));

      setInterval(() => {
        setLoading(true);
        window.location.reload();
      }, 1500);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setShowSnackbar(true);
      setSnackbarMsg(`خطا در ارتباط با سرور`);
      setSnackbarVariant('error');
    }
  };

  const handleTabs = (action) => {
    if (action === 'plus') {
      return tabs.length - 1 > currentTab && setCurrentTab((prev) => prev + 1);
    } else {
      setForm({ phone: '', profile_picture: '', username: '' });
      setOtpCode('');
      return setCurrentTab((prev) => prev - 1);
    }
  };

  const handleActionButtons = (action) => {
    handleCheckPhoneValidation();
    if (currentTab === tabs.length - 1 && action === 'plus') {
      handleSubmit();
    }
    handleTabs(action);
  };

  const tabs = [
    { title: 'خوش آمدید', component: <TabWelcome /> },
    { title: 'شماره تلفن خود را وارد کنید', component: <TabPhone form={form} setForm={setForm} /> },
    { title: 'کد تایید', component: <TabOtp otpCode={otpCode} setOtpCode={setOtpCode} phoneNumber={form.phone} /> },
    {
      title: 'تایید اطلاعات',
      component: <TabConfirm form={form} setForm={setForm} isUserExist={isUserExist} handleBack={() => setCurrentTab(1)} />,
    },
  ];

  function handleDisabledButtonLogic() {
    if (currentTab === 1 && !/^9\d{9}$/.test(form.phone)) return true;
    if (currentTab === 2 && otpCode.length < 6) return true;
    if (currentTab === 3 && !form.username.length && !isUserExist?.exists) return true;
  }

  useEffect(() => {
    if (user) {
      router.push('/');
      return;
    }
  }, [user]);

  return (
    <>
      <Box sx={{ ...styles.container, background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 45%)` }}>
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500, width: '100%', textAlign: 'center', p: 2, borderRadius: 4, backgroundColor: 'background.paper', boxShadow: '0 15px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'left'}>
            <IconButton onClick={toggleTheme}>{isDarkMode ? <TbSun /> : <TbMoon />}</IconButton>
          </Box>

          {/* Logo Section */}
          {currentTab !== tabs.length - 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <img src="/assets/logo/zichat-logo.png" alt="zichat-logo.png" style={{ width: 80, height: 80, objectFit: 'contain' }} />
              <Typography variant="h3" fontWeight={100} color="primary.main" sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                زیچت
              </Typography>
            </Box>
          )}

          {/* Current Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div key={currentTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {tabs[currentTab].component}
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, '& .MuiButton-root': { borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } } }}>
            <Button disabled={handleDisabledButtonLogic() || loading} onClick={() => handleActionButtons('plus')} variant="contained" color="primary" size="large" startIcon={<TbArrowRight size={20} style={{ marginLeft: 4 }} />} sx={{ boxShadow: `0 4px 12px ${theme.palette.primary.light}` }}>
              {currentTab === tabs.length - 1 ? 'تایید' : 'بعدی'}
            </Button>
            <Button onClick={() => handleActionButtons('minus')} disabled={currentTab === 0} variant="outlined" color="secondary" size="large" endIcon={<TbArrowLeft size={20} style={{ marginRight: 4 }} />}>
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

      {showSnackbar && (
        <CustomSnackbar open={showSnackbar} onClose={() => setShowSnackbar(false)} variant={snackbarVariant}>
          <span>{snackbarMsg}</span>
        </CustomSnackbar>
      )}
    </>
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
