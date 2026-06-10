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
  InputAdornment,
  InputLabel,
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
  Add,
  AttachFile,
  Campaign,
  Close,
  Comment,
  Event,
  FilterList,
  Info,
  PushPin,
  Search,
  Share,
  Star,
  StarBorder,
  Warning,
} from '@mui/icons-material';
import announcementService from '../api/AnnouncementService';
import PropertyService from '../api/PropertyService';
import { useAuthStore } from '../store/authStore';

const managementRoles = ['platform_admin', 'management_company', 'building_manager', 'property_owner', 'super_admin', 'agency_manager', 'agent'];

const typeConfig = {
  GENERAL: { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', icon: Info, label: 'Genel' },
  MAINTENANCE: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Warning, label: 'Bakım' },
  MEETING: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: Event, label: 'Toplantı' },
  EMERGENCY: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: Warning, label: 'Acil' },
  FINANCIAL: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: Info, label: 'Mali' },
  RULE_CHANGE: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: Campaign, label: 'Kural' },
};

const priorityLabels = {
  LOW: 'Düşük',
  MEDIUM: 'Normal',
  HIGH: 'Yüksek',
  URGENT: 'Acil',
};

const roleLabels = {
  tenant: 'Kiracı',
  property_owner: 'Mülk Sahibi',
  building_manager: 'Yönetici',
  management_company: 'Yönetim Şirketi',
};

const formatDate = (date) => new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date(date));

const Announcements = () => {
  const user = useAuthStore((state) => state.user);
  const canCreateAnnouncement = managementRoles.includes(user?.role);
  const [tab, setTab] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pinned: 0, unread: 0, urgent: 0 });
  const [starred, setStarred] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    propertyId: '',
    title: '',
    content: '',
    type: 'GENERAL',
    priority: 'MEDIUM',
    pinned: false,
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
      const [announcementData, statsData, propertyData] = await Promise.all([
        announcementService.getAnnouncements(),
        announcementService.getStats(),
        PropertyService.getAll(),
      ]);
      const data = announcementData.data || [];
      setAnnouncements(data);
      setStats(statsData);
      setProperties(propertyData.data || []);
      setStarred(prev => prev.length ? prev : data.filter(item => item.pinned).map(item => item.id));
    } catch (err) {
      console.error('Announcements fetch error:', err);
      setSnackbar({ open: true, message: 'Duyurular yüklenemedi', severity: 'error' });
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, []);

  const filteredAnnouncements = useMemo(() => announcements
    .filter(item => tab === 0 || (tab === 1 && item.pinned) || (tab === 2 && starred.includes(item.id)) || (tab === 3 && !(item.readBy || []).includes(user?.id)))
    .filter(item => typeFilter === 'all' || item.type === typeFilter)
    .filter(item => {
      const haystack = [
        item.title,
        item.content,
        item.property?.title,
        item.property?.address?.district,
      ].filter(Boolean).join(' ').toLowerCase();
      return !searchQuery || haystack.includes(searchQuery.toLowerCase());
    }), [announcements, searchQuery, starred, tab, typeFilter, user?.id]);

  const toggleStar = (id) => {
    setStarred(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const markRead = async (announcement) => {
    try {
      const updated = await announcementService.markRead(announcement.id);
      setAnnouncements(prev => prev.map(item => item.id === updated.id ? updated : item));
      setDetailOpen(updated);
    } catch (err) {
      console.error('Mark announcement read error:', err);
    }
  };

  const handleCreate = async () => {
    try {
      await announcementService.createAnnouncement(newAnnouncement);
      setCreateOpen(false);
      setNewAnnouncement({ propertyId: '', title: '', content: '', type: 'GENERAL', priority: 'MEDIUM', pinned: false });
      setSnackbar({ open: true, message: 'Duyuru yayınlandı', severity: 'success' });
      fetchData();
    } catch (err) {
      console.error('Create announcement error:', err);
      setSnackbar({ open: true, message: 'Duyuru oluşturulamadı', severity: 'error' });
    }
  };

  const renderTypeChip = (type) => {
    const cfg = typeConfig[type] || typeConfig.GENERAL;
    return (
      <Chip
        label={cfg.label}
        size="small"
        sx={{ height: 22, fontSize: 11, background: cfg.bg, color: cfg.color, fontWeight: 700 }}
      />
    );
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
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
          }}>
            <Campaign sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Duyurular
            </Typography>
            <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
              {stats.active} aktif duyuru · {stats.unread} okunmamış
            </Typography>
          </Box>
        </Box>
        {canCreateAnnouncement && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateOpen(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
            }}
          >
            Yeni Duyuru
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Toplam', count: stats.total, color: '#6366f1' },
          { label: 'Sabitlenmiş', count: stats.pinned, color: '#f59e0b' },
          { label: 'Okunmamış', count: stats.unread, color: '#ef4444' },
          { label: 'Önemli', count: stats.urgent, color: '#10b981' },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
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

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Duyuru, mülk veya lokasyon ara..."
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 260,
            '& .MuiOutlinedInput-root': {
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: 2,
              color: '#fff',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
              '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'rgba(148, 163, 184, 0.6)' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small">
          <Select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            sx={{
              minWidth: 150,
              height: 40,
              color: '#F1F5F9',
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
              '& .MuiSvgIcon-root': { color: '#64748B' },
            }}
          >
            <MenuItem value="all">Tüm Türler</MenuItem>
            {Object.entries(typeConfig).map(([value, config]) => (
              <MenuItem key={value} value={value}>{config.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Filtrele">
          <IconButton sx={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(148, 163, 184, 0.6)',
          }}>
            <FilterList />
          </IconButton>
        </Tooltip>
      </Box>

      <Card sx={cardStyle}>
        <CardContent sx={{ p: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 3,
              '& .MuiTab-root': { color: 'rgba(148, 163, 184, 0.7)', textTransform: 'none' },
              '& .Mui-selected': { color: '#6366f1' },
              '& .MuiTabs-indicator': { background: '#6366f1' },
            }}
          >
            <Tab label="Tümü" />
            <Tab label="Sabitlenmiş" icon={<PushPin sx={{ fontSize: 16 }} />} iconPosition="start" />
            <Tab label="Yıldızlı" icon={<Star sx={{ fontSize: 16 }} />} iconPosition="start" />
            <Tab label="Okunmamış" />
          </Tabs>

          <List sx={{ p: 0 }}>
            {filteredAnnouncements.map((announcement, index) => {
              const cfg = typeConfig[announcement.type] || typeConfig.GENERAL;
              const Icon = cfg.icon;
              const isUnread = !(announcement.readBy || []).includes(user?.id);

              return (
                <React.Fragment key={announcement.id}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={() => {
                      setDetailOpen(announcement);
                      if (isUnread) markRead(announcement);
                    }}
                    sx={{
                      px: 2,
                      py: 2,
                      borderRadius: 2,
                      background: announcement.pinned ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                      borderLeft: announcement.pinned ? '3px solid #f59e0b' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { background: 'rgba(255,255,255,0.03)' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: 48, height: 48, background: cfg.bg, color: cfg.color }}>
                        <Icon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
                          {announcement.pinned && <PushPin sx={{ fontSize: 14, color: '#f59e0b' }} />}
                          {isUnread && <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />}
                          <Typography sx={{ color: '#fff', fontWeight: 600, flex: 1 }}>
                            {announcement.title}
                          </Typography>
                          {renderTypeChip(announcement.type)}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(148, 163, 184, 0.8)',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {announcement.content}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2} mt={1} flexWrap="wrap">
                            <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                              {announcement.property?.title} · {formatDate(announcement.createdAt)}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Comment sx={{ fontSize: 14, color: 'rgba(148, 163, 184, 0.4)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.5)' }}>{announcement.comments}</Typography>
                            </Box>
                            {announcement.attachments > 0 && (
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AttachFile sx={{ fontSize: 14, color: 'rgba(148, 163, 184, 0.4)' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.5)' }}>{announcement.attachments}</Typography>
                              </Box>
                            )}
                          </Box>
                        </>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); toggleStar(announcement.id); }}
                      sx={{ color: starred.includes(announcement.id) ? '#f59e0b' : 'rgba(148, 163, 184, 0.6)' }}
                    >
                      {starred.includes(announcement.id) ? <Star /> : <StarBorder />}
                    </IconButton>
                  </ListItem>
                  {index < filteredAnnouncements.length - 1 && (
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
            <DialogTitle sx={{ color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                {detailOpen.pinned && <PushPin sx={{ fontSize: 18, color: '#f59e0b' }} />}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{detailOpen.title}</Typography>
              </Box>
              <IconButton onClick={() => setDetailOpen(null)} sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                {renderTypeChip(detailOpen.type)}
                <Chip
                  label={priorityLabels[detailOpen.priority] || detailOpen.priority}
                  size="small"
                  sx={{ background: 'rgba(255,255,255,0.08)', color: '#E2E8F0' }}
                />
              </Box>
              <Typography sx={{ color: 'rgba(226, 232, 240, 0.92)', mb: 3 }}>
                {detailOpen.content}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                {detailOpen.property?.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                Hedef: {(detailOpen.targetRoles || []).map(role => roleLabels[role] || role).join(', ')}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                startIcon={<Share />}
                onClick={() => {
                  setSnackbar({ open: true, message: 'Duyuru paylaşım bağlantısı hazırlandı', severity: 'success' });
                  setDetailOpen(null);
                }}
                sx={{ color: '#6366f1', textTransform: 'none' }}
              >
                Paylaş
              </Button>
              <Button onClick={() => setDetailOpen(null)} sx={{ color: 'rgba(148, 163, 184, 0.8)', textTransform: 'none' }}>
                Kapat
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
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
          Yeni Duyuru
          <IconButton onClick={() => setCreateOpen(false)} sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>Mülk</InputLabel>
            <Select
              label="Mülk"
              value={newAnnouncement.propertyId}
              onChange={(event) => setNewAnnouncement(prev => ({ ...prev, propertyId: event.target.value }))}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                '& .MuiSelect-icon': { color: 'rgba(148, 163, 184, 0.6)' },
              }}
            >
              {properties.map(property => (
                <MenuItem key={property.id} value={property.id}>{property.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Başlık"
            fullWidth
            margin="normal"
            value={newAnnouncement.title}
            onChange={(event) => setNewAnnouncement(prev => ({ ...prev, title: event.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
          <TextField
            label="Tür"
            select
            fullWidth
            margin="normal"
            value={newAnnouncement.type}
            onChange={(event) => setNewAnnouncement(prev => ({ ...prev, type: event.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          >
            {Object.entries(typeConfig).map(([value, config]) => (
              <MenuItem key={value} value={value}>{config.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Öncelik"
            select
            fullWidth
            margin="normal"
            value={newAnnouncement.priority}
            onChange={(event) => setNewAnnouncement(prev => ({ ...prev, priority: event.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="İçerik"
            fullWidth
            multiline
            rows={5}
            margin="normal"
            value={newAnnouncement.content}
            onChange={(event) => setNewAnnouncement(prev => ({ ...prev, content: event.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!newAnnouncement.propertyId || !newAnnouncement.title || !newAnnouncement.content}
            sx={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Yayınla
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Announcements;
