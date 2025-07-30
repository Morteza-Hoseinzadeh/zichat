'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material';

import { motion, AnimatePresence } from 'framer-motion';

import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

import { TbSearch, TbTrash, TbX, TbArrowRight, TbDots, TbEdit, TbMicrophone, TbPlus, TbSend2, TbSticker, TbCopy, TbArrowForward } from 'react-icons/tb';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoPersonSharp } from 'react-icons/io5';
import { MdNotificationsOff, MdReply } from 'react-icons/md';
import { TbPhoto, TbMapPin, TbChartBar, TbAddressBook, TbFile } from 'react-icons/tb';

import CustomSnackbar from '@/components/custom/CustomSnackbar';

const mock = [
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
    messages: [...Array(10)].map((_, i) => ({
      id: `msg-${i + 1}`,
      message: i % 2 === 0 ? 'سلام قربونت تو چطوری' : 'سلام، حالت چطوره؟',
      timestamp: '14:28',
      self: i % 2 === 0,
      read_by_receiver: true,
      message_edited: i % 3 === 0,
    })),
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const status = { label: 'آنلاین', color: 'secondary.main' };

  return (
    <Box sx={styles.header}>
      <Box display="flex" alignItems="center" gap={1} sx={{ img: { border: '1px solid', borderColor: status.color, borderRadius: '50%' } }}>
        <IconButton onClick={onClose}>
          <TbArrowRight />
        </IconButton>
        <img src="/assets/avatars/avatar.jpg" alt="avatar" width={65} height={65} />
        <Box>
          <Typography variant="h6" fontWeight={900} color="text.primary">
            محمد رفعتی
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ backgroundColor: status.color, width: 12, height: 12, borderRadius: '50%' }} />
            <Typography variant="body1" color="text.disabled">
              {status.label}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        <Box sx={{ transform: 'rotate(90deg)' }}>
          <IconButton onClick={handleMenuClick}>
            <TbDots />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleClose()}>
            <IoPersonSharp />
            اطلاعات مخاطب
          </MenuItem>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleClose()}>
            <MdNotificationsOff />
            بی‌صدا کردن
          </MenuItem>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleClose()}>
            <TbSearch />
            جستجو در گفتگو
          </MenuItem>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleClose()}>
            <TbTrash />
            پاک کردن گفتگو
          </MenuItem>
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            onClick={() => {
              handleClose();
              onClose();
            }}
          >
            <TbX />
            بستن گفتگو
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

function Keyboard() {
  const theme = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    setShowButton(input.trim() !== '');
  }, [input]);

  useEffect(() => {
    if (textareaRef.current) {
      const ref = textareaRef.current;
      ref.style.height = 'auto';
      ref.style.height = `${ref.scrollHeight}px`;
      ref.style.overflowY = input.length > 1 ? 'auto' : 'hidden';
    }
  }, [input]);

  const menuItems = [
    { label: 'گالری', icon: <TbPhoto size={20} />, function: () => console.log('TbPhoto') },
    { label: 'موقعیت مکانی', icon: <TbMapPin size={20} />, function: () => console.log('TbMapPin') },
    { label: 'نظرسنجی', icon: <TbChartBar size={20} />, function: () => console.log('TbChartBar') },
    { label: 'مخاطب', icon: <TbAddressBook size={20} />, function: () => console.log('TbAddressBook') },
    { label: 'فایل', icon: <TbFile size={20} />, function: () => console.log('TbFile') },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: 'relative', ...styles.input_container }}>
      <Box>
        <IconButton sx={{ mr: '8px' }}>{showButton ? <TbSend2 color={theme.palette.text.primary} size={24} /> : <TbMicrophone color={theme.palette.text.primary} size={24} />}</IconButton>
      </Box>

      <Box position="relative" width="100%" mt={1}>
        <textarea ref={textareaRef} rows={1} placeholder="پیام خود را بنویسید" style={styles.textInput} value={input} onChange={({ target }) => setInput(target.value)} />
        <Box position="absolute" top={0.5} left={7}>
          <IconButton>
            <TbSticker size={27} color={theme.palette.text.primary} />
          </IconButton>
        </Box>
      </Box>

      <Box>
        <IconButton sx={{ mx: 1 }} onClick={handleMenuOpen}>
          <TbPlus size={24} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 140, boxShadow: '0px 6px 16px rgba(0,0,0,0.15)' },
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                handleMenuClose();
                item.function();
              }}
              sx={{ display: 'flex', gap: 1 }}
            >
              {item.icon}
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
}

function ChatsSection() {
  const theme = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  const [showSnackbar, setShowSnackbar] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleCopyMessage = (msg: any) => {
    handleMenuClose();
    navigator.clipboard.writeText(msg.message);
    setShowSnackbar(true);
  };

  const fontSize = 17;

  return mock.map((chat, index) => (
    <Box key={index} flex={1} display="flex" flexDirection="column" mt={1} mx="16px" sx={{ fontSize }}>
      <p style={{ textAlign: 'center', color: theme.palette.text.disabled }}>{ConvertToPersianDigit(chat.date)}</p>
      {chat.messages.map((msg, i) => {
        const isSelf = msg.self;
        const isHovered = hovered === msg.id;
        const color = isSelf ? theme.palette.primary.dark : theme.palette.secondary.dark;

        return (
          <Box key={i} width="100%" sx={{ display: 'flex', justifyContent: isSelf ? 'right' : 'left', mb: 3 }}>
            <Box display="flex" alignItems="center" flexDirection={isSelf ? 'row' : 'row-reverse'} gap={1} onMouseEnter={() => setHovered(msg.id)} onMouseLeave={() => setHovered(null)}>
              <Box sx={{ ...styles.chat_bubbles, backgroundColor: color, borderBottomLeftRadius: isSelf ? '24px' : '0', borderBottomRightRadius: isSelf ? '0' : '24px' }}>
                <p style={{ color: theme.palette.text.primary }}>{msg.message}</p>
                <Box mt={0.5} display="flex" alignItems="center" justifyContent="space-between" flexDirection={isSelf ? 'row' : 'row-reverse'} mx={0.5}>
                  <p style={{ color: theme.palette.text.disabled }}>{ConvertToPersianDigit(msg.timestamp)}</p>
                  {isSelf && <RiCheckDoubleLine color={msg.read_by_receiver ? '#0041c2' : theme.palette.text.disabled} />}
                </Box>
                {msg.message_edited && (
                  <Box display="flex" alignItems="center" justifyContent={isSelf ? 'left' : 'right'} color={theme.palette.text.disabled} fontSize={fontSize - 4} gap={0.5}>
                    <span>ویرایش شده</span>
                    <TbEdit />
                  </Box>
                )}
              </Box>
              {isHovered && (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <IconButton onClick={(e) => handleMenuClick(e, msg.id)}>
                    <RxHamburgerMenu size={26} />
                  </IconButton>
                  <IconButton>
                    <TbEdit size={26} />
                  </IconButton>
                </Box>
              )}
              <Menu anchorEl={menuAnchorEl} open={openMenuId === msg.id} onClose={handleMenuClose}>
                <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleMenuClose()}>
                  <MdReply />
                  پاسخ
                </MenuItem>
                <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleCopyMessage(chat.messages)}>
                  <TbCopy />
                  کپی
                </MenuItem>
                <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleMenuClose()}>
                  <TbEdit />
                  ویرایش
                </MenuItem>
                <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleMenuClose()}>
                  <TbTrash />
                  حذف
                </MenuItem>
                <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => handleMenuClose()}>
                  <TbArrowForward />
                  فوروارد
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        );
      })}
      {showSnackbar && (
        <CustomSnackbar open={showSnackbar} onClose={() => setShowSnackbar(false)} variant="success">
          <span>پیام کپی شد!</span>
        </CustomSnackbar>
      )}
    </Box>
  ));
}

export default function ChatView() {
  const { id } = useParams();
  const router = useRouter();
  const [show, setShow] = useState(true);

  const chat = mock.find((c) => String(c.id) === String(id));
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
    backgroundImage: 'url("/assets/overlays/chat-background-overlay.png")',
    backgroundRepeat: 'repeat',
    backgroundAttachment: 'fixed',
    flex: 1,
    minHeight: '100%',
  },
  header: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    backdropFilter: 'blur(8.7px)',
  },
  input_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    width: '100%',
    backgroundColor: 'background.paper',
    position: 'sticky',
    bottom: 0,
    py: 2,
    borderRadius: '24px 24px 0px 0px',
    textarea: {
      transition: 'height 0.2s ease',
      height: '2500px',
      color: 'text.primary',
      backgroundColor: 'background.default',
      '&:focus': {
        border: 'none',
        outline: 'none',
      },
    },
  },
  textInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '12px',
    resize: 'none',
    overflow: 'hidden',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    lineHeight: '24px',
    transition: 'height 0.2s ease',
  },
  chat_bubbles: {
    p: 2,
    width: 'fit-content',
    borderRadius: '24px',
  },
};
