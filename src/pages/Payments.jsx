import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Avatar, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, LinearProgress, Tabs, Tab, Tooltip, Snackbar, Alert
} from '@mui/material';
import {
  Payment, CreditCard, AccountBalance, Receipt, TrendingUp,
  CheckCircle, Schedule, Warning, Add, Download, FilterList,
  ArrowUpward, ArrowDownward
} from '@mui/icons-material';

const payments = [
  { id: 1, amount: 850, date: '01.12.2024', type: 'Aidat', status: 'Ödendi', method: 'Kredi Kartı' },
  { id: 2, amount: 1200, date: '01.11.2024', type: 'Kira', status: 'Ödendi', method: 'Havale' },
  { id: 3, amount: 150, date: '15.10.2024', type: 'Otopark', status: 'Bekliyor', method: '-' },
  { id: 4, amount: 850, date: '01.10.2024', type: 'Aidat', status: 'Ödendi', method: 'Kredi Kartı' },
  { id: 5, amount: 75, date: '20.09.2024', type: 'Ortak Gider', status: 'Ödendi', method: 'Havale' },
];

const summaryCards = [
  { label: 'Bu Ay Ödenen', value: '₺2.050', icon: CheckCircle, color: '#10b981', trend: '+12%' },
  { label: 'Bekleyen Ödeme', value: '₺150', icon: Schedule, color: '#f59e0b', trend: '-5%' },
  { label: 'Toplam (Yıl)', value: '₺24.600', icon: TrendingUp, color: '#6366f1', trend: '+8%' },
];

const Payments = () => {
  const [tab, setTab] = useState(0);
  const [payDialog, setPayDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  };

  const getStatusChip = (status) => {
    const config = {
      'Ödendi': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
      'Bekliyor': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: <Schedule sx={{ fontSize: 14 }} /> },
      'Gecikmiş': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: <Warning sx={{ fontSize: 14 }} /> },
    };
    const cfg = config[status] || config['Bekliyor'];
    return (
      <Chip
        icon={cfg.icon}
        label={status}
        size="small"
        sx={{
          background: cfg.bg,
          color: cfg.color,
          fontWeight: 500,
          '& .MuiChip-icon': { color: cfg.color }
        }}
      />
    );
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      py: 4,
      px: { xs: 2, md: 4 },
    }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
          }}>
            <Payment sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Ödemeler
            </Typography>
            <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
              Ödeme geçmişi ve işlemler
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setPayDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: 2,
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669, #047857)',
            }
          }}
        >
          Ödeme Yap
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={4} key={card.label}>
            <Card sx={{
              ...cardStyle,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.8)', mb: 1 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                      {card.value}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                      {card.trend.startsWith('+') ? (
                        <ArrowUpward sx={{ fontSize: 14, color: '#10b981' }} />
                      ) : (
                        <ArrowDownward sx={{ fontSize: 14, color: '#ef4444' }} />
                      )}
                      <Typography variant="caption" sx={{
                        color: card.trend.startsWith('+') ? '#10b981' : '#ef4444'
                      }}>
                        {card.trend} geçen aya göre
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{
                    width: 48,
                    height: 48,
                    background: `${card.color}20`,
                    color: card.color,
                  }}>
                    <card.icon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment Methods */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardStyle, p: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              }}>
                <CreditCard />
              </Avatar>
              <Box flex={1}>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                  Kredi Kartı
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                  •••• •••• •••• 4242
                </Typography>
              </Box>
              <Chip label="Varsayılan" size="small" sx={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardStyle, p: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{
                width: 56,
                height: 56,
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(148, 163, 184, 0.6)',
              }}>
                <AccountBalance />
              </Avatar>
              <Box flex={1}>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                  Banka Hesabı
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                  TR** **** **** 5678
                </Typography>
              </Box>
              <Button size="small" sx={{ color: '#818cf8', textTransform: 'none' }}>Düzenle</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              Ödeme Geçmişi
            </Typography>
            <Box display="flex" gap={1}>
              <Tooltip title="Filtrele">
                <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  <FilterList />
                </IconButton>
              </Tooltip>
              <Tooltip title="İndir">
                <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 3,
              '& .MuiTab-root': { color: 'rgba(148, 163, 184, 0.7)', textTransform: 'none' },
              '& .Mui-selected': { color: '#6366f1' },
              '& .MuiTabs-indicator': { background: '#6366f1' },
            }}
          >
            <Tab label="Tümü" />
            <Tab label="Ödenen" />
            <Tab label="Bekleyen" />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Tür', 'Tarih', 'Tutar', 'Yöntem', 'Durum', 'İşlem'].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: 'rgba(148, 163, 184, 0.7)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        fontWeight: 600,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {payments
                  .filter(p => tab === 0 || (tab === 1 && p.status === 'Ödendi') || (tab === 2 && p.status === 'Bekliyor'))
                  .map((payment) => (
                    <TableRow
                      key={payment.id}
                      sx={{
                        '&:hover': { background: 'rgba(255,255,255,0.02)' },
                        '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' },
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{
                            width: 36,
                            height: 36,
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#818cf8',
                          }}>
                            <Receipt sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography sx={{ color: '#fff' }}>{payment.type}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>{payment.date}</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>₺{payment.amount}</TableCell>
                      <TableCell sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>{payment.method}</TableCell>
                      <TableCell>{getStatusChip(payment.status)}</TableCell>
                      <TableCell>
                        {payment.status === 'Bekliyor' ? (
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              textTransform: 'none',
                              fontSize: 12,
                            }}
                          >
                            Öde
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            sx={{ color: '#818cf8', textTransform: 'none' }}
                          >
                            Dekont
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Pay Dialog */}
      <Dialog
        open={payDialog}
        onClose={() => setPayDialog(false)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            minWidth: 450,
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Ödeme Yap</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, p: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Typography variant="body2" sx={{ color: '#10b981', mb: 1 }}>Bekleyen Ödeme</Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>₺150</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>Otopark Ücreti</Typography>
          </Box>
          <TextField
            label="Kart Numarası"
            fullWidth
            margin="normal"
            placeholder="1234 5678 9012 3456"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Son Kullanma"
                fullWidth
                margin="normal"
                placeholder="MM/YY"
                sx={{
                  '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                  '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVV"
                fullWidth
                margin="normal"
                placeholder="123"
                sx={{
                  '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                  '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPayDialog(false)} sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setPayDialog(false);
              setSnackbar({ open: true, message: 'Ödeme başarıyla tamamlandı!', severity: 'success' });
            }}
            sx={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              px: 4,
            }}
          >
            ₺150 Öde
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Payments;
