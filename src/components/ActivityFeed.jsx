import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const ActivityFeed = ({ activities }) => (
  <Box className="card" sx={{ p: 2.5, mb: 2 }}>
    <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>Son Aktiviteler</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {activities.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>Henüz aktivite yok.</Typography>
      ) : (
        activities.map((act, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 28, height: 28, fontSize: 12, background: '#3B82F6' }}>
              {act.user[0]}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 13, color: '#F1F5F9', fontWeight: 500 }}>{act.text}</Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>{act.time}</Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  </Box>
);

export default ActivityFeed;
