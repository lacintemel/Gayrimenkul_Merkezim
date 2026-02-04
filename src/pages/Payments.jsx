import React from 'react';
import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const payments = [
  { id: 1, amount: 1200, date: '01.11.2024', type: 'Kira', status: 'Ödendi' },
  { id: 2, amount: 150, date: '15.10.2024', type: 'Aidat', status: 'Bekliyor' },
];

const Payments = () => (
  <Box sx={{ mt: 4 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5" fontWeight={700}>Ödemeler</Typography>
      <Button variant="contained" color="primary">Ödeme Yap</Button>
    </Box>
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tutar</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>Tür</TableCell>
                <TableCell>Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>₺{p.amount}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.type}</TableCell>
                  <TableCell>{p.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Box>
);

export default Payments;
