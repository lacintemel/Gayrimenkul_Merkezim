import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Avatar, Grid, Chip,
  IconButton, LinearProgress, TextField, Divider, Switch,
  List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import {
  Person, Email, Phone, Home, Edit, Lock, Notifications, Security,
  CameraAlt, Verified, Star, Settings, LogoutSharp, Shield
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+90 555 123 4567',
    unit: '4B',
    building: 'Park Residence',
    moveInDate: '15 Ocak 2023',
    membershipLevel: 'Premium',
    paymentScore: 98,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  };

  const settings = [
    { icon: Notifications, label: 'Bildirimler', desc: 'Push ve e-posta bildirimleri', hasSwitch: true, enabled: true },
    { icon: Lock, label: 'Şifre Değiştir', desc: 'Hesap şifrenizi güncelleyin', hasSwitch: false },
    { icon: Security, label: 'İki Faktörlü Doğrulama', desc: 'Ek güvenlik katmanı', hasSwitch: true, enabled: false },
    { icon: Shield, label: 'Gizlilik', desc: 'Veri paylaşım tercihleri', hasSwitch: false },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      py: 4,
      px: { xs: 2, md: 4 },
    }}>
      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            ...cardStyle,
            position: 'relative',
            overflow: 'visible',
          }}>
            {/* Banner */}
            <Box sx={{
              height: 120,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
              borderRadius: '12px 12px 0 0',
            }} />

            {/* Avatar */}
            <Box sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: -8,
              pb: 3,
              px: 3,
            }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid #1e293b',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    fontSize: 48,
                    fontWeight: 700,
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  {userData.name.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    width: 36,
                    height: 36,
                    '&:hover': { background: '#4f46e5' }
                  }}
                >
                  <CameraAlt sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  {userData.name}
                </Typography>
                <Verified sx={{ color: '#10b981', fontSize: 20 }} />
              </Box>

              <Chip
                icon={<Star sx={{ fontSize: 16 }} />}
                label={userData.membershipLevel}
                sx={{
                  mt: 1,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />

              <Box sx={{
                width: '100%',
                mt: 3,
                p: 2,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.03)',
              }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                    Ödeme Puanı
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                    {userData.paymentScore}/100
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={userData.paymentScore}
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

              <Button
                fullWidth
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditOpen(true)}
                sx={{
                  mt: 3,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  }
                }}
              >
                Profili Düzenle
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Info Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Contact Info */}
            <Grid item xs={12}>
              <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 3 }}>
                    İletişim Bilgileri
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                          <Email />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                            E-posta
                          </Typography>
                          <Typography sx={{ color: '#fff' }}>{userData.email}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                          <Phone />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                            Telefon
                          </Typography>
                          <Typography sx={{ color: '#fff' }}>{userData.phone}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>
                          <Home />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                            Daire
                          </Typography>
                          <Typography sx={{ color: '#fff' }}>{userData.unit} • {userData.building}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                            Taşınma Tarihi
                          </Typography>
                          <Typography sx={{ color: '#fff' }}>{userData.moveInDate}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Settings */}
            <Grid item xs={12}>
              <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                    Ayarlar
                  </Typography>
                  <List sx={{ p: 0 }}>
                    {settings.map((setting, index) => (
                      <React.Fragment key={setting.label}>
                        <ListItem
                          sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            cursor: 'pointer',
                            '&:hover': { background: 'rgba(255,255,255,0.03)' }
                          }}
                        >
                          <ListItemIcon>
                            <Avatar sx={{
                              width: 40,
                              height: 40,
                              background: 'rgba(99, 102, 241, 0.1)',
                              color: '#818cf8',
                            }}>
                              <setting.icon sx={{ fontSize: 20 }} />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ color: '#fff' }}>{setting.label}</Typography>}
                            secondary={<Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>{setting.desc}</Typography>}
                          />
                          {setting.hasSwitch && (
                            <Switch
                              defaultChecked={setting.enabled}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#6366f1',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#6366f1',
                                },
                              }}
                            />
                          )}
                        </ListItem>
                        {index < settings.length - 1 && (
                          <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Logout */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutSharp />}
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: '#ef4444',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.1)',
                  }
                }}
              >
                Çıkış Yap
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            minWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Profili Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            label="Ad Soyad"
            fullWidth
            margin="normal"
            defaultValue={userData.name}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
          <TextField
            label="Telefon"
            fullWidth
            margin="normal"
            defaultValue={userData.phone}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setEditOpen(false);
              setSnackbar({ open: true, message: 'Profil güncellendi', severity: 'success' });
            }}
            sx={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
