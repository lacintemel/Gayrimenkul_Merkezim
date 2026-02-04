import React from 'react';
import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const requests = [
  { id: 1, title: 'Musluk Akıtıyor', status: 'Devam Ediyor', date: '20 Kasım', category: 'Tesisat' },
  { id: 2, title: 'Kombi Çalışmıyor', status: 'Beklemede', date: '23 Kasım', category: 'Isıtma' },
];

const Maintenance = () => (
  <Box sx={{ mt: 4 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5" fontWeight={700}>Bakım Talepleri</Typography>
      <Button variant="contained" color="primary">Yeni Talep Oluştur</Button>
    </Box>
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Başlık</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Box>
);

export default Maintenance;
