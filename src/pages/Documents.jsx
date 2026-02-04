import React from 'react';
import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const documents = [
  { id: 1, name: 'Kira Sözleşmesi.pdf', type: 'Sözleşme', date: '15.01.2024', size: '2.4 MB' },
  { id: 2, name: 'Otopark Başvuru.pdf', type: 'Form', date: '20.11.2024', size: '512 KB' },
];

const Documents = () => (
  <Box sx={{ mt: 4 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5" fontWeight={700}>Belgeler</Typography>
      <Button variant="contained" color="primary">Belge Yükle</Button>
    </Box>
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ad</TableCell>
                <TableCell>Tür</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>Boyut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>{d.date}</TableCell>
                  <TableCell>{d.size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Box>
);

export default Documents;
