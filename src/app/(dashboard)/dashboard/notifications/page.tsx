'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ChatIcon from '@mui/icons-material/Chat';
import { Notification } from '@/types';
import { useRouter } from 'next/navigation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error(`Error fetching notifications: ${response.statusText}`);
      }
      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error(`Error marking notification as read: ${response.statusText}`);
      }
      
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const initiateConversation = async (notification) => {
    try {
      const applicantId = notification.jobApplication.applicant.id;
      const jobApplicationId = notification.jobApplication.id;

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantIds: [applicantId],
          initialMessage: '',
          jobApplicationId,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error initiating conversation: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Redirecting to conversation:", data.conversationId);
      router.push(`/dashboard/messages`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Typography component="h2" variant="h6" gutterBottom>
        Notifications
      </Typography>
      <Grid container spacing={2}>
        {notifications.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2">
              You have no new notifications
            </Typography>
          </Grid>
        )}
        {notifications.map((notification, index) => (
          <Grid item xs={12} key={index}>
            <Paper
              style={{
                padding: '10px',
                display: 'flex',
                alignItems: isSmallScreen || isMediumScreen ? 'flex-start' : 'center',
                flexDirection: isSmallScreen || isMediumScreen ? 'column' : 'row',
              }}
              aria-labelledby={`notification-${index}`}
              role="region"
            >
              <Typography
                variant="body2"
                id={`notification-${index}`}
                style={{
                  flexGrow: 1,
                  marginBottom: isSmallScreen || isMediumScreen ? '10px' : 0,
                  width: isSmallScreen || isMediumScreen ? '100%' : 'auto',
                }}
              >
                {notification.type === 'application' ? (
                  <>
                    New application received for the job{" "}
                    <span
                      onClick={() =>
                        router.push(
                          `/dashboard/jobs/${notification.jobApplication.job.id}`
                        )
                      }
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {notification.jobApplication.job.title}
                    </span>{" "}
                    from {notification.jobApplication.applicant.firstName}{" "}
                    {notification.jobApplication.applicant.lastName}
                  </>
                ) : (
                  notification.message
                )}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: isSmallScreen || isMediumScreen ? 'column' : 'row',
                  alignItems: 'center',
                  gap: '10px',
                  width: isSmallScreen || isMediumScreen ? '100%' : 'auto',
                }}
              >
                {!notification.read && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => markNotificationAsRead(notification.id)}
                    aria-label="Mark as read"
                    fullWidth={isSmallScreen || isMediumScreen} // Make button full width on small/medium screens
                  >
                    <CheckIcon style={{ marginRight: 5 }} /> Mark as read
                  </Button>
                )}
                {notification.type === 'application' && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => initiateConversation(notification)}
                    aria-label="Start conversation"
                    fullWidth={isSmallScreen || isMediumScreen} // Make button full width on small/medium screens
                  >
                    <ChatIcon style={{ marginRight: 5 }} /> Start Conversation
                  </Button>
                )}
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
