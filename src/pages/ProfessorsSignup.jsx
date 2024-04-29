import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, InputAdornment, makeStyles } from '@material-ui/core';
import { AccountCircle, Email, Lock, Phone, School, CloudUpload } from '@material-ui/icons';
 
const useStyles = makeStyles((theme) => ({
  signUpContainer: {
    maxWidth: '400px',
    margin: 'auto',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  },
  formGroup: {
    marginBottom: theme.spacing(2),
  },
  error: {
    color: 'red',
    marginBottom: theme.spacing(2),
  },
  uploadInput: {
    display: 'none',
  },
}));
 
function ProfessorSignup() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [qualificationCertificate, setQualificationCertificate] = useState('');
  const [qualificationCertificateName, setQualificationCertificateName] = useState(''); // Added
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [signedUp, setSignedUp] = useState(false);
 
  const handleCheckEmailExists = async (email) => {
    try {
      const response = await fetch(`https://localhost:7282/api/Professors/CheckEmail?email=${email}`);
      if (!response.ok) {
        throw new Error('Failed to check email existence');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailExists = await handleCheckEmailExists(email);
      if (emailExists) {
        setErrors({ ...errors, email: 'Email already exists' });
        return;
      }
 
 // Remove the prefix 'data:image/png;base64,' from the qualificationCertificate field
 const certificateBase64 = qualificationCertificate.split(',')[1]; // Extract the Base64 part
 
 // Prepare form data
 const formData = {
   name,
   email,
   specialization,
   qualificationCertificate: certificateBase64, // Assign only the Base64 string
   phoneNumber,
   password,
   confirmPassword
 };
 
      // Perform form validation
      const validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
 
      // If validation succeeds, submit the form
      console.log(formData);
 
      // Submit the form to the backend API
      const response = await fetch('https://localhost:7282/api/Professors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify JSON content type
        },
        body: JSON.stringify(formData) // Convert form data to JSON
      });
 
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
 
      setSignedUp(true);
 
    } catch (error) {
      console.error('Error:', error);
    }
  };
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setQualificationCertificate(reader.result);
      setQualificationCertificateName(file.name);
    };
    reader.readAsDataURL(file);
  };
 
  const validate = (data) => {
    const errors = {};
 
    // Name validation
    if (!data.name) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]*$/.test(data.name)) {
      errors.name = 'Name should only contain letters and spaces';
    }
 
    // Email validation
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email address';
    }
 
    // Specialization validation
    if (!data.specialization) {
      errors.specialization = 'Specialization is required';
    }
 
    // Qualification validation
    // You can add validation rules for qualification if needed
 
    // Phone Number validation
    if (!data.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(data.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number';
    }
 
    // Password validation
    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}/.test(data.password)) {
      errors.password = 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character';
    }
 
    // Confirm Password validation
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
 
    // Qualification Certificate validation
    if (!data.qualificationCertificate) {
      errors.qualificationCertificate = 'Qualification certificate is required';
    }
 
    return errors;
  };
 
 
  // If signedUp is true, redirect to the login page
  if (signedUp) {
    window.location.href = '/';
    return null; // Render nothing if redirecting
  }
 
  return (
    <div className={classes.signUpContainer}>
    <Typography variant="h4" component="h2" gutterBottom align="center">
      Professor Sign Up
    </Typography>
    <form onSubmit={handleSubmit} className="signup-form">
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.formGroup}>
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
            variant="outlined"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          {errors.name && <div className={classes.error}>{errors.name}</div>}
        </Grid>
        <Grid item xs={12} className={classes.formGroup}>
          <TextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="outlined"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          {errors.email && <div className={classes.error}>{errors.email}</div>}
        </Grid>
        <Grid item xs={12} className={classes.formGroup}>
          <TextField
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            label="Specialization"
            variant="outlined"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <School />
                </InputAdornment>
              ),
            }}
          />
          {errors.specialization && <div className={classes.error}>{errors.specialization}</div>}
        </Grid>
        <Grid item xs={12} className={classes.formGroup}>
            <input
              type="file"
              onChange={handleImageChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className={classes.uploadInput}
              id="qualification-certificate"
            />
            <TextField
              type="text"
              value={qualificationCertificateName}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CloudUpload />
                  </InputAdornment>
                ),
              }}
              onClick={() => document.getElementById('qualification-certificate').click()}
              required
              disabled
            />
            <label htmlFor="qualification-certificate">
              <Button variant="outlined" color="primary" component="span" fullWidth>
                Upload Your Qualification Certificate
              </Button>
            </label>
            {errors.qualificationCertificate && (
              <div className={classes.error}>{errors.qualificationCertificate}</div>
            )}
          </Grid>
        <Grid item xs={12} className={classes.formGroup}>
          <TextField
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            label="Phone Number"
            variant="outlined"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />
          {errors.phoneNumber && <div className={classes.error}>{errors.phoneNumber}</div>}
        </Grid>
        <Grid item xs={12} className={classes.formGroup}>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            variant="outlined"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          {errors.password && <div className={classes.error}>{errors.password}</div>}
        </Grid>
        <Grid item xs={12} className={classes.formGroup}>
          <TextField
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
            variant="outlined"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          {errors.confirmPassword && <div className={classes.error}>{errors.confirmPassword}</div>}
        </Grid>
        <Grid item xs={12} className={classes.formGroup}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </form>
  </div>
);
}
 
export default ProfessorSignup;