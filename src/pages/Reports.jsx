import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Apartment,
  Assessment,
  HomeWork,
  Payments,
  ReportProblem,
  TrendingUp,
} from '@mui/icons-material';
import ReportService from '../api/ReportService';

const formatCurrency = (value) => new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
}).format(value || 0);

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('tr-TR').format(new Date(value))
  : '-';

const statusLabels = {
  PAID: 'Ödendi',
  VERIFIED: 'Onaylandı',
  PENDING: 'Bekliyor',
  OVERDUE: 'Gecikti',
};

const typeLabels = {
  RENT: 'Kira',
  DUES: 'Aidat',
  DEPOSIT: 'Depozito',
  MAINTENANCE: 'Bakım',
};

const metricColors = {
  green: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.14)' },
  blue: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.14)' },
  amber: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.14)' },
  red: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.14)' },
  violet: { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.14)' },
};

const clampPercent = (value) => Math.max(0, Math.min(100, Number(value) || 0));

const MetricCard = ({ icon, label, value, caption, tone = 'blue' }) => {
  const palette = metricColors[tone] || metricColors.blue;

  return (
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
            <Typography sx={{ color: '#fff', fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>{value}</Typography>
            <Typography sx={{ color: '#64748B', fontSize: 12, mt: 1 }}>{caption}</Typography>
          </Box>
          <Avatar sx={{ background: palette.bg, color: palette.color }}>
            {React.createElement(icon)}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const Section = ({ title, children }) => (
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

const AmountBar = ({ label, value, max, color = '#3B82F6', caption }) => {
  const percent = max ? clampPercent((value / max) * 100) : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="baseline" gap={2} mb={0.75}>
        <Typography sx={{ color: '#CBD5E1', fontSize: 13, fontWeight: 700 }}>{label}</Typography>
        <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{formatCurrency(value)}</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 8,
          backgroundColor: 'rgba(148,163,184,0.14)',
          '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 8 },
        }}
      />
      {caption && <Typography sx={{ color: '#64748B', fontSize: 11, mt: 0.5 }}>{caption}</Typography>}
    </Box>
  );
};

export default function Reports() {
  const [financial, setFinancial] = useState(null);
  const [occupancy, setOccupancy] = useState(null);
  const [payments, setPayments] = useState(null);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      const [financialData, occupancyData, paymentsData] = await Promise.all([
        ReportService.getFinancial(),
        ReportService.getOccupancy(),
        ReportService.getPayments(),
      ]);
      setFinancial(financialData);
      setOccupancy(occupancyData);
      setPayments(paymentsData);
      setError('');
    } catch (err) {
      console.error('Reports fetch error:', err);
      setError('Rapor verileri yüklenemedi');
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchReports);
  }, []);

  const monthlyMax = useMemo(() => {
    const series = financial?.monthlySeries || [];
    return Math.max(1, ...series.flatMap(item => [item.income || 0, item.expense || 0]));
  }, [financial]);

  const statusMax = useMemo(() => {
    const values = Object.values(payments?.byStatus || {});
    return Math.max(1, ...values);
  }, [payments]);

  const typeMax = useMemo(() => {
    const values = Object.values(payments?.byType || {});
    return Math.max(1, ...values);
  }, [payments]);

  if (!financial || !occupancy || !payments) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', py: 4, px: { xs: 2, md: 4 } }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography sx={{ color: '#64748B' }}>Rapor verileri yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', py: 4, px: { xs: 2, md: 4 } }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 56, height: 56, background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
            <Assessment sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>Raporlar</Typography>
            <Typography sx={{ color: 'rgba(148,163,184,0.82)' }}>
              Tahsilat, doluluk ve operasyon performansı
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`Tahsilat oranı %${financial.collectionRate}`}
          sx={{ background: 'rgba(16,185,129,0.14)', color: '#10B981', fontWeight: 800 }}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard icon={AccountBalanceWallet} label="Beklenen Kira" value={formatCurrency(financial.expectedRent)} caption="Aktif kiracılıklardan" tone="blue" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard icon={Payments} label="Tahsil Edilen" value={formatCurrency(financial.collected)} caption="Ödenen ve onaylanan" tone="green" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard icon={ReportProblem} label="Geciken" value={formatCurrency(financial.overdue)} caption={`${payments.overdueItems?.length || 0} geciken kalem`} tone="red" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard icon={Apartment} label="Doluluk" value={`%${occupancy.occupancyRate}`} caption={`${occupancy.occupied}/${occupancy.totalUnits} birim dolu`} tone="violet" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Section title="Aylık Gelir / Gider">
            {(financial.monthlySeries || []).map((item) => (
              <Box key={item.month} sx={{ mb: 2.25 }}>
                <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 800, mb: 1 }}>{item.month}</Typography>
                <AmountBar label="Gelir" value={item.income} max={monthlyMax} color="#10B981" />
                <AmountBar label="Gider" value={item.expense} max={monthlyMax} color="#EF4444" />
              </Box>
            ))}
          </Section>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Section title="Finans Özeti">
            <AmountBar label="Bekleyen Tahsilat" value={financial.pending} max={financial.expectedRent || 1} color="#F59E0B" />
            <AmountBar label="Bakım Tahmini" value={financial.maintenanceEstimated} max={financial.expectedRent || 1} color="#EF4444" />
            <AmountBar label="Net Projeksiyon" value={financial.netProjected} max={financial.expectedRent || 1} color="#3B82F6" />

            <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.18)' }}>
              <Typography sx={{ color: '#93C5FD', fontSize: 12, mb: 0.5 }}>Toplam ödeme hacmi</Typography>
              <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>{formatCurrency(payments.totalAmount)}</Typography>
            </Box>
          </Section>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Section title="Portföy Doluluğu">
            {(occupancy.byProperty || []).map((property) => (
              <Box key={property.propertyId} sx={{ mb: 2.25 }}>
                <Box display="flex" justifyContent="space-between" gap={2} mb={0.75}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <HomeWork sx={{ color: '#3B82F6', fontSize: 18 }} />
                    <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{property.propertyTitle}</Typography>
                  </Box>
                  <Typography sx={{ color: '#CBD5E1', fontSize: 13 }}>
                    {property.occupiedUnits}/{property.totalUnits} birim
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={clampPercent(property.occupancyRate)}
                  sx={{
                    height: 9,
                    borderRadius: 8,
                    backgroundColor: 'rgba(148,163,184,0.14)',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#8B5CF6', borderRadius: 8 },
                  }}
                />
              </Box>
            ))}
            <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
              <Chip label={`${occupancy.vacant} boş`} sx={{ background: 'rgba(59,130,246,0.12)', color: '#93C5FD', fontWeight: 700 }} />
              <Chip label={`${occupancy.maintenance} bakımda`} sx={{ background: 'rgba(245,158,11,0.12)', color: '#FBBF24', fontWeight: 700 }} />
            </Box>
          </Section>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Section title="Ödeme Dağılımı">
            {Object.entries(payments.byStatus || {}).map(([status, amount]) => (
              <AmountBar
                key={status}
                label={statusLabels[status] || status}
                value={amount}
                max={statusMax}
                color={status === 'OVERDUE' ? '#EF4444' : status === 'PENDING' ? '#F59E0B' : '#10B981'}
              />
            ))}
            <Box sx={{ height: 1, background: 'rgba(255,255,255,0.08)', my: 2 }} />
            {Object.entries(payments.byType || {}).map(([type, amount]) => (
              <AmountBar
                key={type}
                label={typeLabels[type] || type}
                value={amount}
                max={typeMax}
                color="#3B82F6"
              />
            ))}
          </Section>
        </Grid>

        <Grid item xs={12}>
          <Section title="Geciken Kalemler">
            <Box sx={{ display: 'grid', gap: 1.25 }}>
              {(payments.overdueItems || []).map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.3fr 0.8fr 0.8fr auto' },
                    gap: 1.5,
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.16)',
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 800 }}>{item.title}</Typography>
                  <Typography sx={{ color: '#CBD5E1', fontSize: 13 }}>{typeLabels[item.type] || item.type}</Typography>
                  <Typography sx={{ color: '#CBD5E1', fontSize: 13 }}>{formatDate(item.dueDate)}</Typography>
                  <Typography sx={{ color: '#FCA5A5', fontWeight: 900 }}>{formatCurrency(item.amount)}</Typography>
                </Box>
              ))}
              {(!payments.overdueItems || payments.overdueItems.length === 0) && (
                <Typography sx={{ color: '#64748B' }}>Geciken ödeme bulunmuyor.</Typography>
              )}
            </Box>
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
}
