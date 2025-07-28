'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { TbDots } from 'react-icons/tb';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

const mock = [
  { id: 1, type: 'user', name: 'سینا شکوری', lastMessage: 'سلام، حالت چطوره؟', timestamp: '14:23', unreadCount: 2, avatar: '/assets/avatars/avatar.jpg' },
  { id: 2, type: 'user', name: 'آرمان معصومی', lastMessage: 'فایل رو دریافت کردم ممنون', timestamp: '13:10', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
  { id: 3, type: 'group', name: 'تیم طراحی', lastMessage: 'جلسه بعدی کیه؟', timestamp: '11:30', unreadCount: 5, avatar: '/assets/avatars/avatar.jpg' },
  { id: 4, type: 'group', name: 'توسعه‌دهندگان وب', lastMessage: 'سورس کد آپلود شد', timestamp: '10:15', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
  { id: 5, type: 'channel', name: 'کانال اخبار تکنولوژی', lastMessage: 'نسخه جدید React منتشر شد', timestamp: '09:00', unreadCount: 3, avatar: '/assets/avatars/avatar.jpg' },
  { id: 6, type: 'channel', name: 'زنگ تفریح', lastMessage: 'جوک روز 😂', timestamp: '08:20', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
  { id: 7, type: 'bot', name: 'ترجمه‌یار', lastMessage: 'ترجمه: Hello → سلام', timestamp: '07:00', unreadCount: 1, avatar: '/assets/avatars/avatar.jpg' },
  { id: 8, type: 'bot', name: 'هواشناسی', lastMessage: 'امروز: آفتابی ☀️', timestamp: '06:30', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
];

const pageVariants: any = {
  initial: { y: '100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 140, damping: 15, duration: 0.2 },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { type: 'tween', ease: 'easeInOut', duration: 0.15 },
  },
};

function Header({ onClose }: { onClose: () => void }) {
  const checkConnection = {
    online: { lable: 'آنلاین', value: 'online', color: 'secondary.main' },
    offline: { lable: 'آفلاین', value: 'offline', color: 'error.main' },
  };

  const checkConnectionStatus = checkConnection['online'];

  return (
    <Box sx={styles.header}>
      <Box display={'flex'} alignItems={'center'} gap={1} sx={{ img: { border: '1px solid', borderColor: checkConnectionStatus.color, borderRadius: '50%' } }}>
        <img src="/assets/avatars/avatar.jpg" alt="avatar.jpg" width={65} height={65} />
        <Box>
          <Typography variant="h6" fontWeight={900} color="text.primary">
            محمد رفعتی
          </Typography>
          <Box display={'flex'} alignItems={'center'} gap={0.5}>
            <Box sx={{ backgroundColor: checkConnectionStatus.color, width: '12px', height: '12px', display: 'inline-block', borderRadius: '50%' }} />
            <Typography variant="body1" color="text.disabled">
              {checkConnectionStatus.lable}
            </Typography>
            {/* <Typography variant="body1" color="text.disabled" className="typing">
              در حال نوشتن
            </Typography>
            <Typography variant="body1" color="text.disabled">
              آخرین بازدید در {ConvertToPersianDigit('19:34')}
            </Typography> */}
          </Box>
        </Box>
      </Box>
      <Box display={'flex'} alignItems={'center'}>
        <Box mt={0.5}>
          <Button variant="text" sx={{ fontSize: 18, px: 2, borderRadius: '12px' }} onClick={onClose}>
            بازگشت
          </Button>
        </Box>
        <Box sx={{ transform: 'rotate(90deg)' }}>
          <IconButton>
            <TbDots />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

function Keyboard() {
  return (
    <Box sx={styles.input}>
      <input type="text" placeholder="پیام خود را بنویسید" style={styles.textInput} />
    </Box>
  );
}

export default function ChatView() {
  const { id } = useParams();
  const router = useRouter();
  const [show, setShow] = useState(true);

  const chat = mock.find((chat) => String(chat.id) === String(id));
  if (!chat) return null;

  const handleClose = () => {
    setShow(false);
    setTimeout(() => router.push('/'), 150);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="chatView" initial="initial" animate="animate" exit="exit" variants={pageVariants} style={styles.overlay}>
          <Header onClose={handleClose} />
          <Box flex={1} p={2} overflow="auto">
            <Typography>{chat.lastMessage}</Typography>
          </Box>
          <Keyboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles: any = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'background.default',
  },
  header: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'background.paper',
    m: 3,
    borderRadius: '16px',
  },
  input: {
    padding: 16,
    backgroundColor: 'background.default',
  },
  textInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '15px',
  },
};
