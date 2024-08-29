'use client'
import * as React from 'react';
import { useEffect, useState } from 'react';
import JobDetails from '@/components/JobDetails';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Job } from '@/types';
const { useUser } = require('@/context/UserContext');

export default function Page({ params }: { params: { id: string } }) {
  const [jobDetailData, setJobDetailData] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const { user } = useUser();

  const id = params.id;

  const checkIfPostedByCurrentUser = () => {
    return jobDetailData?.postedBy.id === user.id;
  }

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (response.status === 404) {
          setError(`Job with id ${id} not found`);
          return;
        }
        if (!response.ok) {
          throw new Error(`Error fetching job: ${response.statusText}`);
        }
        const data = await response.json();

        setJobDetailData(data);
      } catch (error: Error | any) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An error occurred while fetching the job.');
        }
      }
    }

    async function checkIfApplied() {
      try {
        const response = await fetch(`/api/jobs/${id}/applications`, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Failed to check application status.');
        }

        const data = await response.json();
        console.log(data);
        if (data !== null) {
          setHasApplied(true);
        }
      } catch (error: any) {
        setSubmissionMessage(`Error: ${error.message}`);
      }
    }

    if (id) {
      fetchJob();
      checkIfApplied();
    }
  }, [id]);

  const handleApply = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'some-user-id', // Replace with actual user ID logic
        },
        body: JSON.stringify({ coverLetter }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the application.');
      }

      setSubmissionMessage('Your application has been submitted successfully!');
      setHasApplied(true); // Update state to indicate the user has applied
    } catch (error: any) {
      setSubmissionMessage(`Error: ${error.message}`);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!jobDetailData) {
    return <div>Loading...</div>; // or any other placeholder content or spinner
  }

  return (
    <Box>
      <JobDetails job={jobDetailData} />

      {hasApplied ? (
        <Typography variant="h6" color="primary" style={{ marginTop: '20px' }}>
          You have already applied for this job.
        </Typography>
      ) : (
        <>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Apply for this job
          </Typography>

          {submissionMessage && (
            <Typography color="primary" style={{ marginTop: '10px' }}>
              {submissionMessage}
            </Typography>
          )}

          {!checkIfPostedByCurrentUser() && user.accountType === 'helper' && (
            <Box component="form" noValidate autoComplete="off" style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                label="Cover Letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                margin="normal"
                multiline
                rows={4}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={handleApply}
              >
                Submit Application
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
