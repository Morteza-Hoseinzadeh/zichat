'use client';

import React, { useState } from 'react';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { TbMessage, TbPhone, TbPlus, TbUserCircle } from 'react-icons/tb';
import { TiContacts } from 'react-icons/ti';
import AnimatedMotion from '@/components/AnimatedMotion';
import CustomDialog from '@/components/custom/CustomDialog';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import CustomSnackbar from '@/components/custom/CustomSnackbar';
import axiosInstance from '@/utils/hooks/axiosInstance';

// Header Section
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

// Contacts Section
const ContactsSection = ({ getContactData, setContactModal }: any) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
      <Box onClick={getContactData} width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ border: '2px dashed', borderRadius: '12px', p: 2, borderColor: 'primary.main', cursor: 'pointer' }}>
        <Typography color="text.primary" variant="h5" fontWeight={900}>
          مخاطبین
        </Typography>
        <IconButton sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}>
          <TiContacts size={34} />
        </IconButton>
      </Box>

      <Box onClick={() => setContactModal((prev: any) => ({ ...prev, open_add_contacts_modal: true }))} width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ border: '2px dashed', borderRadius: '12px', p: 2, borderColor: 'primary.main', cursor: 'pointer' }}>
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

// Main Component
export default function UserInfoHeader() {
  const [contacts, setContacts] = React.useState([]);

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [contactModal, setContactModal] = React.useState({
    open_contacts_list_modal: false,
    open_add_contacts_modal: false,
  });

  const handleClose = (key: string) => {
    setContactModal((prev) => ({ ...prev, [key]: false }));
  };

  async function handleAddContact(contacts) {
    try {
      const { name, tel, icon } = contacts;
      await axiosInstance({
        method: 'POST',
        data: JSON.stringify({ name, tel, icon }),
      });
    } catch (error) {}
  }

  async function getContactData() {
    if ('contacts' in navigator && typeof (navigator as any).contacts?.select === 'function') {
      const contactsApi = (navigator as any).contacts;
      contactsApi
        .select(['name', 'tel', 'icon'], { multiple: true })
        .then((contacts) => {
          setContactModal((prev) => ({ ...prev, open_contacts_list_modal: true }));
        })
        .catch(console.error);
    } else {
      setShowSnackbar(true);
      setSnackbarMsg('Contact Picker API is not supported on this browser.');
    }
  }

  return (
    <>
      <Box mb={4} mt={2} display="flex" justifyContent="center" flexDirection="column" gap={2}>
        <HeaderSection isSettingOpen={isProfileOpen} setIsSettingOpen={setIsProfileOpen} />
        <ContactsSection setContactModal={setContactModal} getContactData={getContactData} />
      </Box>

      {/* Contacts Modal */}
      {contactModal.open_contacts_list_modal && (
        <CustomDialog open={contactModal.open_contacts_list_modal} onClose={() => handleClose('open_contacts_list_modal')} maxWidth="md" title="لیست مخاطبین">
          <AnimatedMotion>
            <Box width="100%" display="flex" flexDirection="column" gap={2}>
              {contacts.map((contact: any, index) => (
                <Box key={index} width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ border: '2px dashed', borderRadius: '16px', p: 2, borderColor: 'primary.main' }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={contact.icon?.[0] || ''} sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography color="text.primary" variant="h6" fontWeight={900}>
                        {contact.name?.[0] || 'بدون نام'}
                      </Typography>
                      {contact.tel?.[0] && (
                        <Typography color="text.disabled" variant="body1" fontWeight={600}>
                          {ConvertToPersianDigit(contact.tel[0])}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box>
                    <Button variant="contained" sx={{ color: '#fff', borderRadius: '12px', '&:hover': { backgroundColor: 'primary.dark' } }}>
                      <Typography variant="body1">دعوت</Typography>
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </AnimatedMotion>
        </CustomDialog>
      )}
      {showSnackbar && (
        <CustomSnackbar open={showSnackbar} onClose={() => setShowSnackbar(false)} variant="info">
          <span>{snackbarMsg}</span>
        </CustomSnackbar>
      )}
    </>
  );
}
