import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Avatar, IconButton,
  LinearProgress, Tooltip, Badge
} from '@mui/material';
import {
  TrendingUp, Notifications, Build, Payment, Description, Message,
  ArrowForward, Star, CalendarToday, Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const stats = [
  {
    label: 'Açık Bakım Talebi',
    value: 2,
    icon: Build,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    path: '/maintenance'
  },
  {
    label: 'Bekleyen Ödeme',
    value: '₺1.200',
    icon: Payment,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    path: '/payments'
  },
  {
    label: 'Yeni Mesaj',
    value: 3,
    icon: Message,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    path: '/messages'
  },
  {
    label: 'Belgeler',
    value: 8,
    icon: Description,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    path: '/documents'
  },
];

const recentActivities = [
  { id: 1, type: 'announcement', title: 'Havuz Bakımı', desc: '1-3 Aralık arası havuz kapalı', date: '2 gün önce', urgent: true },
  { id: 2, type: 'payment', title: 'Aidat Ödemesi', desc: 'Kasım ayı aidatı ödendi', date: '5 gün önce', urgent: false },
  { id: 3, type: 'maintenance', title: 'Musluk Tamiri', desc: 'Talebiniz işleme alındı', date: '1 hafta önce', urgent: false },
];

const quickActions = [
  { label: 'Ödeme Yap', icon: Payment, color: '#6366f1', path: '/payments' },
  { label: 'Bakım Talebi', icon: Build, color: '#f59e0b', path: '/maintenance' },
  { label: 'Mesaj Gönder', icon: Message, color: '#10b981', path: '/messages' },
  { label: 'Belgelerim', icon: Description, color: '#ec4899', path: '/documents' },
];

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      py: 4,
      px: { xs: 2, md: 4 },
    }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Avatar sx={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
          }}>
            <HomeIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Hoş Geldiniz, John
            </Typography>
            <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
              Daire 4B • Park Residence
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Tooltip title="Bildirimler">
              <IconButton sx={{
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                '&:hover': { background: 'rgba(99, 102, 241, 0.2)' }
              }}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card
              sx={{
                ...cardStyle,
                transform: hoveredCard === index ? 'translateY(-8px) scale(1.02)' : 'none',
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(stat.path)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" sx={{
                      fontWeight: 700,
                      color: stat.color,
                      mb: 0.5,
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Avatar sx={{
                    width: 48,
                    height: 48,
                    background: stat.gradient,
                    boxShadow: `0 8px 20px ${stat.color}40`,
                  }}>
                    <stat.icon />
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography variant="caption" sx={{ color: '#10b981' }}>
                    Son 7 gün
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
        Hızlı İşlemler
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid item xs={6} sm={3} key={action.label}>
            <Card
              sx={{
                ...cardStyle,
                textAlign: 'center',
                '&:hover': {
                  ...cardStyle['&:hover'],
                  '& .action-icon': {
                    transform: 'scale(1.1)',
                  }
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ py: 3 }}>
                <Avatar
                  className="action-icon"
                  sx={{
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                    background: `${action.color}20`,
                    color: action.color,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <action.icon />
                </Avatar>
                <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                  {action.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Son Aktiviteler
                </Typography>
                <Chip
                  label="Tümünü Gör"
                  size="small"
                  onClick={() => navigate('/announcements')}
                  sx={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(99, 102, 241, 0.3)' }
                  }}
                />
              </Box>
              {recentActivities.map((activity, index) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.1)',
                    }
                  }}
                >
                  <Avatar sx={{
                    width: 40,
                    height: 40,
                    background: activity.urgent
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : 'rgba(99, 102, 241, 0.2)',
                  }}>
                    {activity.type === 'announcement' && <Notifications sx={{ fontSize: 20 }} />}
                    {activity.type === 'payment' && <Payment sx={{ fontSize: 20 }} />}
                    {activity.type === 'maintenance' && <Build sx={{ fontSize: 20 }} />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                      {activity.desc}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                      {activity.date}
                    </Typography>
                    {activity.urgent && (
                      <Chip
                        label="Acil"
                        size="small"
                        sx={{
                          ml: 1,
                          height: 20,
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          fontSize: 10,
                        }}
                      />
                    )}
                  </Box>
                  <ArrowForward sx={{ color: 'rgba(148, 163, 184, 0.3)', fontSize: 20 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 3 }}>
                Aylık Özet
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                    Aidat Durumu
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981' }}>
                    Ödendi
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      borderRadius: 4,
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                    Bakım Talepleri
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f59e0b' }}>
                    2/3 Tamamlandı
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={66}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                      borderRadius: 4,
                    }
                  }}
                />
              </Box>

              <Box sx={{
                p: 2,
                borderRadius: 2,
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CalendarToday sx={{ fontSize: 16, color: '#818cf8' }} />
                  <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 500 }}>
                    Yaklaşan Ödeme
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  ₺850
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                  Aralık Aidatı • 15 gün kaldı
                </Typography>
              </Box>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Star sx={{ color: '#f59e0b', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                    Güvenilirlik Puanı:
                  </Typography>
                  <Typography sx={{ color: '#10b981', fontWeight: 600 }}>
                    98/100
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
