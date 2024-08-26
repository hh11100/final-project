import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, CardActions } from '@mui/material';

const CurrentRequests = ({ requests }) => {
  if (requests.length === 0) {
    return <Typography variant="subtitle1">You have no current requests.</Typography>;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Your Current Requests</Typography>
      <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {request.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {request.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto' }}>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => {
                    // Define action, for example, view request details
                  }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CurrentRequests;
