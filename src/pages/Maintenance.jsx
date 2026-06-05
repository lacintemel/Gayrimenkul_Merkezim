import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Avatar, Grid,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, LinearProgress, Stepper, Step, StepLabel,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Tooltip,
  Snackbar, Alert, Tabs, Tab
} from '@mui/material';
import {
  Build, Add, Assignment, Schedule, CheckCircle, Pending, Search,
  Plumbing, LocalFireDepartment, ElectricalServices, AcUnit,
  FilterList, AttachFile, Send, Close
} from '@mui/icons-material';

const requests = [
  { id: 1, title: 'Musluk Akıtıyor', status: 'Devam Ediyor', date: '20 Kasım', category: 'Tesisat', priority: 'Yüksek', progress: 60, assignee: 'Ahmet Usta' },
  { id: 2, title: 'Kombi Çalışmıyor', status: 'Beklemede', date: '23 Kasım', category: 'Isıtma', priority: 'Acil', progress: 0, assignee: '-' },
  { id: 3, title: 'Elektrik Arızası', status: 'Tamamlandı', date: '15 Kasım', category: 'Elektrik', priority: 'Normal', progress: 100, assignee: 'Mehmet Usta' },
  { id: 4, title: 'Klima Bakımı', status: 'Beklemede', date: '25 Kasım', category: 'Klima', priority: 'Düşük', progress: 0, assignee: '-' },
];

const categories = [
  { label: 'Tesisat', icon: Plumbing, color: '#3b82f6' },
  { label: 'Isıtma', icon: LocalFireDepartment, color: '#ef4444' },
  { label: 'Elektrik', icon: ElectricalServices, color: '#f59e0b' },
  { label: 'Klima', icon: AcUnit, color: '#06b6d4' },
];

const Maintenance = () => {
  const [tab, setTab] = useState(0);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  };

  const getStatusConfig = (status) => {
    const config = {
      'Tamamlandı': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
      'Devam Ediyor': { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', icon: <Pending sx={{ fontSize: 16 }} /> },
      'Beklemede': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: <Schedule sx={{ fontSize: 16 }} /> },
    };
    return config[status] || config['Beklemede'];
  };

  const getPriorityConfig = (priority) => {
    const config = {
      'Acil': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
      'Yüksek': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
      'Normal': { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
      'Düşük': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    };
    return config[priority] || config['Normal'];
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.label === category);
    return cat ? <cat.icon sx={{ fontSize: 20 }} /> : <Build sx={{ fontSize: 20 }} />;
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.label === category);
    return cat?.color || '#6366f1';
  };

  const filteredRequests = requests.filter(r =>
    tab === 0 ||
    (tab === 1 && r.status === 'Devam Ediyor') ||
    (tab === 2 && r.status === 'Beklemede') ||
    (tab === 3 && r.status === 'Tamamlandı')
  );

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
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
          }}>
            <Build sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Bakım Talepleri
            </Typography>
            <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
              {requests.filter(r => r.status !== 'Tamamlandı').length} aktif talep
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setNewRequestOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: 2,
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d97706, #b45309)',
            }
          }}
        >
          Yeni Talep
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Aktif', count: requests.filter(r => r.status === 'Devam Ediyor').length, color: '#6366f1' },
          { label: 'Beklemede', count: requests.filter(r => r.status === 'Beklemede').length, color: '#f59e0b' },
          { label: 'Tamamlandı', count: requests.filter(r => r.status === 'Tamamlandı').length, color: '#10b981' },
        ].map((stat) => (
          <Grid item xs={4} key={stat.label}>
            <Card sx={{ ...cardStyle, p: 2, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: stat.color, fontWeight: 700 }}>
                {stat.count}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Category Quick Filters */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        {categories.map((cat) => (
          <Card
            key={cat.label}
            sx={{
              ...cardStyle,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: cat.color,
              }
            }}
          >
            <Avatar sx={{ width: 40, height: 40, background: `${cat.color}20`, color: cat.color }}>
              <cat.icon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography sx={{ color: '#fff', fontWeight: 500 }}>{cat.label}</Typography>
          </Card>
        ))}
      </Box>

      {/* Requests List */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                '& .MuiTab-root': { color: 'rgba(148, 163, 184, 0.7)', textTransform: 'none', minWidth: 80 },
                '& .Mui-selected': { color: '#f59e0b' },
                '& .MuiTabs-indicator': { background: '#f59e0b' },
              }}
            >
              <Tab label="Tümü" />
              <Tab label="Aktif" />
              <Tab label="Beklemede" />
              <Tab label="Tamamlandı" />
            </Tabs>
            <Tooltip title="Filtrele">
              <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>

          <List sx={{ p: 0 }}>
            {filteredRequests.map((request, index) => {
              const statusCfg = getStatusConfig(request.status);
              const priorityCfg = getPriorityConfig(request.priority);

              return (
                <React.Fragment key={request.id}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { background: 'rgba(255,255,255,0.03)' }
                    }}
                    onClick={() => setDetailOpen(request)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        background: `${getCategoryColor(request.category)}20`,
                        color: getCategoryColor(request.category),
                      }}>
                        {getCategoryIcon(request.category)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography sx={{ color: '#fff', fontWeight: 600 }}>{request.title}</Typography>
                          <Chip
                            label={request.priority}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: 10,
                              background: priorityCfg.bg,
                              color: priorityCfg.color,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                            {request.category} • {request.date}
                          </Typography>
                          {request.assignee !== '-' && (
                            <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                              👷 {request.assignee}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ minWidth: 150, mr: 2 }}>
                      {request.status === 'Devam Ediyor' && (
                        <>
                          <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>İlerleme</Typography>
                            <Typography variant="caption" sx={{ color: '#6366f1' }}>{request.progress}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={request.progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              background: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                borderRadius: 3,
                              }
                            }}
                          />
                        </>
                      )}
                    </Box>
                    <Chip
                      icon={statusCfg.icon}
                      label={request.status}
                      size="small"
                      sx={{
                        background: statusCfg.bg,
                        color: statusCfg.color,
                        fontWeight: 500,
                        '& .MuiChip-icon': { color: statusCfg.color }
                      }}
                    />
                  </ListItem>
                  {index < filteredRequests.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.03)' }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(detailOpen)}
        onClose={() => setDetailOpen(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
          }
        }}
      >
        {detailOpen && (
          <>
            <DialogTitle sx={{ color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Talep Detayı
              <IconButton onClick={() => setDetailOpen(null)} sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{
                  width: 48,
                  height: 48,
                  background: `${getCategoryColor(detailOpen.category)}20`,
                  color: getCategoryColor(detailOpen.category),
                }}>
                  {getCategoryIcon(detailOpen.category)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                    {detailOpen.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                    {detailOpen.category} • {detailOpen.date}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1} mb={3} flexWrap="wrap">
                <Chip
                  label={detailOpen.status}
                  icon={getStatusConfig(detailOpen.status).icon}
                  sx={{
                    background: getStatusConfig(detailOpen.status).bg,
                    color: getStatusConfig(detailOpen.status).color,
                    '& .MuiChip-icon': { color: getStatusConfig(detailOpen.status).color },
                  }}
                />
                <Chip
                  label={detailOpen.priority}
                  sx={{
                    background: getPriorityConfig(detailOpen.priority).bg,
                    color: getPriorityConfig(detailOpen.priority).color,
                  }}
                />
              </Box>
              <Typography sx={{ color: 'rgba(148, 163, 184, 0.7)', mb: 1 }}>
                Atanan kişi
              </Typography>
              <Typography sx={{ color: '#fff', mb: 3 }}>
                {detailOpen.assignee}
              </Typography>
              <Typography sx={{ color: 'rgba(148, 163, 184, 0.7)', mb: 1 }}>
                İlerleme
              </Typography>
              <LinearProgress
                variant="determinate"
                value={detailOpen.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    borderRadius: 4,
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDetailOpen(null)} sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                Kapat
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Request Dialog */}
      <Dialog
        open={newRequestOpen}
        onClose={() => setNewRequestOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Yeni Bakım Talebi
          <IconButton onClick={() => setNewRequestOpen(false)} sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Başlık"
            fullWidth
            margin="normal"
            placeholder="Örn: Musluk tamiri"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(245, 158, 11, 0.5)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
          <TextField
            label="Kategori"
            select
            fullWidth
            margin="normal"
            defaultValue=""
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
              '& .MuiSelect-icon': { color: 'rgba(148, 163, 184, 0.6)' },
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.label} value={cat.label}>{cat.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Öncelik"
            select
            fullWidth
            margin="normal"
            defaultValue="Normal"
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          >
            {['Düşük', 'Normal', 'Yüksek', 'Acil'].map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Açıklama"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            placeholder="Sorunu detaylı açıklayın..."
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
          <Button
            startIcon={<AttachFile />}
            sx={{ mt: 1, color: '#f59e0b', textTransform: 'none' }}
          >
            Fotoğraf Ekle
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setNewRequestOpen(false)} sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
            İptal
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={() => {
              setNewRequestOpen(false);
              setSnackbar({ open: true, message: 'Talep başarıyla oluşturuldu!', severity: 'success' });
            }}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            }}
          >
            Talep Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Maintenance;
