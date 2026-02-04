import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Tabs, Tab, IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Avatar, Fade, Collapse, Snackbar, Alert, Tooltip, Badge, Divider
} from '@mui/material';
import { Star, StarBorder, Edit, Delete, Add, Info, Close } from '@mui/icons-material';

const initialAnnouncements = [
  { id: 1, title: 'Havuz Bakımı', date: '2 gün önce', content: '1-3 Aralık arası havuz kapalı olacak.', category: 'Bakım', author: 'Yönetici', favorite: false },
  { id: 2, title: 'Yeni Otopark Kuralları', date: '1 hafta önce', content: '1 Aralık’tan itibaren tüm araçlarda otopark etiketi zorunlu.', category: 'Kural', author: 'Yönetici', favorite: true },
  { id: 3, title: 'Aidat Zammı', date: '3 gün önce', content: 'Ocak ayından itibaren aidatlara %15 zam yapılacaktır.', category: 'Finans', author: 'Yönetici', favorite: false },
  { id: 4, title: 'Yılbaşı Partisi', date: '5 gün önce', content: '15 Aralık’ta yılbaşı partisi düzenlenecek. Katılım için lütfen kayıt olun.', category: 'Etkinlik', author: 'Yönetici', favorite: false },
];

const categories = ['Tümü', 'Bakım', 'Kural', 'Finans', 'Etkinlik'];

const Announcements = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [adminMode, setAdminMode] = useState(true); // demo için true

  // Filtreleme ve arama
  const filtered = announcements.filter(a =>
    (tab === 0 || a.category === categories[tab]) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
  );

  // Favori ekle/kaldır
  const toggleFavorite = (id) => {
    setAnnouncements(anns => anns.map(a => a.id === id ? { ...a, favorite: !a.favorite } : a));
    setSnackbar({ open: true, message: 'Favori durumu değiştirildi', severity: 'info' });
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
      setAnnouncements(anns => [...anns, { ...selected, id: Date.now() }]);
      setSnackbar({ open: true, message: 'Duyuru eklendi', severity: 'success' });
    }
    closeModal();
  };

  // Yeni duyuru
  const newAnnouncement = () => {
    setSelected({ title: '', content: '', category: categories[1], author: 'Yönetici', date: 'Şimdi', favorite: false });
    setEditMode(false);
    setModalOpen(true);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700}>Duyurular</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField label="Ara" size="small" value={search} onChange={e => setSearch(e.target.value)} />
          {adminMode && <Button variant="contained" startIcon={<Add />} onClick={newAnnouncement}>Yeni Duyuru</Button>}
        </Box>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {categories.map((cat, i) => <Tab key={cat} label={cat} />)}
      </Tabs>
      <Grid container spacing={2}>
        {filtered.length === 0 && (
          <Grid item xs={12}><Alert severity="info">Duyuru bulunamadı.</Alert></Grid>
        )}
        {filtered.map((a) => (
          <Grid item xs={12} md={6} key={a.id}>
            <Fade in>
              <Card elevation={a.favorite ? 8 : 2} sx={{ position: 'relative', transition: 'box-shadow 0.3s' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={600}>{a.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.date} • {a.category}</Typography>
                    </Box>
                    <Box>
                      <Tooltip title={a.favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}>
                        <IconButton onClick={() => toggleFavorite(a.id)} color={a.favorite ? 'warning' : 'default'}>
                          {a.favorite ? <Star /> : <StarBorder />}
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
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Collapse in>
                    <Typography variant="body2">{a.content}</Typography>
                  </Collapse>
                  <Box mt={2} display="flex" alignItems="center" gap={1}>
                    <Chip label={a.category} color="info" size="small" />
                    <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>{a.author[0]}</Avatar>
                  </Box>
                </CardContent>
                <Badge color="warning" variant="dot" invisible={!a.favorite} sx={{ position: 'absolute', top: 8, right: 8 }} />
              </Card>
            </Fade>
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
    </Box>
  );
};

export default Announcements;
