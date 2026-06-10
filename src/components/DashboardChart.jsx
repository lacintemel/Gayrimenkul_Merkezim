import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardChart = ({ title, data, options }) => (
  <Box className="card" sx={{ p: 2.5, mb: 2 }}>
    <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>{title}</Typography>
    <Line data={data} options={options} />
  </Box>
);

export default DashboardChart;
