import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  Apartment,
  ArrowBack,
  Build,
  Business,
  CalendarMonth,
  HomeWork,
  Landscape,
  LocationOn,
  Payments,
  Person,
  ReportProblem,
  SquareFoot,
  Store,
  TrendingUp,
  Villa,
} from '@mui/icons-material';
import PropertyService from '../api/PropertyService';

const typeIcons = {
  apartment: Apartment,
  villa: Villa,
  office: Business,
  land: Landscape,
  shop: Store,
};

const typeLabels = {
  apartment: 'Daire',
  villa: 'Villa',
  office: 'Ofis',
  land: 'Arazi',
  shop: 'Dükkan',
  warehouse: 'Depo',
};

const unitStatusConfig = {
  OCCUPIED: { label: 'Dolu', color: '#10B981', bg: 'rgba(16, 185, 129, 0.14)' },
  VACANT: { label: 'Boş', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.14)' },
  MAINTENANCE: { label: 'Bakımda', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.14)' },
};

const maintenanceStatusConfig = {
  OPEN: { label: 'Açık', color: '#EF4444' },
  IN_PROGRESS: { label: 'İşlemde', color: '#3B82F6' },
  SCHEDULED: { label: 'Planlandı', color: '#F59E0B' },
  COMPLETED: { label: 'Tamamlandı', color: '#10B981' },
};

const formatCurrency = (value, currency = 'TRY') => new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0,
}).format(value || 0);

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('tr-TR').format(new Date(value))
  : '-';

const getTenantName = (tenancy) => {
  const tenant = tenancy?.tenant;
  return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Kiracı yok';
};

const SummaryCard = ({ icon, label, value, caption, color }) => (
  <Card sx={{
    background: 'rgba(30, 41, 59, 0.62)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
    height: '100%',
  }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box>
          <Typography sx={{ color: 'rgba(148,163,184,0.82)', fontSize: 12, mb: 1 }}>{label}</Typography>
          <Typography sx={{ color: '#fff', fontSize: 25, fontWeight: 800, lineHeight: 1.1 }}>{value}</Typography>
          <Typography sx={{ color: '#64748B', fontSize: 12, mt: 1 }}>{caption}</Typography>
        </Box>
        <Avatar sx={{ background: `${color}22`, color }}>
          {React.createElement(icon)}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Panel = ({ title, children }) => (
  <Card sx={{
    background: 'rgba(15, 23, 42, 0.72)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  }}>
    <CardContent sx={{ p: 2.5 }}>
      <Typography sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchProperty = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await PropertyService.getById(id);
        if (!mounted) return;
        setProperty(data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.error || 'Mülk detayları yüklenemedi');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void Promise.resolve().then(fetchProperty);

    return () => {
      mounted = false;
    };
  }, [id]);

  const monthlyRentPerUnit = useMemo(() => {
    const units = property?.units || [];
    return units.map(unit => ({
      label: unit.unitNumber,
      value: unit.activeTenancy?.monthlyRent || 0,
    }));
  }, [property]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', py: 4, px: { xs: 2, md: 4 } }}>
        <Skeleton variant="rounded" height={72} sx={{ mb: 3, background: 'rgba(255,255,255,0.06)' }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} md={3} key={item}>
              <Skeleton variant="rounded" height={124} sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.06)' }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', py: 4, px: { xs: 2, md: 4 } }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/properties')} sx={{ color: '#94A3B8', textTransform: 'none', mb: 2 }}>
          Mülklere Dön
        </Button>
        <Alert severity="error">{error || 'Mülk bulunamadı'}</Alert>
      </Box>
    );
  }

  const TypeIcon = typeIcons[property.type] || HomeWork;
  const address = property.address || {};
  const unitSummary = property.unitSummary || {};
  const paymentSummary = property.paymentSummary || {};
  const tenancySummary = property.tenancySummary || {};
  const maxRent = Math.max(1, ...monthlyRentPerUnit.map(item => item.value));
  const openMaintenance = (property.maintenanceRequests || []).filter(request => !['COMPLETED', 'CANCELLED'].includes(request.status));

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', py: 4, px: { xs: 2, md: 4 } }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/properties')}
        sx={{ color: '#94A3B8', textTransform: 'none', mb: 2 }}
      >
        Mülklere Dön
      </Button>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '360px 1fr' },
          gap: 2,
          alignItems: 'stretch',
          mb: 3,
        }}
      >
        <Box sx={{ borderRadius: 3, overflow: 'hidden', minHeight: 260, background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)' }}>
          {property.images?.[0] ? (
            <img
              src={property.images[0].url}
              alt={property.title}
              style={{ width: '100%', height: '100%', minHeight: 260, objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight={260}>
              <TypeIcon sx={{ color: '#64748B', fontSize: 64 }} />
            </Box>
          )}
        </Box>

        <Card sx={{ background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} flexWrap="wrap">
              <Box>
                <Box display="flex" gap={1} flexWrap="wrap" mb={1.5}>
                  <Chip
                    icon={<TypeIcon sx={{ color: '#93C5FD !important', fontSize: '16px !important' }} />}
                    label={typeLabels[property.type] || property.type}
                    sx={{ background: 'rgba(59,130,246,0.14)', color: '#93C5FD', fontWeight: 800 }}
                  />
                  <Chip
                    label={`${unitSummary.occupied || 0}/${unitSummary.total || 0} dolu`}
                    sx={{ background: 'rgba(16,185,129,0.14)', color: '#10B981', fontWeight: 800 }}
                  />
                </Box>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, mb: 1, lineHeight: 1.15 }}>
                  {property.title}
                </Typography>
                <Typography sx={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 0.7, flexWrap: 'wrap' }}>
                  <LocationOn sx={{ fontSize: 18, color: '#8B5CF6' }} />
                  {address.neighborhood}, {address.district}, {address.city}
                </Typography>
              </Box>
              <Box textAlign={{ xs: 'left', md: 'right' }}>
                <Typography sx={{ color: '#64748B', fontSize: 12 }}>Portföy değeri</Typography>
                <Typography sx={{ color: '#fff', fontSize: 26, fontWeight: 900 }}>{formatCurrency(property.price, property.currency)}</Typography>
                <Typography sx={{ color: '#64748B', fontSize: 12 }}>{formatCurrency(property.pricePerM2, property.currency)}/m²</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {[
                { icon: <SquareFoot />, label: 'Net Alan', value: `${property.netArea || 0} m²` },
                { icon: <Apartment />, label: 'Birim', value: unitSummary.total || 0 },
                { icon: <CalendarMonth />, label: 'Aidat', value: formatCurrency(property.dues || 0, property.currency) },
                { icon: <TrendingUp />, label: 'Doluluk', value: `%${unitSummary.occupancyRate || 0}` },
              ].map((item) => (
                <Box key={item.label} sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ color: '#93C5FD', mb: 0.75 }}>{item.icon}</Box>
                  <Typography sx={{ color: '#64748B', fontSize: 11 }}>{item.label}</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 800 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard icon={Apartment} label="Toplam Birim" value={unitSummary.total || 0} caption={`${unitSummary.vacant || 0} boş birim`} color="#3B82F6" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard icon={Person} label="Aktif Kiracı" value={tenancySummary.active || 0} caption={formatCurrency(tenancySummary.deposits || 0)} color="#10B981" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard icon={Payments} label="Aylık Kira" value={formatCurrency(tenancySummary.monthlyRent || 0)} caption={`${formatCurrency(paymentSummary.collected || 0)} tahsil edildi`} color="#8B5CF6" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard icon={ReportProblem} label="Geciken" value={formatCurrency(paymentSummary.overdue || 0)} caption={`${openMaintenance.length} açık bakım talebi`} color="#EF4444" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Panel title="Birimler">
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              {(property.units || []).map((unit) => {
                const status = unitStatusConfig[unit.status] || unitStatusConfig.VACANT;
                return (
                  <Box
                    key={unit.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr 1fr auto' },
                      gap: 1.5,
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.035)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: '#fff', fontWeight: 850 }}>{unit.unitNumber}</Typography>
                      <Typography sx={{ color: '#64748B', fontSize: 12 }}>{unit.roomCount} · {unit.netArea} m² · {unit.floor}. kat</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748B', fontSize: 12 }}>Kiracı</Typography>
                      <Typography sx={{ color: '#CBD5E1', fontWeight: 700 }}>{getTenantName(unit.activeTenancy)}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748B', fontSize: 12 }}>Tahsilat Riski</Typography>
                      <Typography sx={{ color: unit.paymentSummary?.overdue ? '#FCA5A5' : '#CBD5E1', fontWeight: 800 }}>
                        {formatCurrency(unit.paymentSummary?.overdue || unit.paymentSummary?.pending || 0)}
                      </Typography>
                    </Box>
                    <Chip label={status.label} sx={{ background: status.bg, color: status.color, fontWeight: 800 }} />
                  </Box>
                );
              })}
              {(!property.units || property.units.length === 0) && (
                <Typography sx={{ color: '#64748B' }}>Bu mülke bağlı birim bulunmuyor.</Typography>
              )}
            </Box>
          </Panel>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Panel title="Kira Dağılımı">
            {monthlyRentPerUnit.map((item) => (
              <Box key={item.label} sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" gap={2} mb={0.75}>
                  <Typography sx={{ color: '#CBD5E1', fontSize: 13, fontWeight: 800 }}>{item.label}</Typography>
                  <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{formatCurrency(item.value)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(item.value / maxRent) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 8,
                    backgroundColor: 'rgba(148,163,184,0.14)',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#8B5CF6', borderRadius: 8 },
                  }}
                />
              </Box>
            ))}
            {monthlyRentPerUnit.length === 0 && (
              <Typography sx={{ color: '#64748B' }}>Kira dağılımı için birim bulunmuyor.</Typography>
            )}
          </Panel>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Panel title="Açık Bakım Talepleri">
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              {openMaintenance.map((request) => {
                const status = maintenanceStatusConfig[request.status] || maintenanceStatusConfig.OPEN;
                const unit = (property.units || []).find(item => item.id === request.unitId);
                return (
                  <Box
                    key={request.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.9fr auto' },
                      gap: 1.5,
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(245,158,11,0.08)',
                      border: '1px solid rgba(245,158,11,0.16)',
                    }}
                  >
                    <Box display="flex" gap={1.2} alignItems="center">
                      <Avatar sx={{ background: 'rgba(245,158,11,0.16)', color: '#FBBF24' }}>
                        <Build />
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 850 }}>{request.title}</Typography>
                        <Typography sx={{ color: '#64748B', fontSize: 12 }}>{unit?.unitNumber || 'Genel'} · {request.assignedTo || 'Atanmamış'}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ color: '#CBD5E1', fontSize: 13 }}>{formatDate(request.scheduledDate || request.createdAt)}</Typography>
                    <Chip label={status.label} sx={{ background: `${status.color}22`, color: status.color, fontWeight: 800 }} />
                  </Box>
                );
              })}
              {openMaintenance.length === 0 && (
                <Typography sx={{ color: '#64748B' }}>Açık bakım talebi bulunmuyor.</Typography>
              )}
            </Box>
          </Panel>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Panel title="Tahsilat Özeti">
            {[
              ['Tahsil Edilen', paymentSummary.collected || 0, '#10B981'],
              ['Bekleyen', paymentSummary.pending || 0, '#F59E0B'],
              ['Geciken', paymentSummary.overdue || 0, '#EF4444'],
            ].map(([label, value, color]) => (
              <Box key={label} sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" gap={2} mb={0.75}>
                  <Typography sx={{ color: '#CBD5E1', fontSize: 13, fontWeight: 800 }}>{label}</Typography>
                  <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{formatCurrency(value)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={paymentSummary.total ? (value / paymentSummary.total) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 8,
                    backgroundColor: 'rgba(148,163,184,0.14)',
                    '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 8 },
                  }}
                />
              </Box>
            ))}
          </Panel>
        </Grid>
      </Grid>
    </Box>
  );
}
