'use client'
import * as React from 'react';
import Typography from '@mui/material/Typography';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext';


export default function BrowseJobs() {
  const router = useRouter();
  const [jobData, setJobData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = useUser();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/jobs?search=${searchQuery}`);
        if (!response.ok) {
          throw new Error(`Error fetching jobs: ${response.statusText}`);
        }
        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const onJobApply = async (jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}`);
  }

  return (
    <>
      <Typography component="h2" variant="h6" gutterBottom>
        Browse Jobs
      </Typography>
      <SearchBar onSearch={handleSearch} />
      <Grid container spacing={3}>
        {jobData.map((job, index) => (
          <Grid item xs={12} key={index}>
            <JobCard
              job={job}
              seeMoreLink={`/dashboard/jobs/${job.id}`} // Pass the "See More" link
              onApply={() => onJobApply(job.id)} // Pass the onApply callback
              currentUser={currentUser}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
