import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Avatar, Grid,
  IconButton, Dialog, DialogTitle, DialogContent, Tabs, Tab,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Tooltip,
  TextField, InputAdornment, Badge, Collapse, Snackbar, Alert
} from '@mui/material';
import {
  Notifications, PushPin, Star, StarBorder, Search, FilterList,
  Schedule, ExpandMore, ExpandLess, AttachFile, Comment, Share,
  Campaign, Info, Warning, Event, Close, Add
} from '@mui/icons-material';

const announcements = [
  {
    id: 1,
    title: 'Havuz Bakımı Duyurusu',
    content: 'Değerli sakinlerimiz, 1-3 Aralık tarihleri arasında yıllık bakım çalışmaları nedeniyle havuz kapalı olacaktır. Anlayışınız için teşekkür ederiz.',
    date: '28 Kasım 2024',
    type: 'warning',
    pinned: true,
    starred: true,
    author: 'Yönetim',
    comments: 5,
    attachments: 1,
  },
  {
    id: 2,
    title: 'Yeni Yıl Etkinliği',
    content: 'Yeni yıl kutlaması 31 Aralık akşamı ortak alanda düzenlenecektir. Tüm sakinlerimiz davetlidir!',
    date: '25 Kasım 2024',
    type: 'event',
    pinned: false,
    starred: false,
    author: 'Sosyal Komite',
    comments: 12,
    attachments: 0,
  },
  {
    id: 3,
    title: 'Aidat Artışı Hakkında',
    content: '2025 yılı için aidat tutarları %15 oranında artırılmıştır. Detaylı bilgi için yönetim ofisini ziyaret edebilirsiniz.',
    date: '20 Kasım 2024',
    type: 'info',
    pinned: false,
    starred: true,
    author: 'Yönetim',
    comments: 23,
    attachments: 2,
  },
  {
    id: 4,
    title: 'Asansör Bakımı',
    content: 'A Blok asansörü 30 Kasım Cumartesi günü 09:00-17:00 saatleri arasında bakıma alınacaktır.',
    date: '18 Kasım 2024',
    type: 'warning',
    pinned: false,
    starred: false,
    author: 'Teknik Ekip',
    comments: 3,
    attachments: 0,
  },
];

const Announcements = () => {
  const [tab, setTab] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [starred, setStarred] = useState(announcements.filter(a => a.starred).map(a => a.id));
  const [searchQuery, setSearchQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  };

  const getTypeConfig = (type) => {
    const config = {
      'warning': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: <Warning />, label: 'Uyarı' },
      'info': { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', icon: <Info />, label: 'Bilgi' },
      'event': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: <Event />, label: 'Etkinlik' },
    };
    return config[type] || config['info'];
  };

  const toggleStar = (id) => {
    if (starred.includes(id)) {
      setStarred(starred.filter(s => s !== id));
    } else {
      setStarred([...starred, id]);
    }
  };

  const filteredAnnouncements = announcements
    .filter(a => tab === 0 || (tab === 1 && a.pinned) || (tab === 2 && starred.includes(a.id)))
    .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      py: 4,
      px: { xs: 2, md: 4 },
    }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
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
              {announcements.length} duyuru
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Toplam', count: announcements.length, color: '#6366f1' },
          { label: 'Sabitlenmiş', count: announcements.filter(a => a.pinned).length, color: '#f59e0b' },
          { label: 'Yıldızlı', count: starred.length, color: '#ec4899' },
        ].map((stat) => (
          <Grid item xs={4} key={stat.label}>
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

      {/* Search & Filter */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Duyuru ara..."
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
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
            )
          }}
        />
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

      {/* Tabs & List */}
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
          </Tabs>

          <List sx={{ p: 0 }}>
            {filteredAnnouncements.map((announcement, index) => {
              const typeCfg = getTypeConfig(announcement.type);
              const isExpanded = expandedId === announcement.id;

              return (
                <React.Fragment key={announcement.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 2,
                      py: 2,
                      borderRadius: 2,
                      background: announcement.pinned ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                      borderLeft: announcement.pinned ? '3px solid #f59e0b' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { background: 'rgba(255,255,255,0.03)' }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        background: typeCfg.bg,
                        color: typeCfg.color,
                      }}>
                        {typeCfg.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          {announcement.pinned && (
                            <PushPin sx={{ fontSize: 14, color: '#f59e0b' }} />
                          )}
                          <Typography sx={{ color: '#fff', fontWeight: 600, flex: 1 }}>
                            {announcement.title}
                          </Typography>
                          <Chip
                            label={typeCfg.label}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: 11,
                              background: typeCfg.bg,
                              color: typeCfg.color,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(148, 163, 184, 0.8)',
                              display: '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'unset' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {announcement.content}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2} mt={1}>
                            <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                              {announcement.author} • {announcement.date}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Comment sx={{ fontSize: 14, color: 'rgba(148, 163, 184, 0.4)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                                {announcement.comments}
                              </Typography>
                            </Box>
                            {announcement.attachments > 0 && (
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AttachFile sx={{ fontSize: 14, color: 'rgba(148, 163, 184, 0.4)' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                                  {announcement.attachments}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </>
                      }
                    />
                    <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); toggleStar(announcement.id); }}
                        sx={{ color: starred.includes(announcement.id) ? '#f59e0b' : 'rgba(148, 163, 184, 0.6)' }}
                      >
                        {starred.includes(announcement.id) ? <Star /> : <StarBorder />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : announcement.id); }}
                        sx={{ color: 'rgba(148, 163, 184, 0.6)' }}
                      >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
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

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Announcements;
