'use client';

import React from 'react';
import { Typography, Box, Tabs, Tab } from '@mui/material';
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const ZichatNewsPinned = () => (
  <Box sx={{ ...styles.chats_container, p: 2, my: 1 }}>
    <Box width={'100%'} display="flex" alignItems="center" gap={2}>
      <Box component="img" src="/assets/logo/zichat-logo.png" alt="Zichat News" sx={{ width: 60, height: 60, borderRadius: '50%' }} />
      <Box width={'100%'} display={'flex'} alignItems={'center'} flexDirection={'column'} justifyContent={'space-between'} pl={0.5}>
        <Box display="flex" alignItems="center" justifyContent="space-between" width={'100%'}>
          <Box display={'flex'} alignItems={'center'} gap={0.5}>
            <Typography variant="h6" color="text.primary" fontWeight={900}>
              📢 اخبار زیچت
            </Typography>
            <img src="/assets/logo/instagram-verified.png" alt="instagram-verfied.png" width={20} />
          </Box>
          <Typography variant="body2" color="text.primary">
            {ConvertToPersianDigit('09:00')}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" width={'100%'}>
          <Typography variant="body2" color="text.secondary" noWrap>
            نسخه جدید زیچت منتشر شد!
          </Typography>
          <Box mt={0.5} bgcolor="secondary.main" color="black" px={1} borderRadius="12px" fontSize="1em" display="inline-block">
            {ConvertToPersianDigit(1)}
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ChatsList() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab sx={{ fontSize: 15 }} label="افراد" {...a11yProps(0)} />
              <Tab sx={{ fontSize: 15 }} label="گروه ها" {...a11yProps(1)} />
              <Tab sx={{ fontSize: 15 }} label="کانال ها" {...a11yProps(2)} />
              <Tab sx={{ fontSize: 15 }} label="ربات ها" {...a11yProps(3)} />
            </Tabs>
          </Box>
        </Box>

        {[0, 1, 2, 3].map((tabIndex) => (
          <CustomTabPanel key={tabIndex} value={value} index={tabIndex}>
            <>
              <ZichatNewsPinned />
              {mock.map((chat, index) => (
                <Box key={chat.id} sx={{ ...styles.chats_container, borderRadius: index === mock.length - 1 ? '0 0 12px 12px' : '0', p: 2, my: 1 }}>
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
                        <Typography variant="body1" color="text.secondary" noWrap>
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
            </>
          </CustomTabPanel>
        ))}
      </Box>
    </Box>
  );
}

const styles = {
  chats_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' },
  },
};
