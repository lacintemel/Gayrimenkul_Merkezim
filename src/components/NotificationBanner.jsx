import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const NotificationBanner = ({ message, onClose }) => (
  <Box sx={{
    background: 'linear-gradient(90deg, #10B981 60%, #3B82F6 100%)',
    color: '#fff',
    px: 2.5,
    py: 1.5,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
    boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
  }}>
    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{message}</Typography>
    <IconButton size="small" onClick={onClose} sx={{ color: '#fff' }}>
      <Close />
    </IconButton>
  </Box>
);

export default NotificationBanner;
