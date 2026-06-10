import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, Avatar,
  List, ListItem, ListItemIcon, ListItemText, Badge, Tooltip,
  Menu, MenuItem, Divider, useMediaQuery, useTheme, InputBase
} from '@mui/material';
import {
  Dashboard, Apartment, Payment as PaymentIcon, Build, Campaign, Description,
  Message, Person, BarChart, Settings, Menu as MenuIcon,
  Notifications, LogoutSharp, ChevronLeft, Search
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

const drawerWidth = 260;
const collapsedWidth = 72;

const menuItems = [
  { path: '/', label: 'Dashboard', icon: Dashboard, section: 'main' },
  { path: '/properties', label: 'Mülkler & Birimler', icon: Apartment, badge: 6, section: 'main' },
  { path: '/payments', label: 'Kira & Aidat', icon: PaymentIcon, badge: 2, section: 'main' },
  { path: '/maintenance', label: 'Bakım Talepleri', icon: Build, badge: 3, section: 'main' },
  { path: '/announcements', label: 'Duyurular', icon: Campaign, section: 'main' },
  { path: '/contracts', label: 'Sözleşmeler', icon: Description, section: 'main' },
  { path: '/documents', label: 'Belgeler', icon: Description, section: 'main' },
  { path: '/messages', label: 'Mesajlar', icon: Message, badge: 5, section: 'communication' },
  { path: '/analytics', label: 'Raporlar', icon: BarChart, section: 'communication' },
];

const roleLabels = {
  platform_admin: 'Platform Yöneticisi',
  property_owner: 'Mülk Sahibi',
  building_manager: 'Bina/Site Yöneticisi',
  tenant: 'Kiracı',
  management_company: 'Yönetim Şirketi',
  super_admin: 'Platform Yöneticisi',
  agency_manager: 'Bina/Site Yöneticisi',
  agent: 'Mülk Sorumlusu',
  public_user: 'Kiracı',
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentWidth = collapsed && !isMobile ? collapsedWidth : drawerWidth;

  const userInitials = user
    ? `${(user.firstName || user.name || 'U')[0]}${(user.lastName || '')[0] || ''}`
    : 'U';
  const userName = user
    ? `${user.firstName || user.name || 'User'} ${user.lastName || ''}`
    : 'User';
  const userRole = roleLabels[user?.role] || 'Kullanıcı';

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0A1628 0%, #0F172A 100%)',
    }}>
      {/* Logo */}
      <Box sx={{
        p: collapsed ? 1.5 : 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
        minHeight: 72,
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #C9A84C, #E8D48B)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: '#0A1628',
          flexShrink: 0,
        }}>
          GM
        </Box>
        {!collapsed && (
          <Box>
            <Typography sx={{
              color: '#F1F5F9',
              fontWeight: 700,
              fontSize: 15,
              lineHeight: 1.2,
              fontFamily: "'Outfit', sans-serif",
            }}>
              Gayrimenkul
            </Typography>
            <Typography sx={{
              color: '#C9A84C',
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.05em',
            }}>
              MERKEZİM
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              ml: 'auto',
              color: 'rgba(148, 163, 184, 0.6)',
              width: 28, height: 28,
              '&:hover': { background: 'rgba(201, 168, 76, 0.1)', color: '#C9A84C' }
            }}
          >
            <ChevronLeft sx={{
              fontSize: 18,
              transform: collapsed ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease',
            }} />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 2, px: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const showDivider = index > 0 && menuItems[index - 1].section !== item.section;

          return (
            <React.Fragment key={item.path}>
              {showDivider && (
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', my: 1.5, mx: 1 }} />
              )}
              <Tooltip
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
                    mb: 0.3,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(201, 168, 76, 0.12), rgba(201, 168, 76, 0.05))'
                      : 'transparent',
                    borderLeft: isActive ? '3px solid #C9A84C' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    px: collapsed ? 1.5 : 2,
                    py: 1.1,
                    '&:hover': {
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(201, 168, 76, 0.18), rgba(201, 168, 76, 0.08))'
                        : 'rgba(255,255,255,0.03)',
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: collapsed ? 'auto' : 38,
                    color: isActive ? '#C9A84C' : 'rgba(148, 163, 184, 0.7)',
                  }}>
                    <Badge
                      badgeContent={item.badge}
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: 10,
                          height: 17,
                          minWidth: 17,
                          background: isActive ? '#C9A84C' : '#EF4444',
                          color: isActive ? '#0A1628' : '#fff',
                          fontWeight: 700,
                        }
                      }}
                    >
                      <item.icon sx={{ fontSize: 21 }} />
                    </Badge>
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: {
                          color: isActive ? '#F1F5F9' : 'rgba(148, 163, 184, 0.9)',
                          fontWeight: isActive ? 600 : 400,
                          fontSize: 13.5,
                          fontFamily: "'Inter', sans-serif",
                        }
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            </React.Fragment>
          );
        })}
      </List>

      {/* User Section */}
      <Box sx={{
        p: collapsed ? 1.5 : 2,
        borderTop: '1px solid rgba(201, 168, 76, 0.08)',
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: collapsed ? 0.8 : 1.5,
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { background: 'rgba(201, 168, 76, 0.08)' }
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Avatar sx={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #C9A84C, #E8D48B)',
            fontSize: 13,
            fontWeight: 700,
            color: '#0A1628',
            fontFamily: "'Outfit', sans-serif",
          }}>
            {userInitials}
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography sx={{
                color: '#F1F5F9',
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {userName}
              </Typography>
              <Typography sx={{
                color: '#C9A84C',
                fontSize: 11,
                fontWeight: 500,
              }}>
                {userRole}
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
      background: 'linear-gradient(135deg, #0F172A 0%, #1a2332 50%, #0F172A 100%)',
    }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            background: 'rgba(10, 22, 40, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 1px 0 rgba(201, 168, 76, 0.1)',
            borderBottom: 'none',
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
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 30,
                height: 30,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #C9A84C, #E8D48B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#0A1628',
              }}>GM</Box>
              <Typography sx={{ fontWeight: 600, fontFamily: "'Outfit', sans-serif", fontSize: 16 }}>
                Gayrimenkul Merkezim
              </Typography>
            </Box>
            <IconButton sx={{ color: '#F1F5F9' }}>
              <Badge badgeContent={3} sx={{ '& .MuiBadge-badge': { background: '#C9A84C', color: '#0A1628', fontWeight: 700 } }}>
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
            borderRight: '1px solid rgba(201, 168, 76, 0.06)',
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
        {/* Top bar (desktop only) */}
        {!isMobile && (
          <Box sx={{
            px: 3,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}>
            {/* Search */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.8,
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              flex: 1,
              maxWidth: 400,
              transition: 'all 0.2s ease',
              '&:focus-within': {
                borderColor: 'rgba(201, 168, 76, 0.3)',
                background: 'rgba(255,255,255,0.06)',
              }
            }}>
              <Search sx={{ color: '#64748B', fontSize: 18 }} />
              <InputBase
                placeholder="Mülk, kiracı, ödeme veya belge ara..."
                sx={{
                  flex: 1,
                  color: '#F1F5F9',
                  fontSize: 13,
                  '& ::placeholder': { color: '#64748B', opacity: 1 },
                }}
              />
              <Typography sx={{
                color: '#64748B',
                fontSize: 11,
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                px: 0.8,
                py: 0.1,
              }}>⌘K</Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Notifications */}
            <IconButton sx={{ color: '#94A3B8', '&:hover': { color: '#C9A84C' } }}>
              <Badge badgeContent={3} sx={{ '& .MuiBadge-badge': { background: '#C9A84C', color: '#0A1628', fontWeight: 700, fontSize: 10 } }}>
                <Notifications sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>

            {/* Settings */}
            <IconButton sx={{ color: '#94A3B8', '&:hover': { color: '#C9A84C' } }}>
              <Settings sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        )}

        {children}
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            borderRadius: '12px',
          }
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem
          onClick={() => { setAnchorEl(null); navigate('/profile'); }}
          sx={{ color: '#F1F5F9', fontSize: 13, py: 1.2, '&:hover': { background: 'rgba(201,168,76,0.08)' } }}
        >
          <Person sx={{ mr: 1.5, fontSize: 18, color: '#C9A84C' }} /> Profil
        </MenuItem>
        <MenuItem
          onClick={() => setAnchorEl(null)}
          sx={{ color: '#F1F5F9', fontSize: 13, py: 1.2, '&:hover': { background: 'rgba(201,168,76,0.08)' } }}
        >
          <Settings sx={{ mr: 1.5, fontSize: 18, color: '#94A3B8' }} /> Ayarlar
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(201,168,76,0.1)' }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ color: '#EF4444', fontSize: 13, py: 1.2, '&:hover': { background: 'rgba(239,68,68,0.08)' } }}
        >
          <LogoutSharp sx={{ mr: 1.5, fontSize: 18 }} /> Çıkış Yap
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MainLayout;
