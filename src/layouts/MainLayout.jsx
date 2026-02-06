import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, Avatar,
  List, ListItem, ListItemIcon, ListItemText, Badge, Tooltip,
  Menu, MenuItem, Divider, useMediaQuery, useTheme
} from '@mui/material';
import {
  Home, Payment, Build, Campaign, Description, Message, Person,
  Menu as MenuIcon, Notifications, Settings, LogoutSharp,
  ChevronLeft, Search, DarkMode
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

const drawerWidth = 260;
const collapsedWidth = 72;

const menuItems = [
  { path: '/', label: 'Ana Sayfa', icon: Home },
  { path: '/payments', label: 'Ödemeler', icon: Payment, badge: 1 },
  { path: '/maintenance', label: 'Bakım Talepleri', icon: Build, badge: 2 },
  { path: '/announcements', label: 'Duyurular', icon: Campaign },
  { path: '/documents', label: 'Belgeler', icon: Description },
  { path: '/messages', label: 'Mesajlar', icon: Message, badge: 3 },
  { path: '/profile', label: 'Profil', icon: Person },
];

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const logout = useAuthStore((state) => state.logout);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentWidth = collapsed && !isMobile ? collapsedWidth : drawerWidth;

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <Box sx={{
        p: collapsed ? 1.5 : 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Avatar sx={{
          width: 40,
          height: 40,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          fontSize: 16,
          fontWeight: 700,
        }}>
          GM
        </Avatar>
        {!collapsed && (
          <Box>
            <Typography sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              lineHeight: 1.2,
            }}>
              Gayrimenkul
            </Typography>
            <Typography sx={{
              color: 'rgba(148, 163, 184, 0.7)',
              fontSize: 11,
            }}>
              Merkezim
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              ml: 'auto',
              color: 'rgba(148, 163, 184, 0.6)',
              '&:hover': { background: 'rgba(255,255,255,0.05)' }
            }}
          >
            <ChevronLeft sx={{
              transform: collapsed ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease',
            }} />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 2, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <ListItem
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                  px: collapsed ? 1.5 : 2,
                  py: 1.2,
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.15))'
                      : 'rgba(255,255,255,0.03)',
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: collapsed ? 'auto' : 40,
                  color: isActive ? '#818cf8' : 'rgba(148, 163, 184, 0.7)',
                }}>
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: 10,
                        height: 18,
                        minWidth: 18,
                      }
                    }}
                  >
                    <item.icon sx={{ fontSize: 22 }} />
                  </Badge>
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        color: isActive ? '#fff' : 'rgba(148, 163, 184, 0.9)',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: 14,
                      }
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* User Section */}
      <Box sx={{
        p: collapsed ? 1.5 : 2,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: collapsed ? 0.5 : 1.5,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { background: 'rgba(255,255,255,0.03)' }
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Avatar sx={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            fontSize: 14,
            fontWeight: 600,
          }}>
            JD
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1 }}>
              <Typography sx={{
                color: '#fff',
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.2,
              }}>
                John Doe
              </Typography>
              <Typography sx={{
                color: 'rgba(148, 163, 184, 0.6)',
                fontSize: 11,
              }}>
                Daire 4B
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography sx={{ flex: 1, fontWeight: 600 }}>
              Gayrimenkul Merkezim
            </Typography>
            <IconButton sx={{ color: '#fff' }}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: currentWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? drawerWidth : currentWidth,
            boxSizing: 'border-box',
            border: 'none',
            transition: 'width 0.3s ease',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          mt: isMobile ? 8 : 0,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: 200,
          }
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }} sx={{ color: '#fff' }}>
          <Person sx={{ mr: 1.5, fontSize: 18 }} /> Profil
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: '#fff' }}>
          <Settings sx={{ mr: 1.5, fontSize: 18 }} /> Ayarlar
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
          <LogoutSharp sx={{ mr: 1.5, fontSize: 18 }} /> Çıkış Yap
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MainLayout;
