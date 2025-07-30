import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { IoClose } from 'react-icons/io5';

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  title?: any;
}

export default function CustomDialog({ open, onClose, children, maxWidth = 'sm', fullWidth = true, title }: CustomDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} sx={style.dialog_background}>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <DialogTitle sx={{ m: 0, px: 2, display: 'flex', justifyContent: 'left' }}>
          {onClose && (
            <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={title ? 'space-between' : 'left'}>
              <Typography variant="h5" fontWeight={700}>
                {title}
              </Typography>
              <IconButton aria-label="close" onClick={onClose}>
                <IoClose size={26} />
              </IconButton>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
      </Box>
    </Dialog>
  );
}

const style = {
  dialog_background: {
    background: 'rgba(255, 255, 255, 0.0)',
    backdropFilter: 'blur(4px)',
    '& .MuiPaper-root': {
      borderRadius: '24px',
    },
  },
};
