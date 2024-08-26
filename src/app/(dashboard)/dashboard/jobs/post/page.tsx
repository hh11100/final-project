'use client'
import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material';

export default function JobPost() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    typeOfHelp: '',
    specialInstructions: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post the job');
      }

      setSuccess('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        typeOfHelp: '',
        specialInstructions: '',
      });

      // Optionally, redirect to another page, e.g., job listing page
      // router.push('/jobs');
    } catch (error: Error | any) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while posting the job.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          mb: 4,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Post a New Job
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Type of Help"
              name="typeOfHelp"
              value={formData.typeOfHelp}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Special Instructions (Optional)"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Post Job
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
