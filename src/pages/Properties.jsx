import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Chip, IconButton, InputBase, Select, MenuItem,
    FormControl, Avatar, Tooltip, Skeleton, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
    Search, FilterList, ViewModule, ViewList, Apartment, Villa, Business,
    Landscape, Store, Warehouse, FavoriteBorder, Favorite, Visibility,
    BedOutlined, BathtubOutlined, SquareFoot, Add
} from '@mui/icons-material';
import PropertyService from '../api/PropertyService';

const typeIcons = {
    apartment: Apartment, villa: Villa, office: Business,
    land: Landscape, shop: Store, warehouse: Warehouse,
};

const typeLabels = {
    apartment: 'Daire', villa: 'Villa', office: 'Ofis',
    land: 'Arazi', shop: 'Dükkan', warehouse: 'Depo',
};

const statusConfig = {
    active: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', label: 'Aktif' },
    reserved: { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', label: 'Rezerve' },
    sold: { bg: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', label: 'Satıldı' },
    rented: { bg: 'rgba(99, 102, 241, 0.12)', color: '#6366F1', label: 'Kiralandı' },
    withdrawn: { bg: 'rgba(107, 114, 128, 0.12)', color: '#6B7280', label: 'Çekildi' },
    draft: { bg: 'rgba(203, 213, 225, 0.12)', color: '#CBD5E1', label: 'Taslak' },
};

const listingTypeConfig = {
    sale: { label: 'Satılık', color: '#C9A84C' },
    rent: { label: 'Kiralık', color: '#3B82F6' },
    daily_rent: { label: 'Günlük', color: '#10B981' },
};

const formatPrice = (price, currency = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency', currency, maximumFractionDigits: 0,
    }).format(price);
};

const PropertyCard = ({ property, viewMode, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const [liked, setLiked] = useState(false);
    const primaryImage = property.images?.find(i => i.isPrimary) || property.images?.[0];
    const status = statusConfig[property.status] || statusConfig.active;
    const listing = listingTypeConfig[property.listingType] || listingTypeConfig.sale;
    const TypeIcon = typeIcons[property.type] || Apartment;

    if (viewMode === 'list') {
        return (
            <Box
                onClick={onClick}
                sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    borderRadius: '12px',
                    background: 'var(--color-surface-card)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                        borderColor: 'rgba(201, 168, 76, 0.2)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        transform: 'translateY(-1px)',
                    }
                }}
            >
                {/* Image */}
                <Box sx={{
                    width: 200, height: 140, flexShrink: 0,
                    borderRadius: '10px', overflow: 'hidden', position: 'relative',
                }}>
                    <img
                        src={primaryImage?.url}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Chip
                        label={listing.label}
                        size="small"
                        sx={{
                            position: 'absolute', top: 8, left: 8,
                            height: 22, fontSize: 10, fontWeight: 700,
                            background: listing.color, color: '#fff',
                        }}
                    />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9', fontFamily: "'Outfit', sans-serif", flex: 1 }}>
                                {property.title}
                            </Typography>
                            <Chip label={status.label} size="small" sx={{ height: 22, fontSize: 10, fontWeight: 700, background: status.bg, color: status.color }} />
                        </Box>
                        <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1 }}>
                            📍 {property.address?.district}, {property.address?.city} · {property.referenceCode}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TypeIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                            <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>{typeLabels[property.type] || property.type}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <BathtubOutlined sx={{ fontSize: 16, color: '#94A3B8' }} />
                            <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>{property.bathrooms}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <SquareFoot sx={{ fontSize: 16, color: '#94A3B8' }} />
                            <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>{property.netArea} m²</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility sx={{ fontSize: 14, color: '#64748B' }} />
                            <Typography sx={{ fontSize: 11, color: '#64748B' }}>{property.viewCount}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                        <Typography sx={{
                            fontSize: 20, fontWeight: 700, color: '#C9A84C',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            {formatPrice(property.price)}
                        </Typography>
                        {property.agent && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <Avatar sx={{ width: 24, height: 24, fontSize: 10, background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                                    {property.agent.firstName?.[0]}{property.agent.lastName?.[0]}
                                </Avatar>
                                <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>
                                    {property.agent.firstName} {property.agent.lastName}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    }

    // Grid view
    return (
        <Box
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                borderRadius: '12px',
                background: 'var(--color-surface-card)',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: 'rgba(201, 168, 76, 0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    transform: 'translateY(-4px)',
                }
            }}
        >
            {/* Image */}
            <Box sx={{ position: 'relative', paddingTop: '65%', overflow: 'hidden' }}>
                <img
                    src={primaryImage?.url}
                    alt={property.title}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        transform: hovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                />
                {/* Gradient overlay */}
                <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '50%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                }} />

                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 0.5 }}>
                    <Chip
                        label={listing.label}
                        size="small"
                        sx={{
                            height: 24, fontSize: 10, fontWeight: 700,
                            background: listing.color, color: '#fff',
                            backdropFilter: 'blur(4px)',
                        }}
                    />
                    <Chip
                        label={typeLabels[property.type]}
                        size="small"
                        sx={{
                            height: 24, fontSize: 10, fontWeight: 600,
                            background: 'rgba(0,0,0,0.5)', color: '#fff',
                            backdropFilter: 'blur(4px)',
                        }}
                    />
                </Box>

                {/* Favorite */}
                <IconButton
                    onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                    sx={{
                        position: 'absolute', top: 8, right: 8,
                        width: 32, height: 32,
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': { background: 'rgba(0,0,0,0.6)' }
                    }}
                >
                    {liked
                        ? <Favorite sx={{ fontSize: 16, color: '#EF4444' }} />
                        : <FavoriteBorder sx={{ fontSize: 16, color: '#fff' }} />
                    }
                </IconButton>

                {/* Price overlay */}
                <Typography sx={{
                    position: 'absolute', bottom: 10, left: 12,
                    fontSize: 18, fontWeight: 700, color: '#fff',
                    fontFamily: "'JetBrains Mono', monospace",
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }}>
                    {formatPrice(property.price)}
                </Typography>

                {/* Image count */}
                <Box sx={{
                    position: 'absolute', bottom: 10, right: 12,
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    background: 'rgba(0,0,0,0.5)', borderRadius: '6px',
                    px: 1, py: 0.3, backdropFilter: 'blur(4px)',
                }}>
                    <Typography sx={{ fontSize: 10, color: '#fff' }}>📷 {property.images?.length || 0}</Typography>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2 }}>
                <Typography sx={{
                    fontSize: 14, fontWeight: 600, color: '#F1F5F9', mb: 0.5,
                    fontFamily: "'Outfit', sans-serif",
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {property.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#64748B', mb: 1.5 }}>
                    📍 {property.address?.district}, {property.address?.city}
                </Typography>

                {/* Specs */}
                <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <BedOutlined sx={{ fontSize: 15, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{property.roomCount}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <BathtubOutlined sx={{ fontSize: 15, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{property.bathrooms}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <SquareFoot sx={{ fontSize: 15, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{property.netArea} m²</Typography>
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                    {property.agent && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Avatar sx={{ width: 22, height: 22, fontSize: 9, background: 'rgba(201,168,76,0.2)', color: '#C9A84C', fontWeight: 700 }}>
                                {property.agent.firstName?.[0]}{property.agent.lastName?.[0]}
                            </Avatar>
                            <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                                {property.agent.firstName} {property.agent.lastName?.[0]}.
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <Visibility sx={{ fontSize: 13, color: '#64748B' }} />
                            <Typography sx={{ fontSize: 10, color: '#64748B' }}>{property.viewCount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <FavoriteBorder sx={{ fontSize: 13, color: '#64748B' }} />
                            <Typography sx={{ fontSize: 10, color: '#64748B' }}>{property.favoriteCount}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default function Properties() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterListing, setFilterListing] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const filters = {};
                if (filterType !== 'all') filters.type = filterType;
                if (filterListing !== 'all') filters.listingType = filterListing;
                if (filterStatus !== 'all') filters.status = filterStatus;

                const data = await PropertyService.getAll(filters);
                setProperties(data.data || []);
            } catch (err) {
                console.error('Properties fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [filterType, filterListing, filterStatus]);

    const filteredProperties = properties.filter(p =>
        !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.address?.district?.toLowerCase().includes(search.toLowerCase()) ||
        p.referenceCode?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                mb: 3, flexWrap: 'wrap', gap: 2,
                animation: 'fadeIn 0.4s ease-out',
            }}>
                <Box>
                    <Typography sx={{
                        fontSize: { xs: 22, md: 26 }, fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif", color: '#F1F5F9',
                    }}>
                        İlanlar
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                        Toplam {filteredProperties.length} ilan listeleniyor
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 2, py: 1,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.1), rgba(201, 168, 76, 0.05))',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.08))' }
                }}>
                    <Add sx={{ fontSize: 18, color: '#C9A84C' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#C9A84C' }}>Yeni İlan</Typography>
                </Box>
            </Box>

            {/* Filters Bar */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                mb: 3, flexWrap: 'wrap',
                animation: 'fadeIn 0.4s ease-out 0.1s forwards',
                opacity: 0,
            }}>
                {/* Search */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 2, py: 0.8, borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    flex: 1, minWidth: 200, maxWidth: 320,
                    transition: 'all 0.2s ease',
                    '&:focus-within': {
                        borderColor: 'rgba(201, 168, 76, 0.3)',
                    }
                }}>
                    <Search sx={{ color: '#64748B', fontSize: 18 }} />
                    <InputBase
                        placeholder="İlan veya lokasyon ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ flex: 1, color: '#F1F5F9', fontSize: 13, '& ::placeholder': { color: '#64748B', opacity: 1 } }}
                    />
                </Box>

                {/* Type filter */}
                <FormControl size="small">
                    <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        sx={{
                            minWidth: 120, height: 38,
                            color: '#F1F5F9', fontSize: 13,
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(201,168,76,0.3)' },
                            '& .MuiSvgIcon-root': { color: '#64748B' },
                        }}
                    >
                        <MenuItem value="all">Tüm Tipler</MenuItem>
                        <MenuItem value="apartment">Daire</MenuItem>
                        <MenuItem value="villa">Villa</MenuItem>
                        <MenuItem value="office">Ofis</MenuItem>
                        <MenuItem value="land">Arazi</MenuItem>
                        <MenuItem value="shop">Dükkan</MenuItem>
                    </Select>
                </FormControl>

                {/* Listing type */}
                <FormControl size="small">
                    <Select
                        value={filterListing}
                        onChange={(e) => setFilterListing(e.target.value)}
                        sx={{
                            minWidth: 120, height: 38,
                            color: '#F1F5F9', fontSize: 13,
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(201,168,76,0.3)' },
                            '& .MuiSvgIcon-root': { color: '#64748B' },
                        }}
                    >
                        <MenuItem value="all">Satılık / Kiralık</MenuItem>
                        <MenuItem value="sale">Satılık</MenuItem>
                        <MenuItem value="rent">Kiralık</MenuItem>
                    </Select>
                </FormControl>

                {/* Status */}
                <FormControl size="small">
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        sx={{
                            minWidth: 120, height: 38,
                            color: '#F1F5F9', fontSize: 13,
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(201,168,76,0.3)' },
                            '& .MuiSvgIcon-root': { color: '#64748B' },
                        }}
                    >
                        <MenuItem value="all">Tüm Durumlar</MenuItem>
                        <MenuItem value="active">Aktif</MenuItem>
                        <MenuItem value="sold">Satıldı</MenuItem>
                        <MenuItem value="rented">Kiralandı</MenuItem>
                        <MenuItem value="draft">Taslak</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ flex: 1 }} />

                {/* View toggle */}
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, v) => v && setViewMode(v)}
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#64748B',
                            px: 1.2,
                            '&.Mui-selected': {
                                background: 'rgba(201, 168, 76, 0.12)',
                                color: '#C9A84C',
                                borderColor: 'rgba(201, 168, 76, 0.3)',
                            },
                            '&:hover': { background: 'rgba(255,255,255,0.04)' }
                        }
                    }}
                >
                    <ToggleButton value="grid"><ViewModule sx={{ fontSize: 18 }} /></ToggleButton>
                    <ToggleButton value="list"><ViewList sx={{ fontSize: 18 }} /></ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Properties Grid */}
            {loading ? (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: viewMode === 'grid'
                        ? { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }
                        : '1fr',
                    gap: 2,
                }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            height={viewMode === 'grid' ? 350 : 160}
                            sx={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}
                        />
                    ))}
                </Box>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: viewMode === 'grid'
                        ? { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }
                        : '1fr',
                    gap: 2,
                }}
                    className="stagger-children"
                >
                    {filteredProperties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            viewMode={viewMode}
                            onClick={() => navigate(`/properties/${property.id}`)}
                        />
                    ))}
                </Box>
            )}

            {/* Empty state */}
            {!loading && filteredProperties.length === 0 && (
                <Box sx={{
                    textAlign: 'center', py: 8,
                    animation: 'fadeIn 0.4s ease-out',
                }}>
                    <Apartment sx={{ fontSize: 48, color: '#334155', mb: 2 }} />
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#94A3B8', mb: 1 }}>
                        İlan bulunamadı
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                        Filtrelerinizi değiştirmeyi veya yeni ilan eklemeyi deneyin.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
