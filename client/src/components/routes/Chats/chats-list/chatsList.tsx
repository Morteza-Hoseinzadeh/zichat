'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, Tabs, Tab, Button } from '@mui/material';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import { TbBroadcast, TbRobot, TbUser, TbUsers } from 'react-icons/tb';
import { motion } from 'framer-motion';

const mock = [
  { id: 1, type: 'user', name: ' حسین زاده', lastMessage: 'سلام، حالت چطوره؟', timestamp: '14:23', unreadCount: 2, avatar: '/assets/avatars/avatar.jpg' },
  { id: 3, type: 'group', name: 'تیم طراحی', lastMessage: 'جلسه بعدی کیه؟', timestamp: '11:30', unreadCount: 5, avatar: '/assets/avatars/avatar.jpg' },
  { id: 4, type: 'group', name: 'توسعه‌دهندگان وب', lastMessage: 'سورس کد آپلود شد', timestamp: '10:15', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
  { id: 100, type: 'group', name: 'توسعه‌دهندگان وب', lastMessage: 'سورس کد آپلود شد', timestamp: '10:15', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
  { id: 5, type: 'channel', name: 'کانال اخبار تکنولوژی', lastMessage: 'نسخه جدید React منتشر شد', timestamp: '09:00', unreadCount: 3, avatar: '/assets/avatars/avatar.jpg' },
  { id: 6, type: 'channel', name: 'زنگ تفریح', lastMessage: 'جوک روز 😂', timestamp: '08:20', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
  { id: 7, type: 'bot', name: 'ترجمه‌یار', lastMessage: 'ترجمه: Hello → سلام', timestamp: '07:00', unreadCount: 1, avatar: '/assets/avatars/avatar.jpg' },
  { id: 8, type: 'bot', name: 'هواشناسی', lastMessage: 'امروز: آفتابی ☀️', timestamp: '06:30', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
  { id: 80, type: 'bot', name: 'هواشناسی', lastMessage: 'امروز: آفتابی ☀️', timestamp: '06:30', unreadCount: 0, avatar: '/assets/avatars/avatar.jpg' },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const tabTypes = ['user', 'group', 'channel', 'bot'];

const ZichatNewsPinned = ({ handleGetChatData }: { handleGetChatData: (chat_id: string | number) => void }) => (
  <Box onClick={() => handleGetChatData('xyz-abcd-efg')} sx={{ ...styles.chats_container, p: 2, mb: 1, border: '2px dashed', borderColor: 'secondary.main', borderRadius: '12px' }}>
    <Box width={'100%'} display="flex" alignItems="center" gap={2}>
      <Box component="img" src="/assets/logo/zichat-logo.png" alt="Zichat News" sx={{ width: 50, height: 50 }} />

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
  const router = useRouter();

  const handleGetChatData = (chat_id: string | number) => {
    router.push(`/direct/pv/${chat_id}`);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <Box my={6}>
      <Box display={'flex'} alignItems="center" justifyContent={'space-between'} mb={2}>
        <Typography variant="h4" color="text.primary" fontWeight={100}>
          📁 لیست چت ها
        </Typography>
        <Button variant="text" sx={{ fontSize: 18, color: 'pirmary.main' }}>
          نمایش
        </Button>
      </Box>
      <Box sx={{ backgroundColor: 'background.paper', borderRadius: '12px', textAlign: 'center', width: '100%' }}>
        <Box sx={{ width: '100%', mb: 2 }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth" centered textColor="primary" indicatorColor="primary">
            <Tab sx={{ mt: 1, fontSize: 17, gap: 1, fontWeight: 700 }} {...a11yProps(0)} icon={<TbUser size={25} />} iconPosition="top" />
            <Tab sx={{ mt: 1, fontSize: 17, gap: 1, fontWeight: 700 }} {...a11yProps(1)} icon={<TbUsers size={25} />} iconPosition="top" />
            <Tab sx={{ mt: 1, fontSize: 17, gap: 1, fontWeight: 700 }} {...a11yProps(2)} icon={<TbBroadcast size={25} />} iconPosition="top" />
            <Tab sx={{ mt: 1, fontSize: 17, gap: 1, fontWeight: 700 }} {...a11yProps(3)} icon={<TbRobot size={25} />} iconPosition="top" />
          </Tabs>
        </Box>

        {[0, 1, 2, 3].map((tabIndex) => (
          <CustomTabPanel key={tabIndex} value={value} index={tabIndex}>
            <motion.div variants={itemVariants}>
              <ZichatNewsPinned handleGetChatData={handleGetChatData} />
              {mock
                .filter((chat) => chat.type === tabTypes[tabIndex])
                .map((chat, index) => (
                  <Box key={chat.id} sx={{ ...styles.chats_container, borderRadius: index === mock.length - 1 ? '0 0 12px 12px' : '0', p: 2, my: 1 }}>
                    <Box width={'100%'} display="flex" alignItems="center" gap={2} onClick={() => handleGetChatData(chat.id)}>
                      <Box component="img" src={chat.avatar} alt={chat.name} sx={{ width: 60, height: 60, borderRadius: '50%', border: '1px solid', borderColor: 'secondary.main' }} />
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
            </motion.div>
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
