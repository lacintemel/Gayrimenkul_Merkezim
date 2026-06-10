import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AcUnit,
  Add,
  AttachFile,
  Build,
  CheckCircle,
  Close,
  ElectricalServices,
  FilterList,
  LocalFireDepartment,
  Pending,
  Plumbing,
  Schedule,
  Send,
  Warning,
} from '@mui/icons-material';
import maintenanceService from '../api/MaintenanceService';
import UnitService from '../api/UnitService';
import { useAuthStore } from '../store/authStore';

const managementRoles = ['platform_admin', 'management_company', 'building_manager', 'property_owner', 'super_admin', 'agency_manager', 'agent'];

const categories = [
  { value: 'PLUMBING', label: 'Tesisat', icon: Plumbing, color: '#3b82f6' },
  { value: 'HVAC', label: 'Isıtma / Klima', icon: LocalFireDepartment, color: '#ef4444' },
  { value: 'ELECTRICAL', label: 'Elektrik', icon: ElectricalServices, color: '#f59e0b' },
  { value: 'STRUCTURAL', label: 'Yapısal', icon: Build, color: '#8b5cf6' },
  { value: 'APPLIANCE', label: 'Cihaz', icon: AcUnit, color: '#06b6d4' },
  { value: 'OTHER', label: 'Diğer', icon: Build, color: '#64748b' },
];

const statusConfig = {
  OPEN: { label: 'Açık', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Schedule },
  IN_PROGRESS: { label: 'Devam Ediyor', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', icon: Pending },
  WAITING_PARTS: { label: 'Parça Bekliyor', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Schedule },
  SCHEDULED: { label: 'Planlandı', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', icon: Schedule },
  COMPLETED: { label: 'Tamamlandı', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: CheckCircle },
  CANCELLED: { label: 'İptal', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)', icon: Close },
};

const priorityConfig = {
  URGENT: { label: 'Acil', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  HIGH: { label: 'Yüksek', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  MEDIUM: { label: 'Normal', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
  LOW: { label: 'Düşük', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
};

const formatCurrency = (value) => new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
}).format(value || 0);

const formatDate = (value) => {
  if (!value) return 'Planlanmadı';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long' }).format(new Date(value));
};

const getCategory = (category) => categories.find(item => item.value === category) || categories[categories.length - 1];

const Maintenance = () => {
  const user = useAuthStore((state) => state.user);
  const canUpdateStatus = managementRoles.includes(user?.role);
  const [tab, setTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const [units, setUnits] = useState([]);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, completed: 0, urgent: 0, estimatedCost: 0 });
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newRequest, setNewRequest] = useState({
    title: '',
    unitId: '',
    category: 'PLUMBING',
    priority: 'MEDIUM',
    description: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  };

  const fetchData = async () => {
    try {
      const [requestsData, statsData, unitsData] = await Promise.all([
        maintenanceService.getRequests(),
        maintenanceService.getStats(),
        UnitService.getAll(),
      ]);
      setRequests(requestsData.data || []);
      setStats(statsData);
      setUnits(unitsData.data || []);
    } catch (err) {
      console.error('Maintenance fetch error:', err);
      setSnackbar({ open: true, message: 'Bakım talepleri yüklenemedi', severity: 'error' });
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, []);

  const filteredRequests = useMemo(() => requests.filter(request => {
    const tabMatches =
      tab === 0 ||
      (tab === 1 && ['IN_PROGRESS', 'SCHEDULED', 'WAITING_PARTS'].includes(request.status)) ||
      (tab === 2 && request.status === 'OPEN') ||
      (tab === 3 && request.status === 'COMPLETED');
    const statusMatches = statusFilter === 'all' || request.status === statusFilter;
    return tabMatches && statusMatches;
  }), [requests, tab, statusFilter]);

  const getStatusChip = (status) => {
    const cfg = statusConfig[status] || statusConfig.OPEN;
    const Icon = cfg.icon;
    return (
      <Chip
        icon={<Icon sx={{ fontSize: '16px !important' }} />}
        label={cfg.label}
        size="small"
        sx={{
          background: cfg.bg,
          color: cfg.color,
          fontWeight: 600,
          '& .MuiChip-icon': { color: cfg.color },
        }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    const cfg = priorityConfig[priority] || priorityConfig.MEDIUM;
    return (
      <Chip
        label={cfg.label}
        size="small"
        sx={{ height: 22, fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}
      />
    );
  };

  const handleCreateRequest = async () => {
    try {
      await maintenanceService.createRequest(newRequest);
      setNewRequestOpen(false);
      setNewRequest({ title: '', unitId: '', category: 'PLUMBING', priority: 'MEDIUM', description: '' });
      setSnackbar({ open: true, message: 'Talep başarıyla oluşturuldu', severity: 'success' });
      fetchData();
    } catch (err) {
      console.error('Create maintenance error:', err);
      setSnackbar({ open: true, message: 'Talep oluşturulamadı', severity: 'error' });
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!detailOpen) return;

    try {
      const updated = await maintenanceService.updateStatus(detailOpen.id, { status });
      setRequests(prev => prev.map(item => item.id === updated.id ? updated : item));
      setDetailOpen(updated);
      const nextStats = await maintenanceService.getStats();
      setStats(nextStats);
      setSnackbar({ open: true, message: 'Talep durumu güncellendi', severity: 'success' });
    } catch (err) {
      console.error('Update maintenance error:', err);
      setSnackbar({ open: true, message: 'Durum güncellenemedi', severity: 'error' });
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      py: 4,
      px: { xs: 2, md: 4 },
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4} gap={2} flexWrap="wrap">
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
              {stats.open + stats.inProgress} aktif talep · {stats.urgent} acil
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
            '&:hover': { background: 'linear-gradient(135deg, #d97706, #b45309)' },
          }}
        >
          Yeni Talep
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Açık', count: stats.open, color: '#f59e0b' },
          { label: 'İşlemde', count: stats.inProgress, color: '#6366f1' },
          { label: 'Tamamlandı', count: stats.completed, color: '#10b981' },
          { label: 'Tahmini Maliyet', count: formatCurrency(stats.estimatedCost), color: '#ef4444' },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card sx={{ ...cardStyle, p: 2, textAlign: 'center', minHeight: 116 }}>
              <Typography variant="h4" sx={{ color: stat.color, fontWeight: 700 }}>
                {stat.count}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        {categories.slice(0, 5).map((cat) => (
          <Card
            key={cat.value}
            sx={{
              ...cardStyle,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'all 0.2s ease',
            }}
          >
            <Avatar sx={{ width: 40, height: 40, background: `${cat.color}20`, color: cat.color }}>
              <cat.icon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography sx={{ color: '#fff', fontWeight: 500 }}>{cat.label}</Typography>
          </Card>
        ))}
      </Box>

      <Card sx={cardStyle}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} gap={2} flexWrap="wrap">
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
              <Tab label="İşlemde" />
              <Tab label="Açık" />
              <Tab label="Tamamlandı" />
            </Tabs>
            <Box display="flex" gap={1} alignItems="center">
              <FormControl size="small">
                <Select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  sx={{
                    minWidth: 150,
                    height: 36,
                    color: '#F1F5F9',
                    fontSize: 13,
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                    '& .MuiSvgIcon-root': { color: '#64748B' },
                  }}
                >
                  <MenuItem value="all">Tüm Durumlar</MenuItem>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <MenuItem key={value} value={value}>{config.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title="Filtrele">
                <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <List sx={{ p: 0 }}>
            {filteredRequests.map((request, index) => {
              const category = getCategory(request.category);

              return (
                <React.Fragment key={request.id}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { background: 'rgba(255,255,255,0.03)' },
                    }}
                    onClick={() => setDetailOpen(request)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: 48, height: 48, background: `${category.color}20`, color: category.color }}>
                        <category.icon sx={{ fontSize: 20 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography sx={{ color: '#fff', fontWeight: 600 }}>{request.title}</Typography>
                          {getPriorityChip(request.priority)}
                        </Box>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={2} mt={0.5} flexWrap="wrap">
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.65)' }}>
                            {category.label} · {formatDate(request.createdAt)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.65)' }}>
                            {request.unit?.property?.title} · {request.unit?.unitNumber}
                          </Typography>
                          {request.assignedTo && (
                            <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.65)' }}>
                              {request.assignedTo}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 150, mr: 2 }}>
                      {request.status !== 'OPEN' && (
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
                              },
                            }}
                          />
                        </>
                      )}
                    </Box>
                    {getStatusChip(request.status)}
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
          },
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
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                {detailOpen.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.7)', mb: 2 }}>
                {detailOpen.unit?.property?.title} · {detailOpen.unit?.unitNumber}
              </Typography>
              <Box display="flex" gap={1} mb={3} flexWrap="wrap">
                {getStatusChip(detailOpen.status)}
                {getPriorityChip(detailOpen.priority)}
              </Box>
              <Typography sx={{ color: 'rgba(148, 163, 184, 0.7)', mb: 1 }}>Açıklama</Typography>
              <Typography sx={{ color: '#fff', mb: 3 }}>{detailOpen.description}</Typography>
              <Typography sx={{ color: 'rgba(148, 163, 184, 0.7)', mb: 1 }}>Planlanan Tarih</Typography>
              <Typography sx={{ color: '#fff', mb: 3 }}>{formatDate(detailOpen.scheduledDate)}</Typography>
              <Typography sx={{ color: 'rgba(148, 163, 184, 0.7)', mb: 1 }}>Maliyet</Typography>
              <Typography sx={{ color: '#fff', mb: 3 }}>{formatCurrency(detailOpen.actualCost || detailOpen.estimatedCost)}</Typography>
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
                  },
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, flexWrap: 'wrap' }}>
              {canUpdateStatus && (
                <>
                  <Button onClick={() => handleStatusUpdate('IN_PROGRESS')} sx={{ color: '#6366f1', textTransform: 'none' }}>
                    İşleme Al
                  </Button>
                  <Button onClick={() => handleStatusUpdate('SCHEDULED')} sx={{ color: '#06b6d4', textTransform: 'none' }}>
                    Planla
                  </Button>
                  <Button onClick={() => handleStatusUpdate('COMPLETED')} sx={{ color: '#10b981', textTransform: 'none' }}>
                    Tamamla
                  </Button>
                </>
              )}
              <Button onClick={() => setDetailOpen(null)} sx={{ color: 'rgba(148, 163, 184, 0.8)', textTransform: 'none' }}>
                Kapat
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
          },
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
            value={newRequest.title}
            onChange={(event) => setNewRequest(prev => ({ ...prev, title: event.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>Birim</InputLabel>
            <Select
              label="Birim"
              value={newRequest.unitId}
              onChange={(event) => setNewRequest(prev => ({ ...prev, unitId: event.target.value }))}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                '& .MuiSelect-icon': { color: 'rgba(148, 163, 184, 0.6)' },
              }}
            >
              {units.map(unit => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.property?.title} · {unit.unitNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Kategori"
            select
            fullWidth
            margin="normal"
            value={newRequest.category}
            onChange={(event) => setNewRequest(prev => ({ ...prev, category: event.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
              '& .MuiSelect-icon': { color: 'rgba(148, 163, 184, 0.6)' },
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Öncelik"
            select
            fullWidth
            margin="normal"
            value={newRequest.priority}
            onChange={(event) => setNewRequest(prev => ({ ...prev, priority: event.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          >
            {Object.entries(priorityConfig).map(([value, config]) => (
              <MenuItem key={value} value={value}>{config.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Açıklama"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={newRequest.description}
            onChange={(event) => setNewRequest(prev => ({ ...prev, description: event.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
          <Button startIcon={<AttachFile />} sx={{ mt: 1, color: '#f59e0b', textTransform: 'none' }}>
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
            onClick={handleCreateRequest}
            disabled={!newRequest.title || !newRequest.unitId || !newRequest.description}
            sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
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
