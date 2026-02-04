import React from 'react';
import Button from '@mui/material/Button';

const MuiButton = ({ children, ...props }) => (
  <Button variant="contained" color="primary" {...props}>
    {children}
  </Button>
);

export default MuiButton;
