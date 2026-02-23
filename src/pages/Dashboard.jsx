import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Chip, LinearProgress, IconButton, Tooltip } from '@mui/material';
import {
    TrendingUp, TrendingDown, Apartment, AttachMoney, Visibility, FavoriteBorder,
    Warning, Phone, CalendarMonth, AccessTime, ArrowForward, LocalFireDepartment,
    PersonAdd, Handshake, OpenInNew
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PropertyService from '../api/PropertyService';
import LeadService from '../api/LeadService';
import DashboardChart from '../components/DashboardChart';

const StatCard = ({ icon: Icon, label, value, change, changeLabel, color, delay }) => (
    <Box
        className="card"
        sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            opacity: 0,
            animation: `fadeIn 0.5s ease-out ${delay}s forwards`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${color}, transparent)`,
            }
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{
                width: 40, height: 40,
                borderRadius: '10px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Icon sx={{ fontSize: 20, color }} />
            </Box>
            {change !== undefined && (
                <Chip
                    icon={change >= 0 ? <TrendingUp sx={{ fontSize: '14px !important' }} /> : <TrendingDown sx={{ fontSize: '14px !important' }} />}
                    label={`${change >= 0 ? '+' : ''}${change}%`}
                    size="small"
                    sx={{
                        height: 24,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        background: change >= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: change >= 0 ? '#10B981' : '#EF4444',
                        border: 'none',
                        '& .MuiChip-icon': { color: 'inherit' },
                    }}
                />
            )}
        </Box>
        <Box>
            <Typography sx={{
                fontSize: 26,
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                color: '#F1F5F9',
                lineHeight: 1,
            }}>
                {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 0.5 }}>
                {label}
            </Typography>
        </Box>
    </Box>
);

const UrgentTask = ({ icon: Icon, text, time, color, onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.2,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
                background: 'rgba(239, 68, 68, 0.06)',
            }
        }}
    >
        <Box sx={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: color || '#EF4444',
            flexShrink: 0,
            animation: 'pulse-gold 2s infinite',
            boxShadow: `0 0 8px ${color || '#EF4444'}50`,
        }} />
        <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 13, color: '#F1F5F9', fontWeight: 500 }}>{text}</Typography>
            <Typography sx={{ fontSize: 11, color: '#64748B' }}>{time}</Typography>
        </Box>
        <ArrowForward sx={{ fontSize: 16, color: '#64748B' }} />
    </Box>
);

const LeadPreviewCard = ({ name, property, temperature, budget, onClick }) => {
    const tempColors = { hot: '#EF4444', warm: '#F59E0B', cold: '#3B82F6' };
    const tempLabels = { hot: 'Sıcak', warm: 'Ilık', cold: 'Soğuk' };
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.2,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { background: 'rgba(201, 168, 76, 0.05)' }
            }}
        >
            <Avatar sx={{
                width: 32, height: 32,
                fontSize: 12,
                fontWeight: 600,
                background: `${tempColors[temperature]}20`,
                color: tempColors[temperature],
            }}>
                {name?.split(' ').map(n => n[0]).join('') || 'M'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, color: '#F1F5F9', fontWeight: 500 }}>{name}</Typography>
                <Typography sx={{ fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                    {property || 'Genel talep'}
                </Typography>
            </Box>
            <Chip
                label={tempLabels[temperature]}
                size="small"
                sx={{
                    height: 22,
                    fontSize: 10,
                    fontWeight: 700,
                    background: `${tempColors[temperature]}18`,
                    color: tempColors[temperature],
                    border: 'none',
                }}
            />
        </Box>
    );
};

const PerformanceBar = ({ label, value, max, color }) => (
    <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>{label}</Typography>
            <Typography sx={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: '#F1F5F9', fontWeight: 600 }}>
                {value}
            </Typography>
        </Box>
        <LinearProgress
            variant="determinate"
            value={(value / max) * 100}
            sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.06)',
                '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${color}, ${color}AA)`,
                }
            }}
        />
    </Box>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const [propertyStats, setPropertyStats] = useState(null);
    const [leadStats, setLeadStats] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pStats, lStats, leadsData] = await Promise.all([
                    PropertyService.getStats(),
                    LeadService.getStats(),
                    LeadService.getAll(),
                ]);
                setPropertyStats(pStats);
                setLeadStats(lStats);
                setLeads(leadsData.data || []);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Günaydın';
        if (hour < 18) return 'İyi Günler';
        return 'İyi Akşamlar';
    };

    const userName = user?.firstName || user?.name || 'Kullanıcı';

    const activeLeads = leads.filter(l => !['CLOSED_WON', 'CLOSED_LOST'].includes(l.stage));
    const hotLeads = leads.filter(l => l.temperature === 'hot' && !['CLOSED_WON', 'CLOSED_LOST'].includes(l.stage));
    const warmLeads = leads.filter(l => l.temperature === 'warm' && !['CLOSED_WON', 'CLOSED_LOST'].includes(l.stage));
    const coldLeads = leads.filter(l => l.temperature === 'cold' && !['CLOSED_WON', 'CLOSED_LOST'].includes(l.stage));

    const formatPrice = (price) => {
        if (price >= 1000000) return `₺${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `₺${(price / 1000).toFixed(0)}K`;
        return `₺${price}`;
    };

    // Example chart data
    const revenueChartData = {
        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
        datasets: [
            {
                label: 'Aylık Gelir',
                data: [12000, 15000, 18000, 14000, 20000, leadStats?.totalRevenue ?? 0],
                fill: false,
                borderColor: '#10B981',
                backgroundColor: '#10B981',
                tension: 0.4,
            },
        ],
    };
    const revenueChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: 'top' },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 3, animation: 'fadeIn 0.4s ease-out' }}>
                <Typography sx={{
                    fontSize: { xs: 24, md: 28 },
                    fontWeight: 700,
                    fontFamily: "'Outfit', sans-serif",
                    color: '#F1F5F9',
                    mb: 0.5,
                }}>
                    {greeting()}, {userName} 👋
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#64748B' }}>
                    İşte bugünkü performans özetiniz ve yapılacaklar listesi.
                </Typography>
            </Box>

            {/* KPI Cards */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2,
                mb: 3,
            }}>
                <StatCard
                    icon={Apartment}
                    label="Aktif İlan"
                    value={propertyStats?.active ?? '—'}
                    change={12}
                    color="#C9A84C"
                    delay={0.1}
                />
                <StatCard
                    icon={AttachMoney}
                    label="Bu Ay Gelir"
                    value={formatPrice(leadStats?.totalRevenue ?? 0)}
                    change={8}
                    color="#10B981"
                    delay={0.15}
                />
                <StatCard
                    icon={PersonAdd}
                    label="Aktif Müşteri"
                    value={activeLeads.length}
                    change={-3}
                    color="#3B82F6"
                    delay={0.2}
                />
                <StatCard
                    icon={Handshake}
                    label="Kapanış Oranı"
                    value={`%${leadStats?.conversionRate ?? 0}`}
                    change={5}
                    color="#8B5CF6"
                    delay={0.25}
                />
            </Box>

            {/* Chart Widget */}
            <DashboardChart title="Gelir Trendleri" data={revenueChartData} options={revenueChartOptions} />

            {/* Main Grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: 2,
            }}>
                {/* Urgent Tasks */}
                <Box className="card" sx={{
                    p: 0,
                    overflow: 'hidden',
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-out 0.3s forwards',
                }}>
                    <Box sx={{
                        px: 2.5,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
                        background: 'rgba(239, 68, 68, 0.03)',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Warning sx={{ fontSize: 18, color: '#EF4444' }} />
                            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', fontFamily: "'Outfit', sans-serif" }}>
                                Acil Görevler
                            </Typography>
                        </Box>
                        <Chip label="3" size="small" sx={{
                            height: 22, fontSize: 11, fontWeight: 700,
                            background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444',
                        }} />
                    </Box>
                    <Box sx={{ py: 1 }}>
                        <UrgentTask
                            icon={Phone}
                            text="Ali Yıldırım — Geri arama bekleniyor"
                            time="2 saat önce"
                            color="#EF4444"
                            onClick={() => navigate('/crm')}
                        />
                        <UrgentTask
                            icon={CalendarMonth}
                            text="Kadıköy daire gösterimi — Bugün 14:00"
                            time="3 saat sonra"
                            color="#F59E0B"
                            onClick={() => navigate('/crm')}
                        />
                        <UrgentTask
                            icon={AccessTime}
                            text="Villa teklifi — 6 saat içinde süresi doluyor"
                            time="Teklif: ₺17.5M"
                            color="#EF4444"
                            onClick={() => navigate('/crm')}
                        />
                    </Box>
                </Box>

                {/* New Leads */}
                <Box className="card" sx={{
                    p: 0,
                    overflow: 'hidden',
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-out 0.35s forwards',
                }}>
                    <Box sx={{
                        px: 2.5,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalFireDepartment sx={{ fontSize: 18, color: '#C9A84C' }} />
                            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', fontFamily: "'Outfit', sans-serif" }}>
                                Aktif Müşteriler
                            </Typography>
                        </Box>
                        <Chip
                            label="Tümünü Gör"
                            size="small"
                            onClick={() => navigate('/crm')}
                            sx={{
                                height: 24, fontSize: 11, cursor: 'pointer',
                                background: 'rgba(201, 168, 76, 0.1)', color: '#C9A84C',
                                '&:hover': { background: 'rgba(201, 168, 76, 0.2)' }
                            }}
                        />
                    </Box>

                    {/* Temperature summary */}
                    <Box sx={{ display: 'flex', gap: 1, px: 2.5, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {[
                            { label: 'Sıcak', count: hotLeads.length, color: '#EF4444', icon: '🔥' },
                            { label: 'Ilık', count: warmLeads.length, color: '#F59E0B', icon: '🟡' },
                            { label: 'Soğuk', count: coldLeads.length, color: '#3B82F6', icon: '🔵' },
                        ].map(t => (
                            <Box key={t.label} sx={{
                                flex: 1,
                                textAlign: 'center',
                                py: 0.8,
                                borderRadius: '8px',
                                background: `${t.color}08`,
                                border: `1px solid ${t.color}15`,
                            }}>
                                <Typography sx={{ fontSize: 10 }}>{t.icon}</Typography>
                                <Typography sx={{ fontSize: 16, fontWeight: 700, color: t.color, fontFamily: "'JetBrains Mono', monospace" }}>
                                    {t.count}
                                </Typography>
                                <Typography sx={{ fontSize: 10, color: '#64748B' }}>{t.label}</Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ py: 1 }}>
                        {activeLeads.slice(0, 4).map(lead => (
                            <LeadPreviewCard
                                key={lead.id}
                                name={lead.customer ? `${lead.customer.firstName} ${lead.customer.lastName}` : 'Bilinmiyor'}
                                property={lead.property?.title}
                                temperature={lead.temperature}
                                budget={lead.budget}
                                onClick={() => navigate('/crm')}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Performance */}
                <Box className="card" sx={{
                    p: 2.5,
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-out 0.4s forwards',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                        <TrendingUp sx={{ fontSize: 18, color: '#C9A84C' }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', fontFamily: "'Outfit', sans-serif" }}>
                            Performans Metrikleri
                        </Typography>
                    </Box>

                    <PerformanceBar label="Aktif İlanlar" value={propertyStats?.active ?? 0} max={20} color="#C9A84C" />
                    <PerformanceBar label="Toplam Görüntülenme" value={propertyStats?.totalViews ?? 0} max={2000} color="#3B82F6" />
                    <PerformanceBar label="Favorilere Eklenme" value={propertyStats?.totalFavorites ?? 0} max={300} color="#EF4444" />
                    <PerformanceBar label="Kazanılan Lead" value={leadStats?.won ?? 0} max={10} color="#10B981" />
                    <PerformanceBar label="Kaybedilen Lead" value={leadStats?.lost ?? 0} max={10} color="#64748B" />
                </Box>

                {/* Recent Activity / Quick Actions */}
                <Box className="card" sx={{
                    p: 2.5,
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-out 0.45s forwards',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                        <CalendarMonth sx={{ fontSize: 18, color: '#C9A84C' }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', fontFamily: "'Outfit', sans-serif" }}>
                            Hızlı İşlemler
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                        {[
                            { icon: Apartment, label: 'Yeni İlan Ekle', color: '#C9A84C', path: '/properties' },
                            { icon: PersonAdd, label: 'Müşteri Ekle', color: '#3B82F6', path: '/crm' },
                            { icon: CalendarMonth, label: 'Randevu Oluştur', color: '#10B981', path: '/calendar' },
                            { icon: Handshake, label: 'Sözleşme Oluştur', color: '#8B5CF6', path: '/contracts' },
                        ].map((action) => (
                            <Box
                                key={action.label}
                                onClick={() => navigate(action.path)}
                                sx={{
                                    p: 2,
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    background: 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': {
                                        background: `${action.color}08`,
                                        borderColor: `${action.color}30`,
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                <Box sx={{
                                    width: 44, height: 44,
                                    borderRadius: '12px',
                                    background: `${action.color}12`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <action.icon sx={{ fontSize: 22, color: action.color }} />
                                </Box>
                                <Typography sx={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', fontWeight: 500 }}>
                                    {action.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Pipeline Summary */}
                    <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5 }}>Pipeline Özeti</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[
                                { label: 'Yeni', count: leadStats?.byStage?.NEW ?? 0, color: '#3B82F6' },
                                { label: 'İletişim', count: leadStats?.byStage?.CONTACTED ?? 0, color: '#06B6D4' },
                                { label: 'Gösterim', count: leadStats?.byStage?.VIEWING_SCHEDULED ?? 0, color: '#F59E0B' },
                                { label: 'Teklif', count: leadStats?.byStage?.OFFER_MADE ?? 0, color: '#8B5CF6' },
                            ].map(s => (
                                <Box key={s.label} sx={{ flex: 1, textAlign: 'center' }}>
                                    <Typography sx={{
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: s.color,
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}>
                                        {s.count}
                                    </Typography>
                                    <Typography sx={{ fontSize: 10, color: '#64748B' }}>{s.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
