import React, { useEffect, useMemo, useState } from 'react';
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
import messageService from '../api/MessageService';

const gradientByIndex = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #10b981, #059669)',
];

const formatConversationTime = (isoTime) => {
  if (!isoTime) return '';
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();
  if (isSameDay) {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
};

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatRecipient, setNewChatRecipient] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
  };

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const data = await messageService.getConversations();
      setConversations(data);
    } catch {
      setSnackbar({ open: true, message: 'Mesajlar yüklenemedi', severity: 'error' });
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conv) =>
      conv.name?.toLowerCase().includes(query) || conv.lastMessage?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const handleSelectChat = async (conversation) => {
    try {
      setSelectedChatId(conversation.id);
      setLoadingChat(true);
      const detail = await messageService.getMessages(conversation.id);
      setSelectedChat(detail);

      if ((conversation.unread || 0) > 0) {
        await messageService.markAsRead(conversation.id);
        setConversations((prev) => prev.map((item) => (
          item.id === conversation.id ? { ...item, unread: 0 } : item
        )));
      }
    } catch {
      setSnackbar({ open: true, message: 'Sohbet yüklenemedi', severity: 'error' });
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async () => {
    const messageText = newMessage.trim();
    if (!messageText || !selectedChat?.id) return;

    try {
      const sentMessage = await messageService.sendMessage(selectedChat.id, messageText);
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...(prev?.messages || []), sentMessage],
        lastMessage: sentMessage.text,
        lastMessageTime: new Date().toISOString(),
      }));
      setConversations((prev) => prev.map((conv) => (
        conv.id === selectedChat.id
          ? { ...conv, lastMessage: sentMessage.text, lastMessageTime: new Date().toISOString() }
          : conv
      )));
      setNewMessage('');
    } catch {
      setSnackbar({ open: true, message: 'Mesaj gönderilemedi', severity: 'error' });
    }
  };

  const handleCreateConversation = async () => {
    const recipient = newChatRecipient.trim();
    const message = newChatMessage.trim();
    if (!recipient || !message) return;

    try {
      setCreatingConversation(true);
      const created = await messageService.createConversation(recipient, message);
      setConversations((prev) => [created, ...prev]);
      setNewChatOpen(false);
      setNewChatRecipient('');
      setNewChatMessage('');
      setSnackbar({ open: true, message: 'Yeni sohbet oluşturuldu', severity: 'success' });
      await handleSelectChat(created);
    } catch {
      setSnackbar({ open: true, message: 'Sohbet oluşturulamadı', severity: 'error' });
    } finally {
      setCreatingConversation(false);
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
              {loadingConversations && (
                <ListItem sx={{ px: 3, py: 2 }}>
                  <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>Yükleniyor...</Typography>
                </ListItem>
              )}

              {!loadingConversations && filteredConversations.length === 0 && (
                <ListItem sx={{ px: 3, py: 2 }}>
                  <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>Sohbet bulunamadı</Typography>
                </ListItem>
              )}

              {filteredConversations.map((conv, index) => (
                <React.Fragment key={conv.id}>
                  <ListItem
                    onClick={() => handleSelectChat(conv)}
                    sx={{
                      px: 3,
                      py: 2,
                      cursor: 'pointer',
                      background: selectedChatId === conv.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      borderLeft: selectedChatId === conv.id ? '3px solid #6366f1' : '3px solid transparent',
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
                          background: gradientByIndex[index % gradientByIndex.length],
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
                            {formatConversationTime(conv.lastMessageTime)}
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
                  {index < filteredConversations.length - 1 && (
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
                      background: gradientByIndex[0],
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
                  {loadingChat && (
                    <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)', mb: 2 }}>Sohbet yükleniyor...</Typography>
                  )}
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
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
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
            fullWidth
            margin="normal"
            value={newChatRecipient}
            onChange={(e) => setNewChatRecipient(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
              '& .MuiInputLabel-root': { color: 'rgba(148, 163, 184, 0.8)' },
            }}
          />
          <TextField
            label="Mesaj"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={newChatMessage}
            onChange={(e) => setNewChatMessage(e.target.value)}
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
            disabled={creatingConversation || !newChatRecipient.trim() || !newChatMessage.trim()}
            onClick={handleCreateConversation}
            sx={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {creatingConversation ? 'Gönderiliyor...' : 'Gönder'}
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
