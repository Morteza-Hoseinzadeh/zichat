'use client';

import React from 'react';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';

// Icons
import { TbMessage, TbPhone, TbPlus, TbUserCircle } from 'react-icons/tb';
import { TiContacts } from 'react-icons/ti';
import AnimatedMotion from '@/components/AnimatedMotion';
import CustomDialog from '@/components/custom/CustomDialog';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

const HeaderSection = ({ isSettingOpen, setIsSettingOpen }: any) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ border: '2px dashed', borderRadius: '12px', p: 2, borderColor: 'primary.main' }}>
    <Box display="flex" alignItems="center" gap={1.2}>
      <Box sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: '50%', overflow: 'hidden' }}>
        <Avatar src="/assets/avatars/avatar.jpg" alt="پریسا-احمدی" sx={{ width: '65px', height: '65px' }} />
      </Box>
      <Box display="flex" flexDirection="column">
        <Box sx={{ width: 'fit-content', transition: 'all 0.2s ease-in-out', p: 0.2, borderRadius: '8px', cursor: 'pointer', '&:hover': { backgroundColor: 'background.paper' } }} mb={0.5}>
          <Typography color="primary.main" fontWeight={600} variant="body2">
            افزودن وضعیت +
          </Typography>
        </Box>
        <Typography color="text.primary" variant="h5" fontWeight={900}>
          مرتضی حسین زاده
        </Typography>
      </Box>
    </Box>
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }} onClick={() => setIsSettingOpen(!isSettingOpen)}>
        <TbUserCircle size={34} />
      </IconButton>
    </Box>
  </Box>
);

const ContactsSection = ({ contactModal, setContactModal, getContactData }: any) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
      <Box onClick={getContactData} width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ border: '2px dashed', borderRadius: '12px', p: 2, borderColor: 'primary.main' }}>
        <Typography color="text.primary" variant="h5" fontWeight={900}>
          مخاطبین
        </Typography>
        <IconButton sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}>
          <TiContacts size={34} />
        </IconButton>
      </Box>

      <Box onClick={() => setContactModal((prev: any) => ({ ...prev, open_add_contacts_modal: true }))} width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ border: '2px dashed', borderRadius: '12px', p: 2, borderColor: 'primary.main' }}>
        <Typography color="text.primary" variant="h5" fontWeight={900}>
          افزودن
        </Typography>
        <IconButton sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}>
          <TbPlus size={34} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default function UserInfoHeader() {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [contactModal, setContactModal] = React.useState({
    contacts: [],
    open_contacts_list_modal: false,
    open_add_contacts_modal: false,
  });

  const handleClose = (key: string) => {
    setContactModal((prev) => ({ ...prev, [key]: false }));
  };

  async function getContactData() {
    setContactModal((prev) => ({ ...prev, open_contacts_list_modal: true }));
    // if ('contacts' in navigator) {
    //   try {
    //     const props = ['name', 'tel'];
    //     const options = { multiple: true };

    //     const contacts = await navigator.contacts.select(props, options);

    //     if (contacts.length) {
    //       setContactModal((prev) => ({ ...prev, contacts, open_contacts_list_modal: true }));
    //     }
    //   } catch (error) {
    //     console.error('Error selecting contacts:', error);
    //   }
    // } else {
    //   alert('Contact Picker API is not supported on this browser.');
    // }
  }

  const invitation = '';

  return (
    <>
      <Box mb={4} mt={2} display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={2}>
        <HeaderSection isSettingOpen={isProfileOpen} setIsSettingOpen={setIsProfileOpen} />
        <ContactsSection contacts={contactModal} setContacts={setContactModal} getContactData={getContactData} />
      </Box>

      {contactModal.open_contacts_list_modal && (
        <CustomDialog open={contactModal.open_contacts_list_modal} onClose={() => handleClose('open_contacts_list_modal')} maxWidth={'md'} title={'لیست مخاطبین'}>
          <AnimatedMotion>
            <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} gap={2}>
              {[...Array(10)].map((_, index) => (
                <Box key={index} width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ border: '2px dashed', borderRadius: '16px', p: 2, borderColor: 'primary.main' }}>
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <Avatar sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography color="text.primary" variant="h6" fontWeight={900}>
                        آرش موسوی
                      </Typography>
                      <Typography color="text.disabled" variant="body1" fontWeight={600}>
                        {ConvertToPersianDigit('09906451808')}
                      </Typography>
                    </Box>
                  </Box>
                  {/* // TODO: check the user exists in zichat or not for sending invitation */}
                  <Box>
                    {true ? (
                      <Button variant="contained" sx={{ color: '#fff', borderRadius: '12px', '&:hover': { backgroundColor: 'primary.dark' } }}>
                        <Typography variant="body1">دعوت</Typography>
                      </Button>
                    ) : (
                      <IconButton sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}>
                        <TbMessage size={28} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </AnimatedMotion>
        </CustomDialog>
      )}
    </>
  );
}
