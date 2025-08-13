import { Box, Typography, Button, TextField, CircularProgress, Avatar, Grid2 } from '@mui/material';
import { useRef, useState } from 'react';
import { TbEdit, TbPhone, TbUser } from 'react-icons/tb';
import { useTheme } from '@mui/material/styles';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import CustomDialog from '@/components/custom/CustomDialog';
import { AnimatePresence, motion } from 'framer-motion';
import { avatars } from '@/utils/data/data';

export default function TabConfirm({ form, setForm, isUserExist, handleBack }) {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
        setForm({ ...form, profile_picture: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSelectAvatarsFrame = (item) => {
    setProfilePic(null);
    setForm({ ...form, profile_picture: item.src });
    setOpenModal(false);
  };

  if (isUserExist?.exists) {
    return (
      <Box sx={{ mb: 4, textAlign: 'center', p: 3, backgroundColor: 'background.paper', borderRadius: theme.shape.borderRadius * 2, boxShadow: theme.shadows[2], maxWidth: 400, mx: 'auto' }}>
        <Typography color="text.primary" variant="h6" sx={{ mb: 1, fontWeight: theme.typography.fontWeightMedium }}>
          {isUserExist.user.username}
        </Typography>

        <Box color={'text.primary'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', gap: 1, mb: 3, backgroundColor: theme.palette.action.hover, p: '8px 16px', borderRadius: theme.shape.borderRadius, width: 'fit-content', mx: 'auto' }}>
          <TbPhone />
          <Typography>{ConvertToPersianDigit(isUserExist.user.phone.replace('+98', '0'))}</Typography>
        </Box>

        <Typography sx={{ mb: 3, color: 'text.secondary' }}>آیا می‌خواهید با این حساب وارد شوید؟</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" color="secondary" onClick={handleBack} sx={{ py: 1.5, borderRadius: theme.shape.borderRadius * 3, borderWidth: '2px', '&:hover': { borderWidth: '2px' } }}>
            تغییر شماره
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4, p: 3, backgroundColor: 'background.paper', borderRadius: theme.shape.borderRadius * 2, boxShadow: theme.shadows[2], maxWidth: 400, mx: 'auto' }}>
        {/* Profile Picture Upload */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Avatar src={profilePic || form?.profile_picture} sx={{ width: 100, height: 100, border: '3px solid', borderColor: 'divider', bgcolor: 'action.hover', cursor: 'pointer', transition: theme.transitions.create(['border-color']), '&:hover': { borderColor: 'primary.light' } }} onClick={triggerFileInput}>
              <TbUser size={48} color={theme.palette.text.secondary} />
            </Avatar>
            <Box>
              <Button variant="text" color="primary" onClick={triggerFileInput} endIcon={<TbEdit style={{ marginRight: '8px' }} size={16} />} sx={{ mt: 1, fontSize: '0.75rem', fontWeight: theme.typography.fontWeightBold }}>
                آپلود تصویر
              </Button>
              <Button variant="text" color="primary" onClick={() => setOpenModal(true)} sx={{ mt: 1, fontSize: '0.75rem', fontWeight: theme.typography.fontWeightBold }}>
                انتخاب آواتار
              </Button>
            </Box>
          </Box>
        </Box>
        {/* Phone Number (readonly) */}
        <Box sx={{ color: 'text.primary', mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: theme.typography.fontWeightMedium }}>
            شماره تلفن
          </Typography>
          <Box sx={{ p: '14px', border: '2px solid', borderColor: 'divider', borderRadius: theme.shape.borderRadius * 3, backgroundColor: 'action.hover', transition: theme.transitions.create(['border-color']), '&:hover': { borderColor: 'text.secondary' } }}>
            <Typography sx={{ fontWeight: theme.typography.fontWeightMedium }}>{ConvertToPersianDigit('0' + form.phone)}</Typography>
          </Box>
        </Box>
        {/* Username Input */}
        <Box sx={{ color: 'text.primary', mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: theme.typography.fontWeightMedium }}>
            نام کاربری
          </Typography>
          <TextField fullWidth placeholder="نام خود را وارد کنید" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: theme.shape.borderRadius * 3, '& fieldset': { borderColor: 'divider', borderWidth: '2px' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' } } }} />
        </Box>
      </Box>

      {openModal && (
        <CustomDialog open={openModal} onClose={() => setOpenModal(false)} maxWidth={'md'} title={'انتخاب آواتار'}>
          <Grid2 container spacing={4}>
            {avatars.map((item, index) => {
              return (
                <Grid2 key={index} sx={styles.images_container} size={{ xs: 6, sm: 4, md: 3 }}>
                  <AnimatePresence mode="wait">
                    <motion.div style={{ width: 125 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <img src={item.src} alt={`${item.gender}-avatar.png`} onClick={() => handleSelectAvatarsFrame(item)} />
                    </motion.div>
                  </AnimatePresence>
                </Grid2>
              );
            })}
          </Grid2>
        </CustomDialog>
      )}
    </>
  );
}

const styles = {
  images_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};
