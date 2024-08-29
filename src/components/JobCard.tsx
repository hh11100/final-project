import React from 'react';
import { Card, CardContent, Typography, Link, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

interface JobCardProps {
  job: {}, // Job object
  seeMoreLink?: string; // Optional prop for the "See More" link
  currentUser: {},
  onApply?: () => void; // Optional prop for the onApply callback
}

const JobCard: React.FC<JobCardProps> = ({ job, seeMoreLink, onApply, currentUser }) => {
  const { title, description, datePosted, location, postedBy } = job;
  const jobPostedByCurrentUser = () => {
    // Check if the job was posted by the current user
    return postedBy.id === currentUser.id;
  }
  const router = useRouter();

  return (
    <Card variant="outlined" style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          <Link  onClick={() => router.push(seeMoreLink)} style={{ marginTop: '10px', cursor: 'pointer' }}>{title}</Link>
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
        <Typography color="textSecondary" style={{ marginTop: '10px' }}>
          Posted by: {postedBy.firstName} {postedBy.lastName}
        </Typography>
        
        <Box style={{ marginTop: '20px' }} display="flex" justifyContent="flex-end">
        {seeMoreLink && (
          <Button variant="contained" color="primary"onClick={() => router.push(seeMoreLink)} style={{ marginRight: 10 }}>
            Details
          </Button>
          )}
          {!jobPostedByCurrentUser() ? <Button variant="contained" color="primary" onClick={onApply}>
            Apply
          </Button> : null }
        </Box>
      </CardContent> 
    </Card>
  );
};

export default JobCard;
