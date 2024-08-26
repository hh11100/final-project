import React from 'react';
import { Card, CardContent, Typography, Link, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

interface JobCardProps {
  title: string;
  description: string;
  datePosted: string;
  location: string;
  seeMoreLink?: string; // Optional prop for the "See More" link
  postedBy: {},
  currentUser: {},
  onApply?: () => void; // Optional prop for the onApply callback
}

const JobCard: React.FC<JobCardProps> = ({ title, description, datePosted, location, seeMoreLink, postedBy, onApply, currentUser }) => {
  const jobPostedByCurrentUser = () => {
    // Check if the job was posted by the current user
    return postedBy.id === currentUser.id;
  }
  const router = useRouter();

  return (
    <Card variant="outlined" style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {location}
        </Typography>
        <Typography variant="body2" component="p">
          {description}
        </Typography>
        <Typography color="textSecondary" style={{ marginTop: '10px' }}>
          Posted on: {datePosted}
        </Typography>
        {seeMoreLink && (
          <Typography onClick={() => router.push(seeMoreLink)} style={{ marginTop: '10px', cursor: 'pointer' }}>
            See More
          </Typography>
        )}
        {!jobPostedByCurrentUser() ? <Box style={{ marginTop: '20px' }} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={onApply}>
            Apply
          </Button>
        </Box> : null }
      </CardContent> 
    </Card>
  );
};

export default JobCard;
