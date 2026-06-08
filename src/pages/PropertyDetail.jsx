import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Avatar, Box, Button, Chip, Divider, IconButton, Skeleton, Tooltip, Typography
} from '@mui/material';
import {
    Apartment, ArrowBack, BathtubOutlined, BedOutlined, Business, CalendarMonth,
    CheckCircle, ChevronLeft, ChevronRight, ContentCopy, Email, Explore,
    FavoriteBorder, HomeWork, Landscape, LocalParking, LocationOn, Map,
    Phone, Share, SquareFoot, Store, Visibility, Villa, Warehouse, WhatsApp
} from '@mui/icons-material';
import PropertyService from '../api/PropertyService';

const typeIcons = {
    apartment: Apartment,
    villa: Villa,
    office: Business,
    land: Landscape,
    shop: Store,
    warehouse: Warehouse,
};

const typeLabels = {
    apartment: 'Daire',
    villa: 'Villa',
    office: 'Ofis',
    land: 'Arazi',
    shop: 'Dükkan',
    warehouse: 'Depo',
};

const listingTypeConfig = {
    sale: { label: 'Satılık', color: '#C9A84C' },
    rent: { label: 'Kiralık', color: '#3B82F6' },
    daily_rent: { label: 'Günlük', color: '#10B981' },
    lease_transfer: { label: 'Devren', color: '#8B5CF6' },
};

const statusConfig = {
    active: { label: 'Aktif', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
    reserved: { label: 'Rezerve', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
    sold: { label: 'Satıldı', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' },
    rented: { label: 'Kiralandı', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.12)' },
    withdrawn: { label: 'Çekildi', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.12)' },
    draft: { label: 'Taslak', color: '#CBD5E1', bg: 'rgba(203, 213, 225, 0.12)' },
};

const parkingLabels = {
    none: 'Yok',
    open: 'Açık Otopark',
    closed: 'Kapalı Otopark',
    garage: 'Garaj',
};

const furnishedLabels = {
    unfurnished: 'Eşyasız',
    semi: 'Yarı Eşyalı',
    fully: 'Eşyalı',
};

const heatingLabels = {
    central: 'Merkezi',
    combi: 'Kombi',
    floor: 'Yerden Isıtma',
    stove: 'Soba',
    ac: 'Klima',
    none: 'Yok',
};

const deedLabels = {
    title_deed: 'Kat Mülkiyeti',
    cooperative: 'Kooperatif',
    easement: 'İrtifak',
    floor_easement: 'Kat İrtifakı',
};

const orientationLabels = {
    north: 'Kuzey',
    south: 'Güney',
    east: 'Doğu',
    west: 'Batı',
};

const formatPrice = (price, currency = 'TRY') => (
    new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(price || 0)
);

const formatCompactPrice = (price, currency = 'TRY') => {
    if (!price) return '—';
    if (currency !== 'TRY') return formatPrice(price, currency);
    if (price >= 1000000) return `₺${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `₺${Math.round(price / 1000)}K`;
    return `₺${price}`;
};

const DetailPanel = ({ children, sx = {} }) => (
    <Box
        sx={{
            borderRadius: '12px',
            background: 'var(--color-surface-card)',
            border: '1px solid rgba(255,255,255,0.06)',
            ...sx,
        }}
    >
        {children}
    </Box>
);

const ActionButton = ({ icon, label, color = '#C9A84C', variant = 'soft' }) => (
    <Button
        fullWidth
        startIcon={icon}
        variant={variant === 'solid' ? 'contained' : 'outlined'}
        sx={{
            justifyContent: 'flex-start',
            borderRadius: '10px',
            py: 1.1,
            px: 1.5,
            color: variant === 'solid' ? '#0A1628' : color,
            background: variant === 'solid' ? color : `${color}12`,
            borderColor: `${color}45`,
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
                background: variant === 'solid' ? '#E8D48B' : `${color}1f`,
                borderColor: color,
            },
        }}
    >
        {label}
    </Button>
);

const SpecItem = ({ icon, label, value }) => (
    <Box
        sx={{
            p: 1.5,
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.05)',
            minHeight: 82,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}
    >
        <Box sx={{ color: '#C9A84C', display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Box>
            <Typography sx={{ fontSize: 11, color: '#64748B', mb: 0.3 }}>{label}</Typography>
            <Typography sx={{ fontSize: 13, color: '#F1F5F9', fontWeight: 700 }}>{value || '—'}</Typography>
        </Box>
    </Box>
);

const SimilarPropertyCard = ({ property, onClick }) => {
    const image = property.images?.find((item) => item.isPrimary) || property.images?.[0];

    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'grid',
                gridTemplateColumns: '92px 1fr',
                gap: 1.2,
                p: 1,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { background: 'rgba(255,255,255,0.035)' },
            }}
        >
            <Box sx={{ width: 92, height: 68, borderRadius: '8px', overflow: 'hidden', background: '#0F172A' }}>
                {image && (
                    <img
                        src={image.url}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#F1F5F9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mb: 0.4,
                }}>
                    {property.title}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#64748B', mb: 0.7 }}>
                    {property.address?.district}, {property.address?.city}
                </Typography>
                <Typography sx={{
                    fontSize: 12,
                    color: '#C9A84C',
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', monospace",
                }}>
                    {formatCompactPrice(property.price, property.currency)}
                </Typography>
            </Box>
        </Box>
    );
};

export default function PropertyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        let mounted = true;

        const fetchProperty = async () => {
            setLoading(true);
            setError('');

            try {
                const data = await PropertyService.getById(id);
                if (!mounted) return;
                setProperty(data);
                setActiveImageIndex(0);
            } catch (err) {
                if (!mounted) return;
                setError(err?.response?.data?.error || 'İlan detayları yüklenemedi');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProperty();

        return () => {
            mounted = false;
        };
    }, [id]);

    const images = property?.images || [];
    const activeImage = images[activeImageIndex] || images[0];
    const TypeIcon = typeIcons[property?.type] || Apartment;
    const listing = listingTypeConfig[property?.listingType] || listingTypeConfig.sale;
    const status = statusConfig[property?.status] || statusConfig.active;

    const specs = useMemo(() => {
        if (!property) return [];

        return [
            { label: 'Oda', value: property.roomCount, icon: <BedOutlined sx={{ fontSize: 19 }} /> },
            { label: 'Net Alan', value: `${property.netArea} m²`, icon: <SquareFoot sx={{ fontSize: 19 }} /> },
            { label: 'Kat', value: property.totalFloors ? `${property.floor}/${property.totalFloors}` : '—', icon: <HomeWork sx={{ fontSize: 19 }} /> },
            { label: 'Banyo', value: property.bathrooms, icon: <BathtubOutlined sx={{ fontSize: 19 }} /> },
            { label: 'Otopark', value: parkingLabels[property.parkingType], icon: <LocalParking sx={{ fontSize: 19 }} /> },
            { label: 'Bina Yaşı', value: property.buildingAge === 0 ? 'Yeni' : `${property.buildingAge} yıl`, icon: <CalendarMonth sx={{ fontSize: 19 }} /> },
            { label: 'Isıtma', value: heatingLabels[property.heatingType], icon: <CheckCircle sx={{ fontSize: 19 }} /> },
            { label: 'Cephe', value: property.orientation?.map((item) => orientationLabels[item]).filter(Boolean).join(', '), icon: <Explore sx={{ fontSize: 19 }} /> },
            { label: 'Tapu', value: deedLabels[property.deedStatus], icon: <ContentCopy sx={{ fontSize: 19 }} /> },
            { label: 'Eşya', value: furnishedLabels[property.furnished], icon: <Apartment sx={{ fontSize: 19 }} /> },
            { label: 'Site İçi', value: property.withinSite ? 'Evet' : 'Hayır', icon: <HomeWork sx={{ fontSize: 19 }} /> },
            { label: 'Kredi', value: property.eligibleForCredit ? 'Uygun' : 'Uygun değil', icon: <CheckCircle sx={{ fontSize: 19 }} /> },
        ];
    }, [property]);

    const handleImageStep = (direction) => {
        if (!images.length) return;
        setActiveImageIndex((current) => (current + direction + images.length) % images.length);
    };

    if (loading) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1500, mx: 'auto' }}>
                <Skeleton variant="rounded" height={34} sx={{ maxWidth: 360, mb: 2, background: 'rgba(255,255,255,0.05)' }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' }, gap: 2 }}>
                    <Skeleton variant="rounded" height={520} sx={{ borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
                    <Skeleton variant="rounded" height={420} sx={{ borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
                </Box>
            </Box>
        );
    }

    if (error || !property) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/properties')}
                    sx={{ color: '#94A3B8', textTransform: 'none', mb: 2 }}
                >
                    İlanlara Dön
                </Button>
                <DetailPanel sx={{ p: 4, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 18, color: '#F1F5F9', fontWeight: 700, mb: 1 }}>
                        İlan bulunamadı
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>{error}</Typography>
                </DetailPanel>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1500, mx: 'auto' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
                mb: 2,
                flexWrap: 'wrap',
                animation: 'fadeIn 0.35s ease-out',
            }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/properties')}
                    sx={{
                        color: '#94A3B8',
                        textTransform: 'none',
                        borderRadius: '10px',
                        '&:hover': { color: '#C9A84C', background: 'rgba(201,168,76,0.08)' },
                    }}
                >
                    İlanlara Dön
                </Button>
                <Box sx={{ display: 'flex', gap: 0.8 }}>
                    <Tooltip title="Favorilere Ekle" arrow>
                        <IconButton sx={{ color: '#94A3B8', background: 'rgba(255,255,255,0.04)' }}>
                            <FavoriteBorder sx={{ fontSize: 19 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Paylaş" arrow>
                        <IconButton sx={{ color: '#94A3B8', background: 'rgba(255,255,255,0.04)' }}>
                            <Share sx={{ fontSize: 19 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 370px' },
                gap: 2,
                alignItems: 'start',
            }}>
                <Box sx={{ minWidth: 0 }}>
                    <DetailPanel sx={{ overflow: 'hidden', animation: 'fadeIn 0.4s ease-out' }}>
                        <Box sx={{
                            position: 'relative',
                            height: { xs: 330, md: 520 },
                            background: '#0A1628',
                        }}>
                            {activeImage && (
                                <img
                                    src={activeImage.url}
                                    alt={activeImage.caption || property.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            )}
                            <Box sx={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(180deg, rgba(0,0,0,0.18), transparent 35%, rgba(0,0,0,0.55))',
                                pointerEvents: 'none',
                            }} />
                            <Box sx={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                                <Chip label={listing.label} sx={{ background: listing.color, color: '#fff', fontWeight: 800, height: 26 }} />
                                <Chip label={status.label} sx={{ background: status.bg, color: status.color, fontWeight: 800, height: 26 }} />
                                <Chip
                                    icon={<TypeIcon sx={{ color: '#fff !important', fontSize: '15px !important' }} />}
                                    label={typeLabels[property.type]}
                                    sx={{ background: 'rgba(0,0,0,0.48)', color: '#fff', fontWeight: 700, height: 26 }}
                                />
                            </Box>

                            {images.length > 1 && (
                                <>
                                    <IconButton
                                        onClick={() => handleImageStep(-1)}
                                        sx={{
                                            position: 'absolute',
                                            left: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'rgba(10,22,40,0.68)',
                                            color: '#F1F5F9',
                                            '&:hover': { background: 'rgba(10,22,40,0.88)' },
                                        }}
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleImageStep(1)}
                                        sx={{
                                            position: 'absolute',
                                            right: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'rgba(10,22,40,0.68)',
                                            color: '#F1F5F9',
                                            '&:hover': { background: 'rgba(10,22,40,0.88)' },
                                        }}
                                    >
                                        <ChevronRight />
                                    </IconButton>
                                </>
                            )}

                            <Box sx={{
                                position: 'absolute',
                                left: 18,
                                right: 18,
                                bottom: 16,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'end',
                                gap: 2,
                            }}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{
                                        color: '#F1F5F9',
                                        fontSize: { xs: 19, md: 25 },
                                        fontWeight: 800,
                                        fontFamily: "'Outfit', sans-serif",
                                        textShadow: '0 2px 12px rgba(0,0,0,0.45)',
                                        lineHeight: 1.2,
                                    }}>
                                        {property.title}
                                    </Typography>
                                    <Typography sx={{
                                        color: '#CBD5E1',
                                        fontSize: 13,
                                        mt: 0.8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                    }}>
                                        <LocationOn sx={{ fontSize: 16 }} />
                                        {property.address?.neighborhood}, {property.address?.district}, {property.address?.city}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    px: 1.2,
                                    py: 0.7,
                                    borderRadius: '8px',
                                    background: 'rgba(0,0,0,0.48)',
                                    color: '#F1F5F9',
                                    fontSize: 12,
                                    flexShrink: 0,
                                }}>
                                    {activeImageIndex + 1}/{images.length || 1}
                                </Box>
                            </Box>
                        </Box>
                    </DetailPanel>

                    {images.length > 1 && (
                        <Box sx={{
                            mt: 1.2,
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)' },
                            gap: 1,
                            animation: 'fadeIn 0.45s ease-out',
                        }}>
                            {images.map((image, index) => (
                                <Box
                                    key={`${image.url}-${index}`}
                                    onClick={() => setActiveImageIndex(index)}
                                    sx={{
                                        height: 82,
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: index === activeImageIndex ? '2px solid #C9A84C' : '1px solid rgba(255,255,255,0.07)',
                                        opacity: index === activeImageIndex ? 1 : 0.68,
                                        transition: 'all 0.2s ease',
                                        '&:hover': { opacity: 1 },
                                    }}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.caption || property.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}

                    <DetailPanel sx={{ p: 2, mt: 2, animation: 'fadeIn 0.48s ease-out' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 1 }}>
                            {specs.map((spec) => (
                                <SpecItem key={spec.label} {...spec} />
                            ))}
                        </Box>
                    </DetailPanel>

                    {property.features?.length > 0 && (
                        <DetailPanel sx={{ p: 2.2, mt: 2, animation: 'fadeIn 0.52s ease-out' }}>
                            <Typography sx={{ color: '#F1F5F9', fontWeight: 800, fontSize: 16, mb: 1.5, fontFamily: "'Outfit', sans-serif" }}>
                                Özellikler
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                                {property.features.map((feature) => (
                                    <Chip
                                        key={feature.id}
                                        label={feature.name}
                                        sx={{
                                            borderRadius: '7px',
                                            background: 'rgba(201,168,76,0.1)',
                                            color: '#E8D48B',
                                            border: '1px solid rgba(201,168,76,0.18)',
                                            fontWeight: 700,
                                        }}
                                    />
                                ))}
                            </Box>
                        </DetailPanel>
                    )}

                    <DetailPanel sx={{ p: 2.2, mt: 2, animation: 'fadeIn 0.56s ease-out' }}>
                        <Typography sx={{ color: '#F1F5F9', fontWeight: 800, fontSize: 16, mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                            Açıklama
                        </Typography>
                        <Typography sx={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.8 }}>
                            {property.description}
                        </Typography>
                    </DetailPanel>

                    <DetailPanel sx={{ p: 2.2, mt: 2, animation: 'fadeIn 0.6s ease-out' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Map sx={{ color: '#C9A84C', fontSize: 19 }} />
                            <Typography sx={{ color: '#F1F5F9', fontWeight: 800, fontSize: 16, fontFamily: "'Outfit', sans-serif" }}>
                                Konum
                            </Typography>
                        </Box>
                        <Box sx={{
                            minHeight: 240,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08)), #0A1628',
                            border: '1px solid rgba(255,255,255,0.06)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
                                backgroundSize: '38px 38px',
                            }} />
                            <Box sx={{ textAlign: 'center', position: 'relative', px: 2 }}>
                                <LocationOn sx={{ fontSize: 42, color: '#C9A84C', filter: 'drop-shadow(0 6px 16px rgba(201,168,76,0.35))' }} />
                                <Typography sx={{ color: '#F1F5F9', fontSize: 14, fontWeight: 800, mt: 0.8 }}>
                                    {property.address?.street} {property.address?.buildingNo}
                                </Typography>
                                <Typography sx={{ color: '#94A3B8', fontSize: 12, mt: 0.3 }}>
                                    {property.coordinates?.lat}, {property.coordinates?.lng}
                                </Typography>
                            </Box>
                        </Box>
                    </DetailPanel>
                </Box>

                <Box sx={{ position: { lg: 'sticky' }, top: 82, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <DetailPanel sx={{ p: 2.2, animation: 'fadeIn 0.42s ease-out' }}>
                        <Typography sx={{
                            fontSize: 28,
                            fontWeight: 900,
                            color: '#C9A84C',
                            fontFamily: "'JetBrains Mono', monospace",
                            lineHeight: 1.1,
                        }}>
                            {formatPrice(property.price, property.currency)}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.6, fontFamily: "'JetBrains Mono', monospace" }}>
                            {formatPrice(property.pricePerM2, property.currency)}/m²
                        </Typography>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />

                        <Box sx={{ display: 'grid', gap: 1 }}>
                            <ActionButton icon={<Phone />} label="Danışmanı Ara" color="#10B981" variant="solid" />
                            <ActionButton icon={<WhatsApp />} label="WhatsApp" color="#10B981" />
                            <ActionButton icon={<Email />} label="Talep Gönder" color="#3B82F6" />
                        </Box>
                    </DetailPanel>

                    {property.agent && (
                        <DetailPanel sx={{ p: 2.2, animation: 'fadeIn 0.48s ease-out' }}>
                            <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.2, fontWeight: 700 }}>
                                Danışman
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
                                <Avatar sx={{
                                    width: 46,
                                    height: 46,
                                    background: 'linear-gradient(135deg, #C9A84C, #E8D48B)',
                                    color: '#0A1628',
                                    fontSize: 15,
                                    fontWeight: 900,
                                }}>
                                    {property.agent.firstName?.[0]}{property.agent.lastName?.[0]}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: 14, color: '#F1F5F9', fontWeight: 800 }}>
                                        {property.agent.firstName} {property.agent.lastName}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                                        {property.agent.phone}
                                    </Typography>
                                </Box>
                            </Box>
                        </DetailPanel>
                    )}

                    <DetailPanel sx={{ p: 2.2, animation: 'fadeIn 0.54s ease-out' }}>
                        <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.2, fontWeight: 700 }}>
                            İlan Bilgileri
                        </Typography>
                        {[
                            ['Referans', property.referenceCode],
                            ['Brüt / Net', `${property.grossArea} / ${property.netArea} m²`],
                            ['Aidat', property.dues ? formatPrice(property.dues, property.currency) : 'Yok'],
                            ['Depozito', property.rentDeposit ? formatPrice(property.rentDeposit, property.currency) : '—'],
                            ['Takas', property.swapAvailable ? 'Var' : 'Yok'],
                        ].map(([label, value]) => (
                            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, py: 0.85 }}>
                                <Typography sx={{ fontSize: 12, color: '#64748B' }}>{label}</Typography>
                                <Typography sx={{ fontSize: 12, color: '#F1F5F9', fontWeight: 700, textAlign: 'right' }}>{value}</Typography>
                            </Box>
                        ))}
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1 }} />
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Visibility sx={{ color: '#64748B', fontSize: 16 }} />
                                <Typography sx={{ color: '#64748B', fontSize: 12 }}>{property.viewCount}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <FavoriteBorder sx={{ color: '#64748B', fontSize: 16 }} />
                                <Typography sx={{ color: '#64748B', fontSize: 12 }}>{property.favoriteCount}</Typography>
                            </Box>
                        </Box>
                    </DetailPanel>

                    {property.similar?.length > 0 && (
                        <DetailPanel sx={{ p: 1.2, animation: 'fadeIn 0.6s ease-out' }}>
                            <Typography sx={{ fontSize: 13, color: '#F1F5F9', fontWeight: 800, px: 1, py: 0.8 }}>
                                Benzer İlanlar
                            </Typography>
                            {property.similar.map((item) => (
                                <SimilarPropertyCard
                                    key={item.id}
                                    property={item}
                                    onClick={() => navigate(`/properties/${item.id}`)}
                                />
                            ))}
                        </DetailPanel>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
