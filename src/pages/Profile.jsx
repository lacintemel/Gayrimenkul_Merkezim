import React from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Avatar } from '@mui/material';

const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  unit: '4B',
  phone: '(555) 123-4567',
};

const Profile = () => (
  <Box sx={{ mt: 4 }}>
    <Card sx={{ maxWidth: 500, margin: '0 auto' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 64, height: 64 }}>{user.name[0]}</Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{user.name}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Typography color="text.secondary">Daire: {user.unit}</Typography>
            <Typography color="text.secondary">Telefon: {user.phone}</Typography>
          </Grid>
        </Grid>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>Bilgileri Düzenle</Button>
      </CardContent>
    </Card>
  </Box>
);

export default Profile;
