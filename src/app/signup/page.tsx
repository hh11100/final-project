'use client'
import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Link,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SignUp = () => {
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState([]);
  const [accountType, setAccountType] = useState('seeker');

  const handleChange = (e) => {
    const formData = new FormData(e.currentTarget);
    setAccountType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrorMessages([]);

    const response = await fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        accountType,
      }),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      const error = await response.json();
      setErrorMessages(error.message);
    }
  };

  const renderErrorMessages = () =>
    errorMessages.map((err, index) => (
      <Typography key={index} variant="body2" color="error" role="alert">
        {err}
      </Typography>
    ));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image src="/logo.PNG" alt="Logo" width={120} height={120} />
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Sign Up
        </Typography>

        {errorMessages.length > 0 && renderErrorMessages()}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                InputLabelProps={{
                  'aria-label': 'First Name',
                }}
                inputProps={{
                  'aria-required': 'true',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                InputLabelProps={{
                  'aria-label': 'Last Name',
                }}
                inputProps={{
                  'aria-required': 'true',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                InputLabelProps={{
                  'aria-label': 'Email Address',
                }}
                inputProps={{
                  'aria-required': 'true',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                InputLabelProps={{
                  'aria-label': 'Password',
                }}
                inputProps={{
                  'aria-required': 'true',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" aria-label="Select your account type">
                  Account Type
                </FormLabel>
                <RadioGroup
                  aria-label="account-type"
                  name="accountType"
                  value={accountType}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value="seeker"
                    control={<Radio color="secondary" />}
                    label="Seeker (Elderly individual)"
                    aria-label="Seeker account type"
                  />
                  <FormControlLabel
                    value="helper"
                    control={<Radio color="secondary" />}
                    label="Helper (Caregiver/Service Provider)"
                    aria-label="Helper account type"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link onClick={() => router.push('/login')} variant="body2" aria-label="Go to login page">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
