import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { AccountCircle, Email, Person, Phone, Lock, LocationOn } from '@mui/icons-material';

const Signup = () => {
  const initialState = {
    name: '',
    email: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    status: 'Pending'
  };

  const [formData, setFormData] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // 'success' or 'error'

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSuccess = () => {
    setMessage('Signed up successfully!');
    setSeverity('success');
    setOpen(true);
    setFormData(initialState); // Reset the form fields
  };

  const handleError = (errorMsg) => {
    setMessage(errorMsg || 'Not Signed up yet. Try Again!');
    setSeverity('error');
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7282/api/Students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok) {
        handleSuccess();
      } else {
        handleError(await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
      handleError();
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '100vh' }}>
      <Box sx={{
        width: '45%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: '24px',
        backgroundColor: '#ffffff'
      }}>
        <Typography component="h1" variant="h5" sx={{ marginBottom: '16px', color: '#333333' }}>
          Signup
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            InputProps={{
              startAdornment: <AccountCircle />
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Email />
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Person />
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            pattern="[0-9]{10}"
            InputProps={{
              startAdornment: <Phone />
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Lock />
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Lock />
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            InputProps={{
              startAdornment: <LocationOn />
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#007bff',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#0056b3'
              }
            }}
          >
            Submit
          </Button>
          <Typography variant="body2" align="center">
            Already have an account? <Link href="/login">Login</Link>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: '55%',  minHeight: '100vh',textAlign: 'center' }}>
        <img 
          src="https://img.freepik.com/free-photo/3d-character-emerging-from-smartphone_23-2151336507.jpg?t=st=1713642159~exp=1713645759~hmac=6e02807bcb7bd44028bde60e94aaebb6b2c0e2481f6e3c01c86e56261fd4c773&w=740" 
          alt="signup image" 
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </Box>
    </Container>
  );
};

export default Signup;
