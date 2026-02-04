import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Divider } from '@mui/material';

const stats = [
  { label: 'Açık Bakım Talebi', value: 2 },
  { label: 'Bekleyen Ödeme', value: '₺1.200' },
  { label: 'Yeni Mesaj', value: 3 },
  { label: 'Belgeler', value: 8 },
];

const announcements = [
  { title: 'Havuz Bakımı', date: '2 gün önce', content: '1-3 Aralık arası havuz kapalı olacak.' },
  { title: 'Yeni Otopark Kuralları', date: '1 hafta önce', content: '1 Aralık’tan itibaren tüm araçlarda otopark etiketi zorunlu.' },
];

const Home = () => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h4" fontWeight={700} mb={2}>Ana Sayfa</Typography>
    <Grid container spacing={2} mb={4}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.label}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="primary.main">{stat.value}</Typography>
              <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Card>
      <CardContent>
        <Typography variant="h6" mb={2}>Duyurular</Typography>
        {announcements.map((a, i) => (
          <Box key={a.title} mb={i < announcements.length - 1 ? 2 : 0}>
            <Typography fontWeight={600}>{a.title}</Typography>
            <Typography variant="caption" color="text.secondary">{a.date}</Typography>
            <Typography variant="body2">{a.content}</Typography>
            {i < announcements.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </CardContent>
    </Card>
  </Box>
);

export default Home;
