import React from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';

interface JobDetailsProps {
  title: string;
  description: string;
  datePosted: string;
  location: string;
  typeOfHelp: string;
  specialInstructions?: string;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  title,
  description,
  datePosted,
  location,
  typeOfHelp,
  specialInstructions,
}) => {
  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Location: {location}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Date Posted: {datePosted}
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            Type of Help Needed: {typeOfHelp}
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            {description}
          </Typography>
          {specialInstructions && (
            <>
              <Typography variant="h6" component="h3" gutterBottom>
                Special Instructions:
              </Typography>
              <Typography variant="body1" component="p">
                {specialInstructions}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetails;
