import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Chip, Avatar, IconButton, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, Button, Snackbar, Alert
} from '@mui/material';
import {
    Phone, Email, CalendarMonth, NoteAdd, MoreVert, ArrowForward,
    LocalFireDepartment, FiberNew, ContactPhone, Visibility as ViewIcon,
    LocalOffer, Handshake, ThumbDown, PersonAdd, FilterList, TrendingUp
} from '@mui/icons-material';
import LeadService from '../api/LeadService';
import PropertyService from '../api/PropertyService';

const stageConfig = {
    NEW: { label: 'Yeni', icon: FiberNew, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)' },
    CONTACTED: { label: 'İletişime Geçildi', icon: ContactPhone, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.08)' },
    VIEWING_SCHEDULED: { label: 'Gösterim Planlandı', icon: CalendarMonth, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
    OFFER_MADE: { label: 'Teklif Verildi', icon: LocalOffer, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)' },
    NEGOTIATION: { label: 'Pazarlık', icon: TrendingUp, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.08)' },
    CLOSED_WON: { label: 'Kazanıldı', icon: Handshake, color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
    CLOSED_LOST: { label: 'Kaybedildi', icon: ThumbDown, color: '#6B7280', bg: 'rgba(107, 114, 128, 0.08)' },
};

const tempConfig = {
    hot: { label: 'Sıcak', color: '#EF4444', emoji: '🔥' },
    warm: { label: 'Ilık', color: '#F59E0B', emoji: '🟡' },
    cold: { label: 'Soğuk', color: '#3B82F6', emoji: '🔵' },
};

const priorityConfig = {
    urgent: { label: 'Acil', color: '#EF4444' },
    high: { label: 'Yüksek', color: '#F59E0B' },
    medium: { label: 'Orta', color: '#3B82F6' },
    low: { label: 'Düşük', color: '#6B7280' },
};

const stageOrder = ['NEW', 'CONTACTED', 'VIEWING_SCHEDULED', 'OFFER_MADE', 'NEGOTIATION', 'CLOSED_WON'];

const formatPrice = (price) => {
    if (!price) return '—';
    if (price >= 1000000) return `₺${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `₺${(price / 1000).toFixed(0)}K`;
    return `₺${price}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 0) {
        const futureHours = Math.abs(diffHours);
        if (futureHours < 24) return `${futureHours} saat sonra`;
        return `${Math.abs(diffDays)} gün sonra`;
    }
    if (diffHours < 1) return 'Az önce';
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
};

const KanbanCard = ({ lead, onAdvanceStage, onAddNote, actionLoading }) => {
    const temp = tempConfig[lead.temperature] || tempConfig.cold;
    const priority = priorityConfig[lead.priority] || priorityConfig.medium;

    return (
        <Box sx={{
            p: 2,
            borderRadius: '10px',
            background: 'var(--color-surface-card)',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'grab',
            transition: 'all 0.2s ease',
            mb: 1.2,
            '&:hover': {
                borderColor: 'rgba(201, 168, 76, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
            },
            '&:active': {
                cursor: 'grabbing',
                transform: 'scale(0.98)',
            }
        }}>
            {/* Top badges */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                <Chip
                    label={`${temp.emoji} ${temp.label}`}
                    size="small"
                    sx={{
                        height: 20, fontSize: 10, fontWeight: 700,
                        background: `${temp.color}15`, color: temp.color, border: 'none',
                    }}
                />
                <Chip
                    label={priority.label}
                    size="small"
                    sx={{
                        height: 20, fontSize: 10, fontWeight: 600,
                        background: `${priority.color}12`, color: priority.color, border: 'none',
                    }}
                />
                <Box sx={{ flex: 1 }} />
                <IconButton size="small" sx={{ width: 24, height: 24, color: '#64748B' }}>
                    <MoreVert sx={{ fontSize: 14 }} />
                </IconButton>
            </Box>

            {/* Customer */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{
                    width: 28, height: 28, fontSize: 11, fontWeight: 700,
                    background: `${temp.color}20`, color: temp.color,
                }}>
                    {lead.customer ? `${lead.customer.firstName?.[0]}${lead.customer.lastName?.[0]}` : '?'}
                </Avatar>
                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9', lineHeight: 1.2 }}>
                        {lead.customer ? `${lead.customer.firstName} ${lead.customer.lastName}` : 'Bilinmiyor'}
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: '#64748B' }}>
                        Bütçe: {formatPrice(lead.budget)}
                    </Typography>
                </Box>
            </Box>

            {/* Property */}
            {lead.property && (
                <Box sx={{
                    p: 1,
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    mb: 1.5,
                }}>
                    <Typography sx={{
                        fontSize: 11, color: '#94A3B8', fontWeight: 500,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        🏠 {lead.property.title}
                    </Typography>
                    {lead.offerPrice && (
                        <Typography sx={{
                            fontSize: 12, color: '#C9A84C', fontWeight: 600,
                            fontFamily: "'JetBrains Mono', monospace", mt: 0.3,
                        }}>
                            Teklif: {formatPrice(lead.offerPrice)}
                        </Typography>
                    )}
                </Box>
            )}

            {/* Next action */}
            {lead.nextActionNote && (
                <Typography sx={{
                    fontSize: 11, color: '#64748B', mb: 1,
                    display: 'flex', alignItems: 'center', gap: 0.5,
                }}>
                    📋 {lead.nextActionNote}
                </Typography>
            )}

            {/* Footer */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                pt: 1, borderTop: '1px solid rgba(255,255,255,0.04)',
            }}>
                <Typography sx={{ fontSize: 10, color: '#64748B' }}>
                    {formatDate(lead.updatedAt)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.3 }}>
                    <Tooltip title="Ara" arrow>
                        <IconButton size="small" sx={{ width: 24, height: 24, color: '#64748B', '&:hover': { color: '#10B981' } }}>
                            <Phone sx={{ fontSize: 13 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="E-posta" arrow>
                        <IconButton size="small" sx={{ width: 24, height: 24, color: '#64748B', '&:hover': { color: '#3B82F6' } }}>
                            <Email sx={{ fontSize: 13 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Not Ekle" arrow>
                        <IconButton
                            size="small"
                            disabled={actionLoading}
                            onClick={() => onAddNote(lead)}
                            sx={{ width: 24, height: 24, color: '#64748B', '&:hover': { color: '#C9A84C' } }}
                        >
                            <NoteAdd sx={{ fontSize: 13 }} />
                        </IconButton>
                    </Tooltip>
                    {lead.stage !== 'CLOSED_WON' && lead.stage !== 'CLOSED_LOST' && (
                        <Tooltip title="Sonraki Aşamaya Taşı" arrow>
                            <IconButton
                                size="small"
                                disabled={actionLoading}
                                onClick={() => onAdvanceStage(lead)}
                                sx={{ width: 24, height: 24, color: '#64748B', '&:hover': { color: '#10B981' } }}
                            >
                                <ArrowForward sx={{ fontSize: 13 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            {/* Source tag */}
            {lead.tags && lead.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                    {lead.tags.slice(0, 2).map(tag => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                                height: 18, fontSize: 9, fontWeight: 500,
                                background: 'rgba(255,255,255,0.04)', color: '#64748B',
                                border: 'none',
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default function CRM() {
    const [pipeline, setPipeline] = useState({});
    const [leadStats, setLeadStats] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [newLeadOpen, setNewLeadOpen] = useState(false);
    const [creatingLead, setCreatingLead] = useState(false);
    const [actionLoadingLeadId, setActionLoadingLeadId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [newLeadForm, setNewLeadForm] = useState({
        customerId: '',
        propertyId: '',
        priority: 'medium',
        temperature: 'warm',
        source: 'website',
        budget: '',
        nextActionNote: '',
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [pipelineData, stats, customersData, propertiesData] = await Promise.all([
                LeadService.getPipeline(),
                LeadService.getStats(),
                LeadService.getCustomers(),
                PropertyService.getAll({ status: 'active' }),
            ]);
            setPipeline(pipelineData);
            setLeadStats(stats);
            setCustomers(customersData);
            setProperties(propertiesData.data || []);
        } catch (err) {
            console.error('CRM fetch error:', err);
            setSnackbar({ open: true, message: 'CRM verileri yüklenemedi', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdvanceStage = async (lead) => {
        const currentIdx = stageOrder.indexOf(lead.stage);
        const nextStage = stageOrder[currentIdx + 1];
        if (!nextStage) return;

        try {
            setActionLoadingLeadId(lead.id);
            await LeadService.updateStage(lead.id, { stage: nextStage, note: `Aşama ${nextStage} olarak güncellendi` });
            await fetchData();
            setSnackbar({ open: true, message: 'Lead bir sonraki aşamaya taşındı', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Aşama güncellenemedi', severity: 'error' });
        } finally {
            setActionLoadingLeadId(null);
        }
    };

    const handleAddNote = async (lead) => {
        const note = window.prompt('Aktivite notu girin:');
        if (!note || !note.trim()) return;

        try {
            setActionLoadingLeadId(lead.id);
            await LeadService.addActivity(lead.id, {
                type: 'note',
                title: 'Manuel not eklendi',
                description: note.trim(),
            });
            await fetchData();
            setSnackbar({ open: true, message: 'Not eklendi', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Not eklenemedi', severity: 'error' });
        } finally {
            setActionLoadingLeadId(null);
        }
    };

    const handleCreateLead = async () => {
        if (!newLeadForm.customerId) return;

        try {
            setCreatingLead(true);
            await LeadService.createLead({
                customerId: newLeadForm.customerId,
                propertyId: newLeadForm.propertyId || null,
                priority: newLeadForm.priority,
                temperature: newLeadForm.temperature,
                source: newLeadForm.source,
                budget: Number(newLeadForm.budget || 0),
                nextActionNote: newLeadForm.nextActionNote || null,
            });
            setNewLeadOpen(false);
            setNewLeadForm({
                customerId: '', propertyId: '', priority: 'medium', temperature: 'warm',
                source: 'website', budget: '', nextActionNote: '',
            });
            await fetchData();
            setSnackbar({ open: true, message: 'Yeni lead oluşturuldu', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Lead oluşturulamadı', severity: 'error' });
        } finally {
            setCreatingLead(false);
        }
    };

    // Only show active pipeline stages (not closed)
    const activeStages = ['NEW', 'CONTACTED', 'VIEWING_SCHEDULED', 'OFFER_MADE', 'NEGOTIATION'];
    const closedStages = ['CLOSED_WON', 'CLOSED_LOST'];

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: 'auto' }}>
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
                        CRM Pipeline
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                        {leadStats?.total ?? 0} toplam müşteri · {leadStats?.won ?? 0} kazanıldı · %{leadStats?.conversionRate ?? 0} dönüşüm
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        px: 2, py: 1,
                        borderRadius: '10px',
                        background: 'rgba(201, 168, 76, 0.1)',
                        border: '1px solid rgba(201, 168, 76, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { background: 'rgba(201, 168, 76, 0.15)' }
                    }}
                        onClick={() => setNewLeadOpen(true)}
                    >
                        <PersonAdd sx={{ fontSize: 18, color: '#C9A84C' }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#C9A84C' }}>Müşteri Ekle</Typography>
                    </Box>
                </Box>
            </Box>

            {loading && (
                <Typography sx={{ color: '#64748B', mb: 2 }}>CRM verileri yükleniyor...</Typography>
            )}

            {/* Stats Bar */}
            <Box sx={{
                display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap',
                animation: 'fadeIn 0.4s ease-out 0.1s forwards', opacity: 0,
            }}>
                {[
                    { label: 'Toplam Gelir', value: formatPrice(leadStats?.totalRevenue ?? 0), color: '#10B981', icon: '💰' },
                    { label: 'Sıcak Lead', value: leadStats?.byTemperature?.hot ?? 0, color: '#EF4444', icon: '🔥' },
                    { label: 'Ilık Lead', value: leadStats?.byTemperature?.warm ?? 0, color: '#F59E0B', icon: '🟡' },
                    { label: 'Soğuk Lead', value: leadStats?.byTemperature?.cold ?? 0, color: '#3B82F6', icon: '🔵' },
                ].map(stat => (
                    <Box key={stat.label} sx={{
                        flex: 1, minWidth: 140,
                        p: 2,
                        borderRadius: '10px',
                        background: 'var(--color-surface-card)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        textAlign: 'center',
                    }}>
                        <Typography sx={{ fontSize: 12, mb: 0.3 }}>{stat.icon}</Typography>
                        <Typography sx={{
                            fontSize: 20, fontWeight: 700, color: stat.color,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            {stat.value}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: '#64748B' }}>{stat.label}</Typography>
                    </Box>
                ))}
            </Box>

            {/* Kanban Board */}
            <Box sx={{
                display: 'flex',
                gap: 1.5,
                overflowX: 'auto',
                pb: 2,
                animation: 'fadeIn 0.5s ease-out 0.2s forwards', opacity: 0,
                '::-webkit-scrollbar': { height: 6 },
                '::-webkit-scrollbar-track': { background: 'transparent' },
                '::-webkit-scrollbar-thumb': { background: '#334155', borderRadius: 3 },
            }}>
                {activeStages.map((stage) => {
                    const config = stageConfig[stage];
                    const stageLeads = pipeline[stage] || [];
                    const StageIcon = config.icon;

                    return (
                        <Box
                            key={stage}
                            sx={{
                                minWidth: 280,
                                maxWidth: 300,
                                flex: '0 0 280px',
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: 'calc(100vh - 280px)',
                            }}
                        >
                            {/* Column Header */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 1.5,
                                py: 1.2,
                                mb: 1,
                                borderRadius: '10px',
                                background: config.bg,
                                borderBottom: `2px solid ${config.color}`,
                            }}>
                                <StageIcon sx={{ fontSize: 16, color: config.color }} />
                                <Typography sx={{
                                    fontSize: 12, fontWeight: 600, color: config.color,
                                    fontFamily: "'Outfit', sans-serif",
                                    flex: 1,
                                }}>
                                    {config.label}
                                </Typography>
                                <Box sx={{
                                    width: 22, height: 22, borderRadius: '6px',
                                    background: `${config.color}20`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Typography sx={{
                                        fontSize: 11, fontWeight: 700, color: config.color,
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}>
                                        {stageLeads.length}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Column Content */}
                            <Box sx={{
                                flex: 1,
                                overflowY: 'auto',
                                px: 0.3,
                                '::-webkit-scrollbar': { width: 4 },
                                '::-webkit-scrollbar-thumb': { background: '#334155', borderRadius: 2 },
                            }}>
                                {stageLeads.map(lead => (
                                    <KanbanCard
                                        key={lead.id}
                                        lead={lead}
                                        onAdvanceStage={handleAdvanceStage}
                                        onAddNote={handleAddNote}
                                        actionLoading={actionLoadingLeadId === lead.id}
                                    />
                                ))}

                                {stageLeads.length === 0 && (
                                    <Box sx={{
                                        p: 3, textAlign: 'center',
                                        borderRadius: '10px',
                                        border: '2px dashed rgba(255,255,255,0.06)',
                                    }}>
                                        <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                                            Bu aşamada müşteri yok
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Closed deals summary */}
            <Box sx={{
                mt: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2,
                animation: 'fadeIn 0.5s ease-out 0.3s forwards', opacity: 0,
            }}>
                {closedStages.map(stage => {
                    const config = stageConfig[stage];
                    const stageLeads = pipeline[stage] || [];
                    const StageIcon = config.icon;

                    return (
                        <Box key={stage} className="card" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <StageIcon sx={{ fontSize: 18, color: config.color }} />
                                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', fontFamily: "'Outfit', sans-serif" }}>
                                    {config.label}
                                </Typography>
                                <Chip label={stageLeads.length} size="small" sx={{
                                    height: 20, fontSize: 10, fontWeight: 700,
                                    background: `${config.color}15`, color: config.color,
                                }} />
                            </Box>
                            {stageLeads.map(lead => (
                                <Box key={lead.id} sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                    px: 1.5, py: 1, borderRadius: '8px',
                                    '&:hover': { background: 'rgba(255,255,255,0.03)' }
                                }}>
                                    <Avatar sx={{
                                        width: 28, height: 28, fontSize: 10, fontWeight: 700,
                                        background: `${config.color}20`, color: config.color,
                                    }}>
                                        {lead.customer ? `${lead.customer.firstName?.[0]}${lead.customer.lastName?.[0]}` : '?'}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#F1F5F9' }}>
                                            {lead.customer ? `${lead.customer.firstName} ${lead.customer.lastName}` : 'Bilinmiyor'}
                                        </Typography>
                                        <Typography sx={{ fontSize: 10, color: '#64748B' }}>
                                            {lead.property?.title || 'Genel talep'} · {lead.lostReason || formatPrice(lead.offerPrice)}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: 10, color: '#64748B' }}>
                                        {formatDate(lead.closedAt)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    );
                })}
            </Box>

            <Dialog
                open={newLeadOpen}
                onClose={() => setNewLeadOpen(false)}
                PaperProps={{ sx: { minWidth: { xs: '92vw', md: 540 } } }}
            >
                <DialogTitle>Yeni Lead Oluştur</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Müşteri"
                        value={newLeadForm.customerId}
                        onChange={(e) => setNewLeadForm((prev) => ({ ...prev, customerId: e.target.value }))}
                    >
                        {customers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {customer.firstName} {customer.lastName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="İlan (Opsiyonel)"
                        value={newLeadForm.propertyId}
                        onChange={(e) => setNewLeadForm((prev) => ({ ...prev, propertyId: e.target.value }))}
                    >
                        <MenuItem value="">Genel Talep</MenuItem>
                        {properties.map((property) => (
                            <MenuItem key={property.id} value={property.id}>
                                {property.title}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.2 }}>
                        <TextField
                            select
                            label="Öncelik"
                            value={newLeadForm.priority}
                            onChange={(e) => setNewLeadForm((prev) => ({ ...prev, priority: e.target.value }))}
                        >
                            {Object.entries(priorityConfig).map(([key, value]) => (
                                <MenuItem key={key} value={key}>{value.label}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Sıcaklık"
                            value={newLeadForm.temperature}
                            onChange={(e) => setNewLeadForm((prev) => ({ ...prev, temperature: e.target.value }))}
                        >
                            {Object.entries(tempConfig).map(([key, value]) => (
                                <MenuItem key={key} value={key}>{value.label}</MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <TextField
                        fullWidth
                        margin="normal"
                        type="number"
                        label="Bütçe"
                        value={newLeadForm.budget}
                        onChange={(e) => setNewLeadForm((prev) => ({ ...prev, budget: e.target.value }))}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Sonraki Aksiyon Notu"
                        value={newLeadForm.nextActionNote}
                        onChange={(e) => setNewLeadForm((prev) => ({ ...prev, nextActionNote: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewLeadOpen(false)}>İptal</Button>
                    <Button
                        variant="contained"
                        disabled={creatingLead || !newLeadForm.customerId}
                        onClick={handleCreateLead}
                    >
                        {creatingLead ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            >
                <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
