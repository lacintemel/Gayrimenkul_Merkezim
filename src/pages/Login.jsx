import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography, TextField, Button, CircularProgress,
  Snackbar, Alert, IconButton, InputAdornment, Box, Fade, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email, Person, Home } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [passwordStrength, setPasswordStrength] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const checkPasswordStrength = (val) => {
    setPassword(val);
    if (!val) setPasswordStrength('');
    else if (val.length < 6) setPasswordStrength('Zayıf');
    else if (/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(val)) setPasswordStrength('Güçlü');
    else setPasswordStrength('Orta');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
      setSnackbar({ open: true, message: result.error, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Başarıyla giriş yapıldı!', severity: 'success' });
      // Kısa bir gecikme ile ana sayfaya yönlendir
      setTimeout(() => {
        navigate('/');
      }, 500);
    }
    setLoading(false);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'Güçlü') return '#10b981';
    if (passwordStrength === 'Orta') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 50%)',
        animation: 'pulse 15s ease-in-out infinite',
      },
      '@keyframes pulse': {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.1)' },
      }
    }}>
      {/* Floating orbs background */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.2))',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        }
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.3))',
        filter: 'blur(80px)',
        animation: 'float2 10s ease-in-out infinite',
        '@keyframes float2': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        }
      }} />

      <Fade in timeout={800}>
        <Card sx={{
          maxWidth: 460,
          width: '90%',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              <Avatar sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                mb: 2,
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
              }}>
                <Home sx={{ fontSize: 40, color: '#fff' }} />
              </Avatar>
              <Typography variant="h4" fontWeight={700} sx={{
                background: 'linear-gradient(135deg, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}>
                Gayrimenkul Merkezim
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                Dijital Site Yönetimi
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                label="E-posta Adresi"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 2,
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(148, 163, 184, 0.6)' }} />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => checkPasswordStrength(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 2,
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(148, 163, 184, 0.6)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(s => !s)}
                        edge="end"
                        sx={{ color: 'rgba(148, 163, 184, 0.6)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {passwordStrength && (
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                    {[1, 2, 3].map((i) => (
                      <Box key={i} sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background: i <= (passwordStrength === 'Güçlü' ? 3 : passwordStrength === 'Orta' ? 2 : 1)
                          ? getStrengthColor()
                          : 'rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                      }} />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: getStrengthColor() }}>
                    Şifre Gücü: {passwordStrength}
                  </Typography>
                </Box>
              )}

              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#8b5cf6',
                    '&:hover': { background: 'rgba(139, 92, 246, 0.1)' }
                  }}
                >
                  Şifremi Unuttum?
                </Button>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'rgba(99, 102, 241, 0.3)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Giriş Yap'}
              </Button>

              <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
                <Typography sx={{ color: 'rgba(148, 163, 184, 0.6)', px: 2 }}>veya</Typography>
              </Divider>

              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.2,
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#6366f1',
                      background: 'rgba(99, 102, 241, 0.1)',
                    }
                  }}
                >
                  Google
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.2,
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#8b5cf6',
                      background: 'rgba(139, 92, 246, 0.1)',
                    }
                  }}
                >
                  Apple
                </Button>
              </Box>

              <Typography align="center" sx={{ mt: 3, color: 'rgba(148, 163, 184, 0.8)' }}>
                Hesabınız yok mu?{' '}
                <Button
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#8b5cf6',
                    '&:hover': { background: 'rgba(139, 92, 246, 0.1)' }
                  }}
                >
                  Kayıt Ol
                </Button>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
