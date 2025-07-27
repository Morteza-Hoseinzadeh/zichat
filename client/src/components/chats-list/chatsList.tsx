'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

const mock = [
  {
    id: 1,
    name: 'سینا شکوری',
    lastMessage: 'سلام، حالت چطوره؟',
    timestamp: '14:23',
    unreadCount: 2,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 2,
    name: 'آرمان معصومی',
    lastMessage: 'فایل رو دریافت کردم ممنون',
    timestamp: '13:10',
    unreadCount: 0,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 3,
    name: 'زهره کیانی',
    lastMessage: 'بیا تماس بگیریم',
    timestamp: '12:45',
    unreadCount: 5,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 4,
    name: 'مهدی صادقی',
    lastMessage: 'اوکی پس فردا',
    timestamp: '09:30',
    unreadCount: 0,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 5,
    name: 'الهام نظری',
    lastMessage: 'جلسه ساعت چند شروع میشه؟',
    timestamp: '08:55',
    unreadCount: 1,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 6,
    name: 'رضا یزدی',
    lastMessage: 'دستت درد نکنه خیلی کمک کردی',
    timestamp: '07:20',
    unreadCount: 0,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 7,
    name: 'سارا رضایی',
    lastMessage: 'عکسارو فرستادم ببین',
    timestamp: '06:00',
    unreadCount: 3,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 8,
    name: 'امین کاوه',
    lastMessage: 'باید حضوری بیام؟',
    timestamp: '02:15',
    unreadCount: 0,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 9,
    name: 'نگار عزیزی',
    lastMessage: 'بی‌زحمت امروز تماس بگیر',
    timestamp: '01:30',
    unreadCount: 4,
    avatar: '/assets/avatars/avatar.png',
  },
  {
    id: 10,
    name: 'آرمان افشار',
    lastMessage: 'بله تایید شد 👌',
    timestamp: '00:45',
    unreadCount: 0,
    avatar: '/assets/avatars/avatar.png',
  },
];

export default function ChatsList() {
  return (
    <Box my={6}>
      <Box display={'flex'} alignItems="center" justifyContent={'space-between'} mb={2}>
        <Typography variant="h4" color="text.primary" fontWeight={100}>
          📁 لیست چت ها
        </Typography>
        <Typography variant="h6" color="text.primary" fontWeight={700}>
          مدیریت
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: 'background.paper', borderRadius: '12px', textAlign: 'center', width: '100%' }}>
        {mock.map((chat, index) => (
          <Box
            key={chat.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderRadius={index === 0 ? '12px 12px 0 0' : index === mock.length - 1 ? '0 0 12px 12px' : '0'}
            px={2}
            py={1.5}
            sx={{ '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' } }}
          >
            <Box width={'100%'} display="flex" alignItems="center" gap={2}>
              <Box component="img" src={chat.avatar} alt={chat.name} sx={{ width: 60, height: 60, borderRadius: '50%' }} />
              <Box width={'100%'} display={'flex'} alignItems={'center'} flexDirection={'column'} justifyContent={'space-between'} pl={0.5}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width={'100%'}>
                  <Typography variant="h6" color="text.primary" fontWeight={900}>
                    {chat.name}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {ConvertToPersianDigit(chat.timestamp)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" width={'100%'}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {chat.lastMessage}
                  </Typography>
                  {chat.unreadCount > 0 && (
                    <Box mt={0.5} bgcolor="secondary.main" color="black" px={1} borderRadius="12px" fontSize="1em" display="inline-block">
                      {ConvertToPersianDigit(chat.unreadCount)}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
