'use client';

import { useParams, useRouter } from 'next/navigation';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { TbArrowLeft } from 'react-icons/tb';

const mock = [
  { id: 1, type: 'user', name: 'سینا شکوری', lastMessage: 'سلام، حالت چطوره؟', timestamp: '14:23', unreadCount: 2, avatar: '/assets/avatars/avatar.png' },
  { id: 2, type: 'user', name: 'آرمان معصومی', lastMessage: 'فایل رو دریافت کردم ممنون', timestamp: '13:10', unreadCount: 0, avatar: '/assets/avatars/avatar.png' },
  { id: 3, type: 'group', name: 'تیم طراحی', lastMessage: 'جلسه بعدی کیه؟', timestamp: '11:30', unreadCount: 5, avatar: '/assets/avatars/avatar.png' },
  { id: 4, type: 'group', name: 'توسعه‌دهندگان وب', lastMessage: 'سورس کد آپلود شد', timestamp: '10:15', unreadCount: 0, avatar: '/assets/avatars/avatar.png' },
  { id: 5, type: 'channel', name: 'کانال اخبار تکنولوژی', lastMessage: 'نسخه جدید React منتشر شد', timestamp: '09:00', unreadCount: 3, avatar: '/assets/avatars/avatar.png' },
  { id: 6, type: 'channel', name: 'زنگ تفریح', lastMessage: 'جوک روز 😂', timestamp: '08:20', unreadCount: 0, avatar: '/assets/avatars/avatar.png' },
  { id: 7, type: 'bot', name: 'ترجمه‌یار', lastMessage: 'ترجمه: Hello → سلام', timestamp: '07:00', unreadCount: 1, avatar: '/assets/avatars/avatar.png' },
  { id: 8, type: 'bot', name: 'هواشناسی', lastMessage: 'امروز: آفتابی ☀️', timestamp: '06:30', unreadCount: 0, avatar: '/assets/avatars/avatar.png' },
];

const pageVariants: any = {
  initial: { height: 0, opacity: 0, y: '100%' },
  animate: { height: '100vh', opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.2 } },
  exit: { height: 0, opacity: 0, y: '-100%', transition: { type: 'tween', ease: 'easeInOut', duration: 0.2 } },
};

export default function ChatView() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const chat = mock.find((chat) => String(chat.id) === String(id));
  if (!chat) return <Typography>چت پیدا نشد</Typography>;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ position: 'fixed', left: 0, right: 0, bottom: 0, backgroundColor: 'background.default', zIndex: 9999, overflowY: 'auto' }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton onClick={() => router.back()}>
          <TbArrowLeft size={24} />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          {chat.name}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <Box component="img" src={chat.avatar} alt={chat.name} sx={{ width: 100, height: 100, borderRadius: '50%' }} />
        <Typography variant="body1">{chat.lastMessage}</Typography>
      </Box>
    </motion.div>
  );
}
