'use client';

import React, { useMemo, useState } from 'react';
import { Avatar, Box, Button, IconButton, InputBase, Typography, useTheme } from '@mui/material';

import { TbPlus, TbTrash, TbUserCircle } from 'react-icons/tb';
import { TiContacts } from 'react-icons/ti';

import AnimatedMotion from '@/components/AnimatedMotion';

import CustomDialog from '@/components/custom/CustomDialog';
import CustomSnackbar from '@/components/custom/CustomSnackbar';

import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import axiosInstance from '@/utils/hooks/axiosInstance';
import { useAuth } from '@/utils/contexts/AuthContext';
import useGet from '@/utils/hooks/API/useGet';
import { getToken } from '@/utils/functions/auth/service';

// Header Section
const HeaderSection = ({ isSettingOpen, setIsSettingOpen }: any) => {
  const theme = useTheme();
  const { user, refetch } = useAuth();

  const { data: status } = useGet(`/api/direct/check-status/${user?.user_id}`);
  const isUserOnline = useMemo(() => status || 'offline', []);

  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState<any>('success');

  const [noteInput, setNoteInput] = useState('');

  // Handle opening modal in different modes
  const handleOpenModal = (mode: 'add' | 'edit') => {
    setModalMode(mode);
    setNoteInput(mode === 'edit' ? user?.user_status || '' : '');
    setOpenNoteModal(true);
  };

  const handleRemoveNote = async () => {
    try {
      const token = getToken();
      await axiosInstance.delete(`/api/user-note/${user.user_id}/remove`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenNoteModal(false);
      showFeedback('وضعیت با موفقیت حذف شد', 'success');
      refetch();
    } catch (error) {
      showFeedback('خطا در ارتباط با سرور', 'error');
    }
  };

  const handleSaveNote = async () => {
    try {
      const token = getToken();
      const endpoint = `/api/user-note/${user.user_id}/add`;

      await axiosInstance.post(endpoint, { note: noteInput }, { headers: { Authorization: `Bearer ${token}` } });

      setOpenNoteModal(false);
      showFeedback(`وضعیت با موفقیت ${modalMode === 'add' ? 'اضافه' : 'ویرایش'} شد`, 'success');
      refetch();
    } catch (error) {
      showFeedback(error.response?.data?.message || 'خطا در ارتباط با سرور', 'error');
    }
  };

  const showFeedback = (message: string, variant: 'success' | 'error') => {
    setSnackbarMsg(message);
    setSnackbarVariant(variant);
    setShowSnackbar(true);
  };

  const checkStatus = isUserOnline ? 'secondary.main' : 'text.disabled';

  return (
    <>
      <Box sx={styles.header_container}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <Box sx={{ border: '1px solid', borderColor: checkStatus, borderRadius: '50%', overflow: 'hidden' }}>
            <Avatar src={user?.profile_picture} alt={`${user?.username}.png`} sx={{ width: '65px', height: '65px' }} />
          </Box>
          <Box display="flex" flexDirection="column" position={'relative'}>
            {user?.user_status?.length > 0 ? (
              <>
                <Box sx={styles.note_container}>
                  <Typography color="text.primary" fontWeight={600} variant="body1">
                    {user?.user_status?.length > 36 ? user?.user_status?.slice(0, 35) + '...' : user?.user_status}
                  </Typography>
                </Box>
                <Box sx={styles.status_container} onClick={() => handleOpenModal('edit')}>
                  <Typography color="primary.main" fontWeight={600} variant="body2">
                    ویرایش وضعیت
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={styles.status_container} onClick={() => handleOpenModal('add')}>
                <Typography color="primary.main" fontWeight={600} variant="body2">
                  افزودن وضعیت +
                </Typography>
              </Box>
            )}
            <Typography color="text.primary" variant="h5" fontWeight={900}>
              {user?.username}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }} onClick={() => setIsSettingOpen(!isSettingOpen)}>
            <TbUserCircle size={34} />
          </IconButton>
        </Box>
      </Box>

      {/* Unified Note Modal */}
      {openNoteModal && (
        <CustomDialog open={openNoteModal} onClose={() => setOpenNoteModal(false)} maxWidth={'sm'} title={modalMode === 'add' ? 'افزودن وضعیت' : 'ویرایش وضعیت'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'background.paper', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', p: '8px 12px', border: '1px solid', borderColor: 'divider', transition: 'all 0.2s ease', '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' } }}>
            <InputBase fullWidth placeholder="وضعیت خود را وارد کنید" value={noteInput} onChange={({ target }) => setNoteInput(target.value)} sx={{ fontSize: 16 }} />
            {modalMode === 'edit' && (
              <IconButton onClick={handleRemoveNote}>
                <TbTrash size={22} color={theme.palette.error.main} />
              </IconButton>
            )}
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Button fullWidth variant="outlined" style={{ borderRadius: '8px' }} onClick={() => setOpenNoteModal(false)}>
              بستن
            </Button>
            <Button fullWidth variant="contained" style={{ borderRadius: '8px' }} onClick={handleSaveNote} disabled={!noteInput.trim()}>
              {modalMode === 'add' ? 'افزودن' : 'ذخیره'}
            </Button>
          </Box>
        </CustomDialog>
      )}

      {/* Snackbar remains the same */}
      {showSnackbar && (
        <CustomSnackbar open={showSnackbar} onClose={() => setShowSnackbar(false)} variant={snackbarVariant}>
          <span>{snackbarMsg}</span>
        </CustomSnackbar>
      )}
    </>
  );
};

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

const styles = {
  header_container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px dashed',
    borderRadius: '12px',
    p: 2,
    borderColor: 'primary.main',
  },
  note_container: {
    position: 'absolute',
    top: -43,
    right: -80,
    p: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'background.paper',
  },
  status_container: {
    width: 'fit-content',
    transition: 'all 0.2s ease-in-out',
    p: 0.2,
    borderRadius: '8px',
    cursor: 'pointer',
    '&:hover': { backgroundColor: 'background.paper', mb: 0.5 },
  },
};
