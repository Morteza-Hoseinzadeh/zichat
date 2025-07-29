'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';

// Framer motion imports
import { motion, AnimatePresence } from 'framer-motion';

// Utils
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

// Icons
import { TbBookmarks, TbDots, TbEdit } from 'react-icons/tb';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';

export const mock = [
  {
    id: 1,
    type: 'user',
    chat_type: 'PV',
    name: 'سینا شکوری',
    date: '15 فروردین 1404',
    unreadCount: 2,
    avatar: '/assets/avatars/avatar.jpg',
    last_seen: '22:14',
    status: 'offline',
    pinned_messages: ['xyz-abcde-fgh'],
    messages: [
      {
        id: 'xyz-abcde-fgi-1',
        message: 'سلام قربونت تو چطوری سلام قربونت تو چطوری ...',
        timestamp: '14:28',
        self: true,
        read_by_receiver: true,
        message_edited: true,
      },
      {
        id: 'xyz-abcde-fgh-2',
        message: 'سلام، حالت چطوره؟',
        timestamp: '14:23',
        self: false,
        read_by_receiver: true,
        message_edited: false,
      },
      {
        id: 'xyz-abcde-fgi-3',
        message: 'سلام قربونت تو چطوری',
        timestamp: '14:28',
        self: true,
        read_by_receiver: true,
        message_edited: true,
      },
      {
        id: 'xyz-abcde-fgh-4',
        message: 'سلام، حالت چطوره؟',
        timestamp: '14:23',
        self: false,
        read_by_receiver: true,
        message_edited: true,
      },
      {
        id: 'xyz-abcde-fgi-5',
        message: 'سلام قربونت تو چطوری',
        timestamp: '14:28',
        self: true,
        read_by_receiver: true,
        message_edited: false,
      },
      {
        id: 'xyz-abcde-fgh-6',
        message: 'سلام، حالت چطوره؟',
        timestamp: '14:23',
        self: false,
        read_by_receiver: true,
        message_edited: true,
      },
      {
        id: 'xyz-abcde-fgi-7',
        message: 'سلام قربونت تو چطوری',
        timestamp: '14:28',
        self: true,
        read_by_receiver: true,
        message_edited: true,
      },
      {
        id: 'xyz-abcde-fgh-8',
        message: 'سلام، حالت چطوره؟',
        timestamp: '14:23',
        self: false,
        read_by_receiver: true,
        message_edited: true,
      },
      {
        id: 'xyz-abcde-fgi-9',
        message: 'سلام قربونت تو چطوری',
        timestamp: '14:28',
        self: true,
        read_by_receiver: true,
        message_edited: true,
      },
      {
        id: 'xyz-abcde-fgh-10',
        message: 'سلام، حالت چطوره؟',
        timestamp: '14:23',
        self: false,
        read_by_receiver: true,
        message_edited: true,
      },
    ],
  },
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
    <Box sx={styles.header_container}>
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

function ChatsSection() {
  const theme = useTheme();
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  const mock_font_size = 17;

  return mock.map((item, index) => (
    <Box key={index} flex={1} display={'flex'} flexDirection={'column'} mt={1} mx={'16px'} sx={{ fontSize: mock_font_size }}>
      <p style={{ textAlign: 'center', color: theme.palette.text.disabled }}>{ConvertToPersianDigit(item.date)}</p>

      {item.messages.map((chat, subIndex) => {
        const color = chat.self ? theme.palette.primary.dark : theme.palette.secondary.dark;
        const isHovered = hoveredMessageId === chat.id;

        return (
          <Box width="100%" key={subIndex} sx={{ display: 'flex', justifyContent: chat.self ? 'right' : 'left', mb: 3 }}>
            <Box
              display="flex"
              alignItems="center"
              flexDirection={chat.self ? 'row' : 'row-reverse'}
              gap={1}
              onMouseEnter={() => setHoveredMessageId(chat.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              {/* Chat Bubble */}
              <Box
                sx={{
                  ...styles.chat_bubbles,
                  backgroundColor: color,
                  borderBottomLeftRadius: chat.self ? '24px' : '0',
                  borderBottomRightRadius: chat.self ? '0' : '24px',
                }}
              >
                <p style={{ color: theme.palette.text.primary }}>{chat.message}</p>
                <Box mt={0.5} display="flex" alignItems="center" justifyContent="space-between" flexDirection={chat.self ? 'row' : 'row-reverse'} mx={0.5}>
                  <p style={{ color: theme.palette.text.disabled }}>{ConvertToPersianDigit(chat.timestamp)}</p>
                  {chat.self && <RiCheckDoubleLine color={chat.read_by_receiver ? '#0041c2' : theme.palette.text.disabled} />}
                </Box>
                {chat.message_edited && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: chat.self ? 'left' : 'right',
                      color: theme.palette.text.disabled,
                      fontSize: mock_font_size - 4,
                      gap: 0.5,
                    }}
                  >
                    <span>ویرایش شده</span>
                    <TbEdit />
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              {isHovered && (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-around">
                  <IconButton>
                    <RxHamburgerMenu size={26} />
                  </IconButton>
                  <IconButton>
                    <TbBookmarks size={26} />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  ));
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
          <ChatsSection />
          <Keyboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles: any = {
  overlay: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'background.default',
  },
  header_container: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    background: 'rgba(255, 255, 255, 0)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(8.7px)',
  },
  header: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'background.paper',
    borderRadius: '16px',
    m: 2,
  },
  input: {
    backgroundColor: 'background.paper',
  },
  textInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '15px',
  },
  chat_bubbles: {
    p: 2,
    width: 'fit-content',
    borderRadius: '24px',
  },
};
