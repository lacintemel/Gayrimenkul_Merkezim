import React, { useState } from 'react';
import { Box, Typography, Checkbox, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const TaskWidget = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Kadıköy daire gösterimi', done: false },
    { id: 2, text: 'Ali Yıldırım geri arama', done: false },
    { id: 3, text: 'Villa teklifi süresi kontrolü', done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <Box className="card" sx={{ p: 2.5, mb: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>Görevler</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {tasks.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>Görev yok.</Typography>
        ) : (
          tasks.map(task => (
            <Box key={task.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox checked={task.done} onChange={() => toggleTask(task.id)} />
              <Typography sx={{ fontSize: 13, color: task.done ? '#94A3B8' : '#F1F5F9', textDecoration: task.done ? 'line-through' : 'none' }}>
                {task.text}
              </Typography>
              <IconButton size="small" onClick={() => deleteTask(task.id)}>
                <Delete sx={{ fontSize: 18, color: '#EF4444' }} />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default TaskWidget;
