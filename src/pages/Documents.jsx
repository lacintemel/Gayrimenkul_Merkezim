import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Avatar, Grid,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Tooltip,
  TextField, InputAdornment, Tabs, Tab, Menu, MenuItem, Snackbar, Alert
} from '@mui/material';
import {
  Description, Folder, PictureAsPdf, InsertDriveFile, Image,
  Download, Search, FilterList, MoreVert, Star, StarBorder,
  CloudUpload, GridView, ViewList, Delete, Share, Visibility
} from '@mui/icons-material';
import documentService from '../api/DocumentService';

const formatDate = (date) => new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date(date));

const Documents = () => {
  const [tab, setTab] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ total: 0, starred: 0, totalSizeLabel: '0 MB' });
  const [categories, setCategories] = useState([{ value: 'all', label: 'Tümü' }]);
  const [starred, setStarred] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  };

  const getFileIcon = (type) => {
    const normalized = ['CONTRACT', 'RECEIPT', 'REPORT', 'TITLE_DEED', 'INSURANCE'].includes(type)
      ? 'pdf'
      : type === 'INVOICE'
        ? 'excel'
        : type === 'PHOTO'
          ? 'image'
          : String(type || '').toLowerCase();
    const icons = {
      'pdf': { icon: <PictureAsPdf />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
      'excel': { icon: <InsertDriveFile />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
      'image': { icon: <Image />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
      'default': { icon: <Description />, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
    };
    return icons[normalized] || icons['default'];
  };

  const fetchDocuments = async () => {
    try {
      const [documentsData, statsData, categoriesData] = await Promise.all([
        documentService.getDocuments(),
        documentService.getStats(),
        documentService.getCategories(),
      ]);
      const data = documentsData.data || [];
      setDocuments(data);
      setStats(statsData);
      setCategories([{ value: 'all', label: 'Tümü' }, ...categoriesData]);
      setStarred(data.filter(d => d.isStarred).map(d => d.id));
    } catch (err) {
      console.error('Documents fetch error:', err);
      setSnackbar({ open: true, message: 'Belgeler yüklenemedi', severity: 'error' });
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchDocuments);
  }, []);

  const toggleStar = async (id) => {
    const nextValue = !starred.includes(id);
    setStarred(prev => nextValue ? [...prev, id] : prev.filter(s => s !== id));
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, isStarred: nextValue } : doc));
    try {
      await documentService.toggleStar(id, nextValue);
      const nextStats = await documentService.getStats();
      setStats(nextStats);
    } catch (err) {
      console.error('Document star error:', err);
      setSnackbar({ open: true, message: 'Yıldız durumu güncellenemedi', severity: 'error' });
    }
  };

  const filteredDocuments = documents
    .filter(d => tab === 0 || (tab === 1 && starred.includes(d.id)))
    .filter(d => selectedCategory === 'all' || d.type === selectedCategory)
    .filter(d => {
      const haystack = [
        d.name,
        d.typeLabel,
        d.property?.title,
        d.property?.address?.district,
        d.tenancy?.unit?.unitNumber,
      ].filter(Boolean).join(' ').toLowerCase();
      return !searchQuery || haystack.includes(searchQuery.toLowerCase());
    });

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
            background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
            boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)',
          }}>
            <Folder sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Belgeler
            </Typography>
            <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
              {stats.total} belge · {stats.totalSizeLabel}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setUploadOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: 2,
            boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #db2777, #e11d48)',
            }
          }}
        >
          Yükle
        </Button>
      </Box>

      {/* Categories */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        {categories.map((cat) => (
          <Chip
            key={cat.value}
            label={cat.label}
            onClick={() => setSelectedCategory(cat.value)}
            sx={{
              background: selectedCategory === cat.value ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontWeight: selectedCategory === cat.value ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: selectedCategory === cat.value ? 'linear-gradient(135deg, #db2777, #e11d48)' : 'rgba(255,255,255,0.1)',
              }
            }}
          />
        ))}
      </Box>

      {/* Search & Actions */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Belge ara..."
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
              '&:hover fieldset': { borderColor: 'rgba(236, 72, 153, 0.5)' },
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
        <Box display="flex" gap={1}>
          <Tooltip title="Liste Görünümü">
            <IconButton
              onClick={() => setViewMode('list')}
              sx={{
                background: viewMode === 'list' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: viewMode === 'list' ? '#ec4899' : 'rgba(148, 163, 184, 0.6)',
              }}
            >
              <ViewList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grid Görünümü">
            <IconButton
              onClick={() => setViewMode('grid')}
              sx={{
                background: viewMode === 'grid' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: viewMode === 'grid' ? '#ec4899' : 'rgba(148, 163, 184, 0.6)',
              }}
            >
              <GridView />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Documents */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 3,
              '& .MuiTab-root': { color: 'rgba(148, 163, 184, 0.7)', textTransform: 'none' },
              '& .Mui-selected': { color: '#ec4899' },
              '& .MuiTabs-indicator': { background: '#ec4899' },
            }}
          >
            <Tab label="Tüm Belgeler" />
            <Tab label="Yıldızlı" icon={<Star sx={{ fontSize: 16 }} />} iconPosition="start" />
          </Tabs>

          {viewMode === 'list' ? (
            <List sx={{ p: 0 }}>
              {filteredDocuments.map((doc, index) => {
                const fileIcon = getFileIcon(doc.type);

                return (
                  <React.Fragment key={doc.id}>
                    <ListItem
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { background: 'rgba(255,255,255,0.03)' }
                      }}
                      onClick={() => setPreviewOpen(doc)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{
                          width: 44,
                          height: 44,
                          background: fileIcon.bg,
                          color: fileIcon.color,
                        }}>
                          {fileIcon.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            {doc.name}
                          </Typography>
                        }
                        secondary={
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                              {doc.sizeLabel} • {formatDate(doc.createdAt)}
                            </Typography>
                            <Chip
                              label={doc.typeLabel}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: 10,
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(148, 163, 184, 0.8)',
                              }}
                            />
                          </Box>
                        }
                      />
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); toggleStar(doc.id); }}
                          sx={{ color: starred.includes(doc.id) ? '#f59e0b' : 'rgba(148, 163, 184, 0.4)' }}
                        >
                          {starred.includes(doc.id) ? <Star /> : <StarBorder />}
                        </IconButton>
                        <Tooltip title="İndir">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); setSnackbar({ open: true, message: 'İndirme başladı', severity: 'success' }); }}
                            sx={{ color: 'rgba(148, 163, 184, 0.6)' }}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); setSelectedDoc(doc); }}
                          sx={{ color: 'rgba(148, 163, 184, 0.6)' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < filteredDocuments.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.03)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Grid container spacing={2}>
              {filteredDocuments.map((doc) => {
                const fileIcon = getFileIcon(doc.type);

                return (
                  <Grid item xs={6} sm={4} md={3} key={doc.id}>
                    <Card
                      sx={{
                        ...cardStyle,
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: 'rgba(236, 72, 153, 0.3)',
                        }
                      }}
                      onClick={() => setPreviewOpen(doc)}
                    >
                      <Avatar sx={{
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2,
                        background: fileIcon.bg,
                        color: fileIcon.color,
                      }}>
                        {fileIcon.icon}
                      </Avatar>
                      <Typography sx={{
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: 14,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {doc.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                        {doc.sizeLabel}
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <MenuItem onClick={() => { setAnchorEl(null); setPreviewOpen(selectedDoc); }} sx={{ color: '#fff' }}>
          <Visibility sx={{ mr: 1, fontSize: 18 }} /> Görüntüle
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); setSnackbar({ open: true, message: 'İndirme başladı', severity: 'success' }); }} sx={{ color: '#fff' }}>
          <Download sx={{ mr: 1, fontSize: 18 }} /> İndir
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: '#fff' }}>
          <Share sx={{ mr: 1, fontSize: 18 }} /> Paylaş
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: '#ef4444' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} /> Sil
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            minWidth: 450,
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Belge Yükle</DialogTitle>
        <DialogContent>
          <Box sx={{
            border: '2px dashed rgba(236, 72, 153, 0.3)',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#ec4899',
              background: 'rgba(236, 72, 153, 0.05)',
            }
          }}>
            <CloudUpload sx={{ fontSize: 48, color: '#ec4899', mb: 2 }} />
            <Typography sx={{ color: '#fff', mb: 1 }}>Dosyaları buraya sürükleyin</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
              veya dosya seçmek için tıklayın
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUploadOpen(false)} sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setUploadOpen(false);
              setSnackbar({ open: true, message: 'Dosya yüklendi', severity: 'success' });
            }}
            sx={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
          >
            Yükle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={Boolean(previewOpen)}
        onClose={() => setPreviewOpen(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
          }
        }}
      >
        {previewOpen && (
          <>
            <DialogTitle sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>
                {getFileIcon(previewOpen.type).icon}
              </Avatar>
              {previewOpen.name}
            </DialogTitle>
            <DialogContent>
              <Box sx={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 2,
              }}>
                <Typography sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  Belge önizlemesi burada görüntülenecek
                </Typography>
              </Box>
              <Box display="flex" gap={2} mt={2}>
                <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  Boyut: {previewOpen.sizeLabel}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  Tarih: {formatDate(previewOpen.createdAt)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                  Kategori: {previewOpen.typeLabel}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setPreviewOpen(null)} sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                Kapat
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => {
                  setSnackbar({ open: true, message: 'İndirme başladı', severity: 'success' });
                }}
                sx={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
              >
                İndir
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Documents;
