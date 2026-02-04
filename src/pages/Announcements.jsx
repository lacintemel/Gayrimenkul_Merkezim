import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Tabs, Tab, IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Avatar, Fade, Collapse, Snackbar, Alert, Tooltip, Badge, Divider, Switch, FormControlLabel, List, ListItem, ListItemAvatar, ListItemText,
  InputAdornment, Menu, MenuItem, Slide, useTheme, useMediaQuery
} from '@mui/material';
import {
  Star, StarBorder, Edit, Delete, Add, Info, Close, Archive, PushPin, ThumbUp, ThumbDown, AttachFile, Image, MoreVert, NotificationsActive
} from '@mui/icons-material';

const initialAnnouncements = [
  {
    id: 1,
    title: 'Havuz Bakımı',
    date: '2 gün önce',
    content: '1-3 Aralık arası havuz kapalı olacak.',
    category: 'Bakım',
    author: 'Yönetici',
    favorite: false,
    pinned: true,
    archived: false,
    importance: 'Yüksek',
    tags: ['Bakım', 'Havuz'],
    views: 12,
    likes: 3,
    dislikes: 0,
    attachments: [],
    comments: [
      { user: 'Ali', text: 'Teşekkürler bilgi için!', date: '1 gün önce' },
      { user: 'Ayşe', text: 'Bakım ne zaman bitecek?', date: '1 gün önce' }
    ]
  },
  {
    id: 2,
    title: 'Yeni Otopark Kuralları',
    date: '1 hafta önce',
    content: '1 Aralık’tan itibaren tüm araçlarda otopark etiketi zorunlu.',
    category: 'Kural',
    author: 'Yönetici',
    favorite: true,
    pinned: false,
    archived: false,
    importance: 'Orta',
    tags: ['Otopark', 'Kural'],
    views: 8,
    likes: 1,
    dislikes: 1,
    attachments: [],
    comments: []
  }
];

const categories = ['Tümü', 'Bakım', 'Kural', 'Finans', 'Etkinlik'];
const importanceLevels = ['Düşük', 'Orta', 'Yüksek'];
const themeOptions = ['light', 'dark'];

const Announcements = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [adminMode, setAdminMode] = useState(true); // demo için true
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeType, setThemeType] = useState('light');
  const [commentText, setCommentText] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const fileInputRef = useRef();

  // Simulated real-time notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifOpen(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Filtreleme ve arama
  const filtered = announcements.filter(a =>
    !a.archived &&
    (tab === 0 || a.category === categories[tab]) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
  );

  // Favori ekle/kaldır
  const toggleFavorite = (id) => {
    setAnnouncements(anns => anns.map(a => a.id === id ? { ...a, favorite: !a.favorite } : a));
    setSnackbar({ open: true, message: 'Favori durumu değiştirildi', severity: 'info' });
  };

  // Sabitle/Arşivle
  const togglePin = (id) => {
    setAnnouncements(anns => anns.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
    setSnackbar({ open: true, message: 'Sabitleme durumu değiştirildi', severity: 'info' });
  };
  const toggleArchive = (id) => {
    setAnnouncements(anns => anns.map(a => a.id === id ? { ...a, archived: !a.archived } : a));
    setSnackbar({ open: true, message: 'Arşiv durumu değiştirildi', severity: 'info' });
  };

  // Duyuru detay modalı
  const openModal = (a, edit = false) => {
    setSelected(a);
    setEditMode(edit);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setEditMode(false);
    setCommentText('');
  };

  // Duyuru sil
  const deleteAnnouncement = (id) => {
    setAnnouncements(anns => anns.filter(a => a.id !== id));
    setSnackbar({ open: true, message: 'Duyuru silindi', severity: 'success' });
    closeModal();
  };

  // Duyuru ekle/düzenle
  const handleSave = () => {
    if (editMode && selected) {
      setAnnouncements(anns => anns.map(a => a.id === selected.id ? selected : a));
      setSnackbar({ open: true, message: 'Duyuru güncellendi', severity: 'success' });
    } else if (selected) {
      setAnnouncements(anns => [...anns, { ...selected, id: Date.now(), comments: [], attachments: [] }]);
      setSnackbar({ open: true, message: 'Duyuru eklendi', severity: 'success' });
    }
    closeModal();
  };

  // Yeni duyuru
  const newAnnouncement = () => {
    setSelected({ title: '', content: '', category: categories[1], author: 'Yönetici', date: 'Şimdi', favorite: false, pinned: false, archived: false, importance: 'Orta', tags: [], views: 0, likes: 0, dislikes: 0, attachments: [], comments: [] });
    setEditMode(false);
    setModalOpen(true);
  };

  // Yorum ekle
  const addComment = () => {
    if (commentText.trim() && selected) {
      setAnnouncements(anns => anns.map(a => a.id === selected.id ? { ...a, comments: [...a.comments, { user: 'Sen', text: commentText, date: 'Şimdi' }] } : a));
      setCommentText('');
      setSnackbar({ open: true, message: 'Yorum eklendi', severity: 'success' });
    }
  };

  // Dosya/görsel ekle
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAnnouncements(anns => anns.map(a => a.id === selected.id ? { ...a, attachments: [...a.attachments, ...files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))] } : a));
    setSnackbar({ open: true, message: 'Dosya eklendi', severity: 'success' });
  };

  // Beğeni/tepki
  const handleLike = (id, type) => {
    setAnnouncements(anns => anns.map(a => a.id === id ? { ...a, likes: type === 'like' ? a.likes + 1 : a.likes, dislikes: type === 'dislike' ? a.dislikes + 1 : a.dislikes } : a));
  };

  // Menü
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Tema değiştir
  const handleThemeChange = () => setThemeType(t => t === 'light' ? 'dark' : 'light');

  // Sabitlenmişler önce gelsin
  const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <Box sx={{ mt: 4, bgcolor: themeType === 'dark' ? '#222' : '#f7f7f7', minHeight: '100vh', transition: 'background 0.3s' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700} color={themeType === 'dark' ? '#fff' : 'inherit'}>Duyurular</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField label="Ara" size="small" value={search} onChange={e => setSearch(e.target.value)} />
          <FormControlLabel control={<Switch checked={themeType === 'dark'} onChange={handleThemeChange} />} label="Karanlık Mod" />
          {adminMode && <Button variant="contained" startIcon={<Add />} onClick={newAnnouncement}>Yeni Duyuru</Button>}
        </Box>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {categories.map((cat, i) => <Tab key={cat} label={cat} />)}
      </Tabs>
      <Grid container spacing={2}>
        {sorted.length === 0 && (
          <Grid item xs={12}><Alert severity="info">Duyuru bulunamadı.</Alert></Grid>
        )}
        {sorted.map((a) => (
          <Grid item xs={12} md={6} key={a.id}>
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <Card elevation={a.favorite ? 8 : 2} sx={{ position: 'relative', transition: 'box-shadow 0.3s', bgcolor: themeType === 'dark' ? '#333' : '#fff', color: themeType === 'dark' ? '#fff' : 'inherit' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={600}>{a.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.date} • {a.category} • {a.importance}</Typography>
                    </Box>
                    <Box>
                      <Tooltip title={a.favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}>
                        <IconButton onClick={() => toggleFavorite(a.id)} color={a.favorite ? 'warning' : 'default'}>
                          {a.favorite ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={a.pinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}>
                        <IconButton onClick={() => togglePin(a.id)} color={a.pinned ? 'info' : 'default'}>
                          <PushPin />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={a.archived ? 'Arşivden çıkar' : 'Arşivle'}>
                        <IconButton onClick={() => toggleArchive(a.id)} color={a.archived ? 'secondary' : 'default'}>
                          <Archive />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Detay">
                        <IconButton onClick={() => openModal(a)} color="primary"><Info /></IconButton>
                      </Tooltip>
                      {adminMode && (
                        <>
                          <Tooltip title="Düzenle">
                            <IconButton onClick={() => openModal(a, true)} color="secondary"><Edit /></IconButton>
                          </Tooltip>
                          <Tooltip title="Sil">
                            <IconButton onClick={() => deleteAnnouncement(a.id)} color="error"><Delete /></IconButton>
                          </Tooltip>
                        </>
                      )}
                      <IconButton onClick={handleMenuOpen}><MoreVert /></IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleMenuClose}>Paylaş</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Yazdır</MenuItem>
                      </Menu>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Collapse in>
                    <Typography variant="body2">{a.content}</Typography>
                  </Collapse>
                  <Box mt={2} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    {a.tags.map(tag => <Chip key={tag} label={tag} color="info" size="small" />)}
                    <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>{a.author[0]}</Avatar>
                    <Chip label={`Görüntüleme: ${a.views}`} size="small" />
                    <Chip label={`Beğeni: ${a.likes}`} icon={<ThumbUp />} size="small" />
                    <Chip label={`Tepki: ${a.dislikes}`} icon={<ThumbDown />} size="small" />
                  </Box>
                  <Box mt={2} display="flex" gap={1}>
                    <Button size="small" startIcon={<ThumbUp />} onClick={() => handleLike(a.id, 'like')}>Beğen</Button>
                    <Button size="small" startIcon={<ThumbDown />} onClick={() => handleLike(a.id, 'dislike')}>Tepki</Button>
                  </Box>
                  {/* Ekler/Görseller */}
                  <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                    {a.attachments.map((att, i) => (
                      <Chip key={i} label={att.name} icon={<AttachFile />} clickable onClick={() => window.open(att.url, '_blank')} />
                    ))}
                    {editMode && (
                      <Button size="small" startIcon={<Image />} onClick={() => fileInputRef.current.click()}>Dosya Ekle</Button>
                    )}
                    <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} />
                  </Box>
                  {/* Yorumlar */}
                  <Box mt={3}>
                    <Typography variant="subtitle2" mb={1}>Yorumlar</Typography>
                    <List>
                      {a.comments.map((c, i) => (
                        <ListItem key={i} alignItems="flex-start">
                          <ListItemAvatar><Avatar>{c.user[0]}</Avatar></ListItemAvatar>
                          <ListItemText primary={c.user} secondary={<>{c.text}<br /><span style={{fontSize:12, color:'#888'}}>{c.date}</span></>} />
                        </ListItem>
                      ))}
                    </List>
                    <Box display="flex" gap={1} mt={1}>
                      <TextField
                        size="small"
                        placeholder="Yorum ekle..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        InputProps={{ endAdornment: <InputAdornment position="end"><Button onClick={addComment}>Gönder</Button></InputAdornment> }}
                      />
                    </Box>
                  </Box>
                </CardContent>
                <Badge color="warning" variant="dot" invisible={!a.favorite} sx={{ position: 'absolute', top: 8, right: 8 }} />
                {a.pinned && <PushPin color="info" sx={{ position: 'absolute', top: 8, left: 8 }} />}
              </Card>
            </Slide>
          </Grid>
        ))}
      </Grid>
      {/* Duyuru Detay/Modal */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Duyuru Düzenle' : 'Duyuru Detayı'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Başlık"
            fullWidth
            margin="normal"
            value={selected?.title || ''}
            onChange={e => setSelected(s => ({ ...s, title: e.target.value }))}
            disabled={!editMode}
          />
          <TextField
            label="İçerik"
            fullWidth
            multiline
            minRows={3}
            margin="normal"
            value={selected?.content || ''}
            onChange={e => setSelected(s => ({ ...s, content: e.target.value }))}
            disabled={!editMode}
          />
          <TextField
            label="Kategori"
            select
            SelectProps={{ native: true }}
            fullWidth
            margin="normal"
            value={selected?.category || categories[1]}
            onChange={e => setSelected(s => ({ ...s, category: e.target.value }))}
            disabled={!editMode}
          >
            {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </TextField>
          <TextField
            label="Önem"
            select
            SelectProps={{ native: true }}
            fullWidth
            margin="normal"
            value={selected?.importance || importanceLevels[1]}
            onChange={e => setSelected(s => ({ ...s, importance: e.target.value }))}
            disabled={!editMode}
          >
            {importanceLevels.map(level => <option key={level} value={level}>{level}</option>)}
          </TextField>
          <TextField
            label="Etiketler (virgülle)"
            fullWidth
            margin="normal"
            value={selected?.tags?.join(', ') || ''}
            onChange={e => setSelected(s => ({ ...s, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
            disabled={!editMode}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="inherit" startIcon={<Close />}>Kapat</Button>
          {editMode && <Button onClick={handleSave} variant="contained" color="primary">Kaydet</Button>}
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
      {/* Gerçek zamanlı bildirim */}
      <Snackbar open={notifOpen} autoHideDuration={5000} onClose={() => setNotifOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert icon={<NotificationsActive />} severity="info" onClose={() => setNotifOpen(false)}>
          Yeni duyuru eklendi!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Announcements;
