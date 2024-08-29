import React from 'react';
import { Container, Typography, Card, CardContent, Grid, Box } from '@mui/material';

interface JobDetailsProps {
  job: {}
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job
}) => {
  const { 
    title,
    location,
    datePosted,
    typeOfHelp,
    description,
    frequency,
    specialInstructions,
    mobilityRestrictions,
    numberOfApplications,
    startTiming,
    postedBy
  } = job;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
            {title}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                <strong>Location:</strong> {location}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                <strong>Date Posted:</strong> {new Date(datePosted).toLocaleDateString()}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                <strong>Type of Help:</strong> {typeOfHelp}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                <strong>Posted By:</strong> {postedBy.firstName} {postedBy.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                <strong>Number of Applications:</strong> {numberOfApplications}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                <strong>Frequency:</strong> {frequency}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                <strong>Start Timing:</strong> {startTiming}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Job Description
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 2 }}>
              {description}
            </Typography>
            {mobilityRestrictions && (
              <>
                <Typography variant="h6" component="h3" gutterBottom>
                  Mobility Restrictions
                </Typography>
                <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                  {mobilityRestrictions}
                </Typography>
              </>
            )}
            {specialInstructions && (
              <>
                <Typography variant="h6" component="h3" gutterBottom>
                  Special Instructions
                </Typography>
                <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                  {specialInstructions}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetails;
