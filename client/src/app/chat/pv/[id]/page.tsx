'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useAuth } from '@/utils/contexts/AuthContext';
import axiosInstance from '@/utils/hooks/axiosInstance';
import io from 'socket.io-client';

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

function Header({ onClose, privateRoomPvData, onlineStatus, isTyping }: any) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const room_info = privateRoomPvData?.data?.room_info;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Get status from onlineStatus or fallback to room_info
  const userStatus = onlineStatus[room_info?.other_user?.user_id] || { status: room_info?.other_user?.status || 'offline' };

  const statusConfig = {
    online: { label: 'آنلاین', color: 'secondary.main' },
    offline: { label: 'آفلاین', color: 'text.disabled' },
    typing: { label: 'در حال تایپ...', color: 'primary.main' },
  };

  const currentStatus = isTyping ? 'typing' : userStatus.status;
  const status = statusConfig[currentStatus] || statusConfig.offline;

  return (
    <Box sx={styles.header}>
      <Box display="flex" alignItems="center" gap={1} sx={{ img: { border: '1px solid', borderColor: status.color, borderRadius: '50%' } }}>
        <IconButton onClick={onClose}>
          <TbArrowRight />
        </IconButton>
        <img src={room_info?.other_user?.profile_picture} alt={room_info?.other_user?.username} width={65} height={65} />
        <Box>
          <Typography variant="h6" fontWeight={900} color="text.primary">
            {room_info?.other_user?.username}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ backgroundColor: status.color, width: 12, height: 12, borderRadius: '50%' }} />
            <Typography variant="body1" color={status.color}>
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
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleClose}>
            <IoPersonSharp />
            اطلاعات مخاطب
          </MenuItem>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleClose}>
            <MdNotificationsOff />
            بی‌صدا کردن
          </MenuItem>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleClose}>
            <TbSearch />
            جستجو در گفتگو
          </MenuItem>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleClose}>
            <TbTrash />
            پاک کردن گفتگو
          </MenuItem>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={onClose}>
            <TbX />
            بستن گفتگو
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

function Keyboard({ onSendMessage, roomId, onTypingChange }: { onSendMessage: (message: string) => void; roomId: string; onTypingChange: (typing: boolean) => void }) {
  const theme = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const typingTimeoutRef = useRef(null);

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

  // Handle typing indicators
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    // Send typing start/stop events
    if (value.trim() !== '' && onTypingChange) {
      onTypingChange(true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        if (onTypingChange) {
          onTypingChange(false);
        }
      }, 1000);
    } else if (onTypingChange) {
      onTypingChange(false);
    }
  };

  const handleSend = () => {
    if (input.trim() !== '') {
      onSendMessage(input.trim());
      setInput('');

      // Stop typing indicator when sending
      if (onTypingChange) {
        onTypingChange(false);
      }

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

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
        <IconButton sx={{ mr: '8px' }} onClick={showButton ? handleSend : undefined}>
          {showButton ? <TbSend2 color={theme.palette.text.primary} size={24} /> : <TbMicrophone color={theme.palette.text.primary} size={24} />}
        </IconButton>
      </Box>

      <Box position="relative" width="100%" mt={1}>
        <textarea ref={textareaRef} rows={1} placeholder="پیام خود را بنویسید" style={styles.textInput} value={input} onChange={handleInputChange} onKeyPress={handleKeyPress} />
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

        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'bottom', horizontal: 'right' }} PaperProps={{ sx: { borderRadius: 2, minWidth: 140, boxShadow: '0px 6px 16px rgba(0,0,0,0.15)' } }}>
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

function ChatsSection({ privateRoomPvData, onMessageRead, lastChatRef, isTyping }) {
  const { user } = useAuth();
  const theme = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Mark messages as read when they come into view
  useEffect(() => {
    if (privateRoomPvData?.data?.messages) {
      privateRoomPvData?.data?.messages.forEach((msg) => {
        if (!msg.is_read && msg.sender_id !== user?.user_id) {
          onMessageRead(msg.message_id, privateRoomPvData.data.room_info.room_id);
        }
      });
    }
  }, [privateRoomPvData, user?.user_id, onMessageRead]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleCopyMessage = () => {
    const message = privateRoomPvData.data.messages.find((m) => m.message_id === openMenuId);
    if (message) {
      navigator.clipboard.writeText(message.content);
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }
    handleMenuClose();
  };

  const fontSize = 17;

  // Group messages by date
  const groupedMessages = useMemo(() => {
    if (!privateRoomPvData?.data?.messages) return {};

    return privateRoomPvData.data.messages.reduce((groups, message) => {
      const date = new Date(message.created_at).toLocaleDateString('fa-IR');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }, [privateRoomPvData]);

  if (!privateRoomPvData?.data?.messages?.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Typography variant="h6" color="text.secondary">
          هیچ پیامی وجود ندارد
        </Typography>
      </Box>
    );
  }

  return (
    <Box mx={1}>
      {Object.entries(groupedMessages).map(([date, messages]: any) => (
        <React.Fragment key={date}>
          <Box display="flex" justifyContent="center" my={2}>
            <Typography variant="body2" color="text.disabled" sx={{ backgroundColor: 'background.paper', px: 2, py: 0.5, borderRadius: 2 }}>
              {ConvertToPersianDigit(date)}
            </Typography>
          </Box>

          {messages?.map((msg, index) => {
            const isSelf = msg.sender_id === user?.user_id;
            const isHovered = hovered === msg.message_id;
            const color = isSelf ? theme.palette.primary.dark : theme.palette.secondary.dark;
            const isLastMessage = index === messages.length - 1;

            const getReadStatus = () => {
              if (isSelf) {
                return msg.message_status === 'read' ? theme.palette.secondary.main : theme.palette.text.disabled;
              }
              return theme.palette.text.disabled;
            };

            return (
              <Box key={msg.message_id || index} ref={isLastMessage ? lastChatRef : null} width="100%" overflow={'auto'} sx={{ display: 'flex', justifyContent: isSelf ? 'flex-start' : 'flex-end', mb: 3, mt: 1 }}>
                <Box display="flex" alignItems="center" flexDirection={isSelf ? 'row' : 'row-reverse'} gap={1} onMouseEnter={() => setHovered(msg.message_id)} onMouseLeave={() => setHovered(null)}>
                  <Box sx={{ ...styles.chat_bubbles, backgroundColor: color, borderBottomLeftRadius: isSelf ? '24px' : '4px', borderBottomRightRadius: isSelf ? '4px' : '24px' }}>
                    <Box>
                      <Typography variant="body1" sx={{ color: theme.palette.text.primary, wordBreak: 'break-word' }}>
                        {msg.content}
                      </Typography>
                    </Box>

                    <Box mt={0.5} display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                      <Typography variant="caption" color="text.disabled">
                        {ConvertToPersianDigit(new Date(msg.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }))}
                      </Typography>

                      {isSelf && <RiCheckDoubleLine color={getReadStatus()} size={16} />}
                    </Box>

                    {msg.is_edited === 1 && (
                      <Box display="flex" alignItems="center" justifyContent={isSelf ? 'flex-start' : 'flex-end'} color={theme.palette.text.disabled} fontSize={fontSize - 4} gap={0.5} mt={0.5}>
                        <span>ویرایش شده</span>
                        <TbEdit size={14} />
                      </Box>
                    )}
                  </Box>

                  {isHovered && (
                    <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                      <IconButton size="medium" onClick={(e) => handleMenuClick(e, msg.message_id)}>
                        <RxHamburgerMenu size={22} />
                      </IconButton>
                      <IconButton size="medium">
                        <TbEdit size={22} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </React.Fragment>
      ))}

      {isTyping && (
        <Box width="100%" sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, mt: 1 }}>
          <Box display="flex" alignItems="center" flexDirection="row-reverse" gap={1}>
            <Box sx={{ ...styles.chat_bubbles, backgroundColor: theme.palette.secondary.dark }}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Box sx={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                <Box sx={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: '50%', animation: 'pulse 1.5s infinite', animationDelay: '0.2s' }} />
                <Box sx={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: '50%', animation: 'pulse 1.5s infinite', animationDelay: '0.4s' }} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleMenuClose}>
          <MdReply />
          پاسخ
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleCopyMessage}>
          <TbCopy />
          کپی
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleMenuClose}>
          <TbEdit />
          ویرایش
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleMenuClose}>
          <TbTrash />
          حذف
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleMenuClose}>
          <TbArrowForward />
          فوروارد
        </MenuItem>
      </Menu>

      <CustomSnackbar open={showSnackbar} onClose={() => setShowSnackbar(false)} variant="success" autoHideDuration={2000}>
        <span>پیام کپی شد!</span>
      </CustomSnackbar>
    </Box>
  );
}

export default function ChatView() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [show, setShow] = useState(true);
  const [privateRoomPvData, setPrivateRoomPvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState<any>({});
  const [typingUsers, setTypingUsers] = useState<any>({});

  const lastChatRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef: any = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(url);

    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
      if (user?.user_id) {
        socketRef.current.emit('register_user', user.user_id);
      }
      if (id) {
        socketRef.current.emit('join_room', id);
      }
    });

    // Handle incoming messages - FIXED: Use correct event name
    socketRef.current.on('private_message', (messageData) => {
      if (messageData.room_id === id) {
        setPrivateRoomPvData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            messages: [...(prev.data?.messages || []), messageData],
          },
        }));
      }
    });

    // Handle message read receipts - FIXED: Use correct event name
    socketRef.current.on('message_read', (receiptData) => {
      if (receiptData.room_id === id) {
        setPrivateRoomPvData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            messages: prev.data.messages.map((msg) => (msg.message_id === receiptData.message_id ? { ...msg, is_read: true, read_at: receiptData.read_at } : msg)),
          },
        }));
      }
    });

    // Handle online status changes
    socketRef.current.on('user_status_changed', (statusData) => {
      setOnlineStatus((prev) => ({
        ...prev,
        [statusData.user_id]: {
          status: statusData.status,
          lastSeen: statusData.lastSeen,
        },
      }));
    });

    // Handle typing indicators
    socketRef.current.on('user_typing', (typingData) => {
      if (typingData.room_id === id) {
        setTypingUsers((prev) => ({
          ...prev,
          [typingData.room_id]: typingData.typing ? typingData.user_id : null,
        }));

        // Clear typing indicator after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        if (typingData.typing) {
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUsers((prev) => ({
              ...prev,
              [typingData.room_id]: null,
            }));
          }, 3000);
        }
      }
    });

    // Get initial online status
    socketRef.current.on('user_online_status', (statusData) => {
      setOnlineStatus((prev) => ({
        ...prev,
        [statusData.user_id]: {
          status: statusData.status,
          lastSeen: statusData.lastSeen,
        },
      }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [id, user?.user_id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (lastChatRef.current && privateRoomPvData?.data?.messages) {
      lastChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [privateRoomPvData?.data?.messages]);

  // Check online status when chat data loads
  useEffect(() => {
    if (privateRoomPvData?.data?.room_info?.other_user?.user_id && socketRef.current) {
      socketRef.current.emit('get_online_status', privateRoomPvData.data.room_info.other_user.user_id);
    }
  }, [privateRoomPvData]);

  // Handle typing indicator
  const handleTyping = (isTyping: boolean) => {
    if (socketRef.current && id && user?.user_id) {
      socketRef.current.emit('user_typing', { room_id: id, user_id: user.user_id, typing: isTyping });
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => router.push('/chat'), 150);
  };

  const handleGetChatData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/chat/private-messages/${id}`);
      setPrivateRoomPvData(response.data);
    } catch (error) {
      console.error('Error fetching chat data:', error);
      setPrivateRoomPvData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!id) return;
    try {
      await axiosInstance.post('/api/chat/private-messages', {
        roomId: id,
        content: messageContent,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMessageRead = async (messageId: string, roomId: string) => {
    try {
      if (socketRef.current && user?.user_id) {
        socketRef.current.emit('mark_message_read', {
          message_id: messageId,
          room_id: roomId,
          user_id: user.user_id,
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (id) handleGetChatData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>در حال بارگذاری...</Typography>
      </Box>
    );
  }

  if (!privateRoomPvData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>خطا در بارگذاری چت</Typography>
      </Box>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
      <AnimatePresence>
        {show && (
          <motion.div key="chatView" initial="initial" animate="animate" exit="exit" variants={pageVariants} style={styles.overlay}>
            <Header onClose={handleClose} privateRoomPvData={privateRoomPvData} onlineStatus={onlineStatus} isTyping={typingUsers[id as any] === privateRoomPvData?.data?.room_info?.other_user?.user_id} />
            <Box mb={12}>
              <ChatsSection privateRoomPvData={privateRoomPvData} onMessageRead={handleMessageRead} lastChatRef={lastChatRef} isTyping={typingUsers[id as any] === privateRoomPvData?.data?.room_info?.other_user?.user_id} />
            </Box>
            <Keyboard onSendMessage={handleSendMessage} roomId={id as string} onTypingChange={handleTyping} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
    minHeight: '100vh',
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
    position: 'fixed',
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
