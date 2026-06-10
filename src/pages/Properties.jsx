import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    Chip,
    FormControl,
    InputBase,
    LinearProgress,
    MenuItem,
    Select,
    Skeleton,
    Typography,
} from '@mui/material';
import {
    Add,
    Apartment,
    ArrowForward,
    Build,
    CheckCircle,
    HomeWork,
    MeetingRoom,
    Payments,
    Person,
    Search,
    Warning,
} from '@mui/icons-material';
import PropertyService from '../api/PropertyService';
import UnitService from '../api/UnitService';

const formatCurrency = (value) => new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
}).format(value || 0);

const statusConfig = {
    OCCUPIED: { label: 'Dolu', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', icon: CheckCircle },
    VACANT: { label: 'Boş', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', icon: MeetingRoom },
    MAINTENANCE: { label: 'Bakımda', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', icon: Build },
    RESERVED: { label: 'Rezerve', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)', icon: Warning },
};

const paymentStateConfig = {
    overdue: { label: 'Gecikmiş', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' },
    pending: { label: 'Bekliyor', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
    paid: { label: 'Düzenli', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
    vacant: { label: 'Kiracı Yok', color: '#64748B', bg: 'rgba(100, 116, 139, 0.12)' },
};

const getPaymentState = (unit) => {
    if (!unit.activeTenancy) return 'vacant';
    if (unit.paymentSummary?.overdue > 0) return 'overdue';
    if (unit.paymentSummary?.pending > 0) return 'pending';
    return 'paid';
};

const SummaryCard = ({ icon, label, value, caption, color }) => (
    <Box className="card" sx={{ p: 2.5, minHeight: 118 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Box>
                <Typography sx={{ fontSize: 12, color: '#94A3B8', mb: 0.8 }}>{label}</Typography>
                <Typography sx={{
                    fontSize: 26,
                    lineHeight: 1,
                    fontWeight: 700,
                    color: '#F1F5F9',
                    fontFamily: "'Outfit', sans-serif",
                }}>
                    {value}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#64748B', mt: 1 }}>{caption}</Typography>
            </Box>
            <Avatar sx={{ width: 42, height: 42, background: `${color}18`, color }}>
                {React.createElement(icon, { sx: { fontSize: 21 } })}
            </Avatar>
        </Box>
    </Box>
);

const StatusChip = ({ status }) => {
    const config = statusConfig[status] || statusConfig.VACANT;
    const Icon = config.icon;

    return (
        <Chip
            icon={<Icon sx={{ fontSize: '14px !important' }} />}
            label={config.label}
            size="small"
            sx={{
                height: 24,
                fontSize: 11,
                fontWeight: 700,
                color: config.color,
                background: config.bg,
                '& .MuiChip-icon': { color: config.color },
            }}
        />
    );
};

const PaymentChip = ({ state }) => {
    const config = paymentStateConfig[state] || paymentStateConfig.pending;

    return (
        <Chip
            label={config.label}
            size="small"
            sx={{
                height: 24,
                fontSize: 11,
                fontWeight: 700,
                color: config.color,
                background: config.bg,
            }}
        />
    );
};

const PropertyPortfolioCard = ({ property, units, onClick }) => {
    const primaryImage = property.images?.find(image => image.isPrimary) || property.images?.[0];
    const occupiedCount = units.filter(unit => unit.status === 'OCCUPIED').length;
    const occupancyRate = units.length ? Math.round((occupiedCount / units.length) * 100) : 0;
    const monthlyRent = units.reduce((sum, unit) => sum + (unit.activeTenancy?.monthlyRent || 0), 0);
    const overdue = units.reduce((sum, unit) => sum + (unit.paymentSummary?.overdue || 0), 0);

    return (
        <Box
            className="card"
            onClick={onClick}
            sx={{
                p: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)' },
            }}
        >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '160px 1fr' } }}>
                <Box sx={{
                    minHeight: { xs: 140, md: '100%' },
                    background: primaryImage?.url
                        ? `linear-gradient(rgba(15,23,42,0.12), rgba(15,23,42,0.2)), url(${primaryImage.url}) center/cover`
                        : 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(59,130,246,0.12))',
                }} />

                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#F1F5F9',
                                fontFamily: "'Outfit', sans-serif",
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>
                                {property.title}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.3 }}>
                                {property.address?.district}, {property.address?.city}
                            </Typography>
                        </Box>
                        <ArrowForward sx={{ fontSize: 18, color: '#64748B', flexShrink: 0 }} />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.2, mb: 1.5 }}>
                        <Box>
                            <Typography sx={{ fontSize: 11, color: '#64748B' }}>Birim</Typography>
                            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>{units.length}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 11, color: '#64748B' }}>Doluluk</Typography>
                            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}>%{occupancyRate}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 11, color: '#64748B' }}>Geciken</Typography>
                            <Typography sx={{ fontSize: 16, fontWeight: 700, color: overdue > 0 ? '#EF4444' : '#10B981' }}>
                                {formatCurrency(overdue)}
                            </Typography>
                        </Box>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={occupancyRate}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #10B981, #C9A84C)',
                            },
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.2 }}>
                        <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>
                            Aylık kira: {formatCurrency(monthlyRent)}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                            {property.referenceCode}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const UnitRow = ({ unit }) => {
    const paymentState = getPaymentState(unit);
    const tenant = unit.activeTenancy?.tenant;
    const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Atanmamış';

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    md: '1.2fr 1fr 0.9fr 0.9fr 0.8fr',
                },
                gap: 1.5,
                alignItems: 'center',
                px: 2,
                py: 1.5,
                borderTop: '1px solid rgba(255,255,255,0.04)',
                '&:hover': { background: 'rgba(255,255,255,0.02)' },
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>
                    {unit.unitNumber}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                    {unit.property?.title}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: 11, background: 'rgba(59,130,246,0.14)', color: '#3B82F6' }}>
                    {tenantName.split(' ').map(part => part[0]).join('').slice(0, 2)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12, color: '#F1F5F9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tenantName}
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: '#64748B' }}>
                        {tenant?.phone || 'Kiracı bilgisi yok'}
                    </Typography>
                </Box>
            </Box>

            <Box>
                <Typography sx={{ fontSize: 11, color: '#64748B' }}>Kira / Aidat</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9' }}>
                    {formatCurrency(unit.activeTenancy?.monthlyRent)} / {formatCurrency(unit.monthlyDues)}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                <StatusChip status={unit.status} />
                <PaymentChip state={paymentState} />
            </Box>

            <Button
                size="small"
                endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                sx={{
                    justifySelf: { xs: 'flex-start', md: 'flex-end' },
                    color: '#C9A84C',
                    textTransform: 'none',
                    fontSize: 12,
                }}
            >
                Detay
            </Button>
        </Box>
    );
};

export default function Properties() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [propertyFilter, setPropertyFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propertiesData, unitsData] = await Promise.all([
                    PropertyService.getAll(),
                    UnitService.getAll(),
                ]);
                setProperties(propertiesData.data || []);
                setUnits(unitsData.data || []);
            } catch (err) {
                console.error('Property management fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const unitsByProperty = useMemo(() => units.reduce((acc, unit) => {
        acc[unit.propertyId] = acc[unit.propertyId] || [];
        acc[unit.propertyId].push(unit);
        return acc;
    }, {}), [units]);

    const filteredUnits = units.filter((unit) => {
        const tenant = unit.activeTenancy?.tenant;
        const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : '';
        const searchable = [
            unit.unitNumber,
            unit.property?.title,
            unit.property?.address?.district,
            tenantName,
        ].filter(Boolean).join(' ').toLowerCase();

        const matchesSearch = !search || searchable.includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
        const matchesProperty = propertyFilter === 'all' || unit.propertyId === propertyFilter;

        return matchesSearch && matchesStatus && matchesProperty;
    });

    const filteredPropertyIds = new Set(filteredUnits.map(unit => unit.propertyId));
    const filteredProperties = properties.filter(property =>
        propertyFilter === 'all'
            ? filteredPropertyIds.has(property.id) || (!search && Object.keys(unitsByProperty).length === 0)
            : property.id === propertyFilter
    );

    const occupiedUnits = units.filter(unit => unit.status === 'OCCUPIED').length;
    const vacantUnits = units.filter(unit => unit.status === 'VACANT').length;
    const maintenanceUnits = units.filter(unit => unit.status === 'MAINTENANCE').length;
    const overdueAmount = units.reduce((sum, unit) => sum + (unit.paymentSummary?.overdue || 0), 0);
    const monthlyRent = units.reduce((sum, unit) => sum + (unit.activeTenancy?.monthlyRent || 0), 0);

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
                mb: 3,
                animation: 'fadeIn 0.4s ease-out',
            }}>
                <Box>
                    <Typography sx={{
                        fontSize: { xs: 22, md: 26 },
                        fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                        color: '#F1F5F9',
                    }}>
                        Mülkler & Birimler
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                        {properties.length} mülk · {units.length} birim · {occupiedUnits} aktif kiracılık
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                        height: 38,
                        textTransform: 'none',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #C9A84C, #E8D48B)',
                        color: '#0A1628',
                        boxShadow: '0 8px 20px rgba(201,168,76,0.18)',
                        '&:hover': { background: 'linear-gradient(135deg, #D8B85A, #E8D48B)' },
                    }}
                >
                    Yeni Mülk
                </Button>
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
                gap: 2,
                mb: 3,
            }}>
                <SummaryCard icon={HomeWork} label="Mülk" value={properties.length} caption="Yönetilen portföy" color="#C9A84C" />
                <SummaryCard icon={Apartment} label="Birim" value={units.length} caption={`${occupiedUnits} dolu · ${vacantUnits} boş`} color="#3B82F6" />
                <SummaryCard icon={Person} label="Aktif Kiracı" value={occupiedUnits} caption="Sözleşmesi aktif birimler" color="#10B981" />
                <SummaryCard icon={Payments} label="Aylık Kira" value={formatCurrency(monthlyRent)} caption="Beklenen kira geliri" color="#8B5CF6" />
                <SummaryCard icon={Warning} label="Geciken" value={formatCurrency(overdueAmount)} caption={`${maintenanceUnits} birim bakımda`} color="#EF4444" />
            </Box>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
                flexWrap: 'wrap',
                animation: 'fadeIn 0.4s ease-out 0.1s forwards',
                opacity: 0,
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.8,
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    flex: 1,
                    minWidth: 220,
                    maxWidth: 380,
                    '&:focus-within': { borderColor: 'rgba(201, 168, 76, 0.3)' },
                }}>
                    <Search sx={{ color: '#64748B', fontSize: 18 }} />
                    <InputBase
                        placeholder="Mülk, birim, kiracı veya lokasyon ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ flex: 1, color: '#F1F5F9', fontSize: 13, '& ::placeholder': { color: '#64748B', opacity: 1 } }}
                    />
                </Box>

                <FormControl size="small">
                    <Select
                        value={propertyFilter}
                        onChange={(e) => setPropertyFilter(e.target.value)}
                        sx={{
                            minWidth: 180,
                            height: 38,
                            color: '#F1F5F9',
                            fontSize: 13,
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                            '& .MuiSvgIcon-root': { color: '#64748B' },
                        }}
                    >
                        <MenuItem value="all">Tüm Mülkler</MenuItem>
                        {properties.map(property => (
                            <MenuItem key={property.id} value={property.id}>{property.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{
                            minWidth: 140,
                            height: 38,
                            color: '#F1F5F9',
                            fontSize: 13,
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                            '& .MuiSvgIcon-root': { color: '#64748B' },
                        }}
                    >
                        <MenuItem value="all">Tüm Durumlar</MenuItem>
                        <MenuItem value="OCCUPIED">Dolu</MenuItem>
                        <MenuItem value="VACANT">Boş</MenuItem>
                        <MenuItem value="MAINTENANCE">Bakımda</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{ display: 'grid', gap: 2 }}>
                    {[1, 2, 3].map(item => (
                        <Skeleton key={item} variant="rounded" height={160} sx={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }} />
                    ))}
                </Box>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '0.95fr 1.25fr' }, gap: 2 }}>
                    <Box sx={{ display: 'grid', gap: 2, alignContent: 'start' }}>
                        {filteredProperties.map(property => (
                            <PropertyPortfolioCard
                                key={property.id}
                                property={property}
                                units={unitsByProperty[property.id] || []}
                                onClick={() => navigate(`/properties/${property.id}`)}
                            />
                        ))}
                    </Box>

                    <Box className="card" sx={{ p: 0, overflow: 'hidden', alignSelf: 'start' }}>
                        <Box sx={{
                            px: 2.2,
                            py: 1.8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <Box>
                                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', fontFamily: "'Outfit', sans-serif" }}>
                                    Birim Takibi
                                </Typography>
                                <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                                    {filteredUnits.length} birim görüntüleniyor
                                </Typography>
                            </Box>
                            <Chip
                                label={`Doluluk %${units.length ? Math.round((occupiedUnits / units.length) * 100) : 0}`}
                                size="small"
                                sx={{ color: '#10B981', background: 'rgba(16,185,129,0.12)', fontWeight: 700 }}
                            />
                        </Box>

                        {filteredUnits.map(unit => (
                            <UnitRow key={unit.id} unit={unit} />
                        ))}

                        {filteredUnits.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
                                <Apartment sx={{ fontSize: 44, color: '#334155', mb: 1 }} />
                                <Typography sx={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>Birim bulunamadı</Typography>
                                <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.5 }}>
                                    Arama veya filtreleri değiştirerek tekrar deneyin.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
