import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

const DashboardChart = ({ title, data, options }) => (
  <Box className="card" sx={{ p: 2.5, mb: 2 }}>
    <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>{title}</Typography>
    <Line data={data} options={options} />
  </Box>
);

export default DashboardChart;
