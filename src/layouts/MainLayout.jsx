import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const MainLayout = ({ children }) => (
  <>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gayrimenkul Merkezim
        </Typography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {children}
    </Container>
  </>
);

export default MainLayout;
