'use client'
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { MainListItems } from '@/components/dashboard/ListItems';
import { Copyright } from '@/components/Copyright';
import useMediaQuery from '@mui/material/useMediaQuery';
import { theme } from '@/lib/theme';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

const MyAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const MyDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '100%', // Full screen width
    height: '100%', // Full screen height
    boxSizing: 'border-box',
  },
}));

export default function Layout({ children }) {
  const [open, setOpen] = useState(false); // Start with drawer closed
  const [notificationCount, setNotificationCount] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const { user } = useUser() as { user: User };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch('/api/notifications/count');
        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data);
        } else {
          console.error('Failed to fetch notification count');
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();

    // Polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <MyAppBar position="absolute" open={open && !isMobile}>
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && !isMobile && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
          </Typography>
          <IconButton onClick={() => router.push('/dashboard/notifications')} color="inherit" aria-label="view notifications">
            <Badge badgeContent={notificationCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </MyAppBar>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {isMobile ? (
          <MobileDrawer
            variant="temporary"
            open={open}
            onClose={toggleDrawer}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer} aria-label="close drawer">
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav" onClick={toggleDrawer}>{MainListItems({ user })}</List>
          </MobileDrawer>
        ) : (
          <MyDrawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer} aria-label="close drawer">
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">{MainListItems({ user })}</List>
          </MyDrawer>
        )}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Toolbar /> {/* Ensures content is not overlapped by AppBar */}
          <Container
            maxWidth="lg"
            sx={{
              mt: 4,
              mb: 4,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {children}
          </Container>
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: theme.palette.grey[200],
            }}
          >
            <Container maxWidth="lg">
              <Copyright />
            </Container>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
