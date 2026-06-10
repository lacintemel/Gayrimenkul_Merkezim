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
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add,
  Apartment,
  Assignment,
  CheckCircle,
  EventBusy,
  Payments,
  Person,
  Warning,
} from '@mui/icons-material';
import TenancyService from '../api/TenancyService';
import UnitService from '../api/UnitService';
import userService from '../api/UserService';

const formatCurrency = (value) => new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
}).format(value || 0);

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('tr-TR').format(new Date(value))
  : '-';

const statusConfig = {
  ACTIVE: { label: 'Aktif', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  PENDING: { label: 'Bekliyor', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
  EXPIRED: { label: 'Süresi Doldu', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' },
  TERMINATED: { label: 'Sonlandı', color: '#64748B', bg: 'rgba(100, 116, 139, 0.12)' },
};

const SummaryCard = ({ icon, label, value, caption, color }) => (
  <Card sx={{
    background: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box>
          <Typography sx={{ color: 'rgba(148,163,184,0.8)', fontSize: 12, mb: 1 }}>{label}</Typography>
          <Typography sx={{ color: '#fff', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
          <Typography sx={{ color: '#64748B', fontSize: 11, mt: 1 }}>{caption}</Typography>
        </Box>
        <Avatar sx={{ background: `${color}20`, color }}>
          {React.createElement(icon)}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default function Tenancies() {
  const [tenancies, setTenancies] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, monthlyRent: 0 });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    unitId: '',
    tenantId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    monthlyRent: '',
    deposit: '',
    dueDay: 1,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      const [tenancyData, statsData, unitData, tenantData] = await Promise.all([
        TenancyService.getAll(),
        TenancyService.getStats(),
        UnitService.getAll(),
        userService.getUsers({ role: 'tenant' }),
      ]);
      setTenancies(tenancyData.data || []);
      setStats(statsData);
      setUnits(unitData.data || []);
      setTenants(tenantData.data || []);
    } catch (err) {
      console.error('Tenancies fetch error:', err);
      setSnackbar({ open: true, message: 'Kiracılıklar yüklenemedi', severity: 'error' });
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, []);

  const vacantUnits = useMemo(() => units.filter(unit => !unit.activeTenancy), [units]);
  const overdueTotal = tenancies.reduce((sum, tenancy) => sum + (tenancy.paymentSummary?.overdue || 0), 0);

  const handleCreate = async () => {
    try {
      await TenancyService.create({
        ...form,
        monthlyRent: Number(form.monthlyRent),
        deposit: Number(form.deposit || 0),
        dueDay: Number(form.dueDay || 1),
      });
      setOpen(false);
      setForm({
        unitId: '',
        tenantId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        monthlyRent: '',
        deposit: '',
        dueDay: 1,
      });
      setSnackbar({ open: true, message: 'Kiracılık oluşturuldu', severity: 'success' });
      fetchData();
    } catch (err) {
      console.error('Create tenancy error:', err);
      setSnackbar({ open: true, message: err?.response?.data?.error || 'Kiracılık oluşturulamadı', severity: 'error' });
    }
  };

  const handleTerminate = async (tenancy) => {
    try {
      await TenancyService.terminate(tenancy.id, { endDate: new Date().toISOString().split('T')[0] });
      setSnackbar({ open: true, message: 'Kiracılık sonlandırıldı', severity: 'success' });
      fetchData();
    } catch (err) {
      console.error('Terminate tenancy error:', err);
      setSnackbar({ open: true, message: 'Kiracılık sonlandırılamadı', severity: 'error' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', py: 4, px: { xs: 2, md: 4 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 56, height: 56, background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
            <Assignment sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>Kiracılıklar & Sözleşmeler</Typography>
            <Typography sx={{ color: 'rgba(148,163,184,0.8)' }}>{stats.active} aktif kiracılık · {vacantUnits.length} boş birim</Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ textTransform: 'none', background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', fontWeight: 700 }}
        >
          Kiracılık Başlat
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard icon={Assignment} label="Toplam" value={stats.total} caption="Kiracılık kaydı" color="#8B5CF6" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard icon={CheckCircle} label="Aktif" value={stats.active} caption="Devam eden sözleşme" color="#10B981" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard icon={Payments} label="Aylık Kira" value={formatCurrency(stats.monthlyRent)} caption="Beklenen gelir" color="#3B82F6" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard icon={Warning} label="Geciken" value={formatCurrency(overdueTotal)} caption="Tahsilat riski" color="#EF4444" />
        </Grid>
      </Grid>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {tenancies.map((tenancy) => {
          const status = statusConfig[tenancy.status] || statusConfig.ACTIVE;
          const tenantName = tenancy.tenant ? `${tenancy.tenant.firstName} ${tenancy.tenant.lastName}` : 'Kiracı yok';
          const overdue = tenancy.paymentSummary?.overdue || 0;

          return (
            <Card key={tenancy.id} sx={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1.2fr 1fr 1fr auto' }} gap={2} alignItems="center">
                  <Box display="flex" gap={1.5} alignItems="center">
                    <Avatar sx={{ background: 'rgba(59,130,246,0.16)', color: '#3B82F6' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: '#fff', fontWeight: 700 }}>{tenantName}</Typography>
                      <Typography sx={{ color: '#64748B', fontSize: 12 }}>{tenancy.unit?.property?.title} · {tenancy.unit?.unitNumber}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#64748B', fontSize: 12 }}>Süre</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{formatDate(tenancy.startDate)} - {formatDate(tenancy.endDate)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#64748B', fontSize: 12 }}>Kira / Depozito</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{formatCurrency(tenancy.monthlyRent)} / {formatCurrency(tenancy.deposit)}</Typography>
                  </Box>
                  <Box display="flex" gap={1} alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} flexWrap="wrap">
                    <Chip label={status.label} sx={{ color: status.color, background: status.bg, fontWeight: 700 }} />
                    {overdue > 0 && <Chip label={formatCurrency(overdue)} sx={{ color: '#EF4444', background: 'rgba(239,68,68,0.12)', fontWeight: 700 }} />}
                    {tenancy.status === 'ACTIVE' && (
                      <Button size="small" onClick={() => handleTerminate(tenancy)} startIcon={<EventBusy />} sx={{ color: '#EF4444', textTransform: 'none' }}>
                        Sonlandır
                      </Button>
                    )}
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={tenancy.status === 'ACTIVE' ? 70 : 100}
                  sx={{
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': { borderRadius: 3, background: overdue > 0 ? '#EF4444' : '#10B981' },
                  }}
                />
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'rgba(30,41,59,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff' }}>Yeni Kiracılık Başlat</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: 'rgba(148,163,184,0.8)' }}>Birim</InputLabel>
            <Select label="Birim" value={form.unitId} onChange={(e) => setForm(prev => ({ ...prev, unitId: e.target.value }))} sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiSelect-icon': { color: '#94A3B8' } }}>
              {vacantUnits.map(unit => (
                <MenuItem key={unit.id} value={unit.id}>{unit.property?.title} · {unit.unitNumber}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: 'rgba(148,163,184,0.8)' }}>Kiracı</InputLabel>
            <Select label="Kiracı" value={form.tenantId} onChange={(e) => setForm(prev => ({ ...prev, tenantId: e.target.value }))} sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiSelect-icon': { color: '#94A3B8' } }}>
              {tenants.map(tenant => (
                <MenuItem key={tenant.id} value={tenant.id}>{tenant.firstName} {tenant.lastName} · {tenant.email}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Başlangıç" type="date" fullWidth margin="normal" value={form.startDate} onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94A3B8' } }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Bitiş" type="date" fullWidth margin="normal" value={form.endDate} onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94A3B8' } }} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Aylık Kira" fullWidth margin="normal" value={form.monthlyRent} onChange={(e) => setForm(prev => ({ ...prev, monthlyRent: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94A3B8' } }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Depozito" fullWidth margin="normal" value={form.deposit} onChange={(e) => setForm(prev => ({ ...prev, deposit: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94A3B8' } }} />
            </Grid>
          </Grid>
          <TextField label="Ödeme Günü" fullWidth margin="normal" value={form.dueDay} onChange={(e) => setForm(prev => ({ ...prev, dueDay: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#94A3B8' } }} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94A3B8' }}>İptal</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.unitId || !form.tenantId || !form.monthlyRent} sx={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
