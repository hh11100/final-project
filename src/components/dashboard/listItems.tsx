import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation'; 

export const mainListItems = ({ user }) => {
  const Router = useRouter();

  return (
    <React.Fragment>
      <ListItemButton onClick={() => Router.push('/dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      {/* Render menu items based on the account type */}
      {user?.accountType === 'helper' && (
        <ListItemButton onClick={() => Router.push('/dashboard/jobs')}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Browse Jobs" />
        </ListItemButton>
      )}

      {user?.accountType === 'helper' && (
        <ListItemButton onClick={() => Router.push('/dashboard/schedule')}>
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="My Schedule" />
        </ListItemButton>
      )}

      <ListItemButton onClick={() => Router.push('/dashboard/messages')}>
        <ListItemIcon>
          <MessageIcon />
        </ListItemIcon>
        <ListItemText primary="Messages" />
      </ListItemButton>

      <ListItemButton onClick={() => Router.push('/dashboard/notifications')}>
        <ListItemIcon>
          <NotificationsIcon />
        </ListItemIcon>
        <ListItemText primary="Notifications" />
      </ListItemButton>

      <ListItemButton onClick={() => Router.push('/dashboard/settings')}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>

      <ListItemButton onClick={() => Router.push('/logout')}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
};
