import React from 'react';
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';

const messages = [
  { id: 1, sender: 'Yönetici', content: 'Bakım talebiniz işleme alındı.', date: '28.11.2024' },
  { id: 2, sender: 'Bakım Ekibi', content: 'Onarım tamamlandı.', date: '27.11.2024' },
];

const Messages = () => (
  <Box sx={{ mt: 4 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5" fontWeight={700}>Mesajlar</Typography>
      <Button variant="contained" color="primary">Yeni Mesaj</Button>
    </Box>
    <Card>
      <CardContent>
        <List>
          {messages.map((m, i) => (
            <React.Fragment key={m.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={<><b>{m.sender}</b> <span style={{color:'#888', fontSize:12}}>{m.date}</span></>}
                  secondary={m.content}
                />
              </ListItem>
              {i < messages.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  </Box>
);

export default Messages;
