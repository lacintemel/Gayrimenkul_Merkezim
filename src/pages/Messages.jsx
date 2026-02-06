import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Avatar, Grid,
  TextField, InputAdornment, IconButton, Badge, Chip, Divider,
  List, ListItem, ListItemAvatar, ListItemText, Fab, Dialog,
  DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import {
  Send, Search, MoreVert, AttachFile, InsertEmoticon,
  Done, DoneAll, Circle, Add, ArrowBack, Phone, VideoCall
} from '@mui/icons-material';

const conversations = [
  {
    id: 1,
    name: 'Yönetici',
    avatar: 'Y',
    lastMessage: 'Bakım talebiniz işleme alındı.',
    time: '10:30',
    unread: 2,
    online: true,
    messages: [
      { id: 1, text: 'Merhaba, musluk arızası için bilgi almak istiyorum.', sent: true, time: '10:15', read: true },
      { id: 2, text: 'Merhaba, talebiniz alındı. Yarın teknik ekip gelecek.', sent: false, time: '10:28', read: true },
      { id: 3, text: 'Bakım talebiniz işleme alındı.', sent: false, time: '10:30', read: false },
    ]
  },
  {
    id: 2,
    name: 'Bakım Ekibi',
    avatar: 'B',
    lastMessage: 'Onarım tamamlandı, iyi günler.',
    time: 'Dün',
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: 'Merhaba, kombi bakımı için ne zaman müsaitsiniz?', sent: false, time: '14:00', read: true },
      { id: 2, text: 'Yarın 14:00 uygun.', sent: true, time: '14:15', read: true },
      { id: 3, text: 'Tamam, görüşmek üzere.', sent: false, time: '14:20', read: true },
      { id: 4, text: 'Onarım tamamlandı, iyi günler.', sent: false, time: '16:00', read: true },
    ]
  },
  {
    id: 3,
    name: 'Güvenlik',
    avatar: 'G',
    lastMessage: 'Araç plakanızı güncelledik.',
    time: '22 Kas',
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: 'Yeni aracımın plakasını kaydetmek istiyorum.', sent: true, time: '09:00', read: true },
      { id: 2, text: 'Plakayı alabilir miyim?', sent: false, time: '09:05', read: true },
      { id: 3, text: '34 ABC 123', sent: true, time: '09:10', read: true },
      { id: 4, text: 'Araç plakanızı güncelledik.', sent: false, time: '09:15', read: true },
    ]
  },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage('');
      setSnackbar({ open: true, message: 'Mesaj gönderildi', severity: 'success' });
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      py: 4,
      px: { xs: 2, md: 4 },
    }}>
      <Grid container spacing={3} sx={{ height: 'calc(100vh - 64px)' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  Mesajlar
                </Typography>
                <IconButton
                  onClick={() => setNewChatOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
              <TextField
                placeholder="Mesajlarda ara..."
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 2,
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
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
            </CardContent>

            <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
              {conversations.map((conv, index) => (
                <React.Fragment key={conv.id}>
                  <ListItem
                    onClick={() => setSelectedChat(conv)}
                    sx={{
                      px: 3,
                      py: 2,
                      cursor: 'pointer',
                      background: selectedChat?.id === conv.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      borderLeft: selectedChat?.id === conv.id ? '3px solid #6366f1' : '3px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': { background: 'rgba(255,255,255,0.03)' }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          conv.online && (
                            <Circle sx={{ fontSize: 12, color: '#10b981' }} />
                          )
                        }
                      >
                        <Avatar sx={{
                          background: conv.id === 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' :
                            conv.id === 2 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                              'linear-gradient(135deg, #10b981, #059669)',
                          fontWeight: 600,
                        }}>
                          {conv.avatar}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography sx={{ color: '#fff', fontWeight: 600 }}>{conv.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                            {conv.time}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography
                            variant="body2"
                            sx={{
                              color: conv.unread > 0 ? '#fff' : 'rgba(148, 163, 184, 0.7)',
                              fontWeight: conv.unread > 0 ? 500 : 400,
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {conv.lastMessage}
                          </Typography>
                          {conv.unread > 0 && (
                            <Chip
                              label={conv.unread}
                              size="small"
                              sx={{
                                minWidth: 24,
                                height: 20,
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: '#fff',
                                fontSize: 11,
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < conversations.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.03)', mx: 3 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Card sx={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}>
                  <IconButton
                    sx={{ display: { md: 'none' }, color: '#fff' }}
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={selectedChat.online && <Circle sx={{ fontSize: 10, color: '#10b981' }} />}
                  >
                    <Avatar sx={{
                      background: selectedChat.id === 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' :
                        selectedChat.id === 2 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                          'linear-gradient(135deg, #10b981, #059669)',
                    }}>
                      {selectedChat.avatar}
                    </Avatar>
                  </Badge>
                  <Box flex={1}>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedChat.name}</Typography>
                    <Typography variant="caption" sx={{ color: selectedChat.online ? '#10b981' : 'rgba(148, 163, 184, 0.6)' }}>
                      {selectedChat.online ? 'Çevrimiçi' : 'Son görülme: Bugün'}
                    </Typography>
                  </Box>
                  <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                    <Phone />
                  </IconButton>
                  <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                    <VideoCall />
                  </IconButton>
                  <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                  {selectedChat.messages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.sent ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: msg.sent ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.sent
                          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                          : 'rgba(255,255,255,0.05)',
                        color: '#fff',
                      }}>
                        <Typography variant="body2">{msg.text}</Typography>
                        <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5} mt={0.5}>
                          <Typography variant="caption" sx={{ color: msg.sent ? 'rgba(255,255,255,0.7)' : 'rgba(148, 163, 184, 0.5)' }}>
                            {msg.time}
                          </Typography>
                          {msg.sent && (
                            msg.read ? <DoneAll sx={{ fontSize: 14, color: '#10b981' }} /> : <Done sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                      <AttachFile />
                    </IconButton>
                    <TextField
                      placeholder="Mesajınızı yazın..."
                      fullWidth
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(15, 23, 42, 0.5)',
                          borderRadius: 3,
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                          '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton sx={{ color: 'rgba(148, 163, 184, 0.6)' }}>
                              <InsertEmoticon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    <Fab
                      size="medium"
                      onClick={handleSendMessage}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }
                      }}
                    >
                      <Send sx={{ color: '#fff' }} />
                    </Fab>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(148, 163, 184, 0.6)',
              }}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                }}>
                  <Send sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6">Mesajlarınız</Typography>
                <Typography variant="body2">Sohbet başlatmak için bir kişi seçin</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* New Chat Dialog */}
      <Dialog
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            minWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Yeni Mesaj</DialogTitle>
        <DialogContent>
          <TextField
            label="Kime"
            select
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          >
            <option value="yonetim">Yönetim</option>
            <option value="bakim">Bakım Ekibi</option>
            <option value="guvenlik">Güvenlik</option>
          </TextField>
          <TextField
            label="Mesaj"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setNewChatOpen(false)} sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
            İptal
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={() => {
              setNewChatOpen(false);
              setSnackbar({ open: true, message: 'Mesaj gönderildi', severity: 'success' });
            }}
            sx={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Gönder
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Messages;
