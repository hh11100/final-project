'use client'
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Button, Typography, Container, Box, Card, CardContent, CardActions, Grid } from '@mui/material';
import HelpRequestWizard from '@/components/HelpRequestWizard';
import CurrentRequests from '@/components/CurrentRequests';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Dashboard = () => {
  const { user } = useUser() as { user: User | null; clearCache: () => void; };
  const [hasRequests, setHasRequests] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchHelpRequests = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs?currentUser=true`);
      const data = await response.json();
      setHasRequests(data.length > 0);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch help requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async () => {
    try {
      const response = await fetch(`/api/jobs/applications`);
      const data = await response.json();
      setJobApplications(data);
    } catch (error) {
      console.error('Failed to fetch job applications:', error);
    }
  }

  const onHelpRequestCreated = () => {
    fetchHelpRequests();
  }

  useEffect(() => {
    if (user) {
      fetchHelpRequests();
      fetchJobApplications();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Welcome back, {user.firstName}!</Typography>
        {user.accountType === 'helper' ? (
          <>
            {jobApplications.length > 0 ? (
              <Typography variant="subtitle1">Here are the help requests you've applied to:</Typography>
            ) : (
              <Typography variant="subtitle1">You haven't applied to any help requests yet. Start browsing the <Link href="/dashboard/jobs">jobs.</Link></Typography>
            )}
          </>
        ) : (
          <Typography variant="subtitle1">Let's get the help you need.</Typography>
        )}
      </Box>

      {user.accountType === 'helper' ? (
        jobApplications.length > 0 ? (
          <Grid container spacing={3}>
            {jobApplications.map((application) => (
              <Grid item xs={12} sm={6} md={4} key={application.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {application.job.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {application.status}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ mt: 'auto' }}>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => router.push(`/dashboard/jobs/${application.job.id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No help requests available at the moment.</Typography>
        )
      ) : (
        hasRequests ? (
          <CurrentRequests requests={requests} />
        ) : (
          <HelpRequestWizard onHelpRequestCreated={onHelpRequestCreated} />
        )
      )}
    </Container>
  );
};

export default Dashboard;
