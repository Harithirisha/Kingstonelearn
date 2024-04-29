// import React, { useState } from 'react';
// import { Link, Navigate } from 'react-router-dom';
// import { TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, Grid, FormControl, InputAdornment, makeStyles } from '@material-ui/core';
// import { AccountCircle, Lock } from '@material-ui/icons';

// const useStyles = makeStyles((theme) => ({
//   loginContainer: {
//     maxWidth: '400px',
//     margin: 'auto',
//     padding: theme.spacing(4),
//     borderRadius: theme.spacing(1),
//     boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
//     backgroundColor: '#ffffff',
//   },
//   formGroup: {
//     marginBottom: theme.spacing(2),
//   },
//   error: {
//     color: 'red',
//     marginBottom: theme.spacing(2),
//   },
//   signUpLink: {
//     display: 'flex',
//     justifyContent: 'center',
//   },
// }));

// function Login() {
//   const classes = useStyles();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       let response;
//       let idEndpoint;
//       let isAdmin = false;
     
//       if (email === 'admin@gmail.com' && password === 'Admin@123') {
//         isAdmin = true;
       
//         // For admin login, generate student token
//         response = await fetch('https://localhost:7282/api/Students/AdminLogin', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email:'admin@gmail.com', password:'Admin@123' }),
//         });
     
//         if (!response.ok) {
//           throw new Error('Invalid admin credentials');
//         }
     
//         const data = await response.json();
//         const token = data.token;
     
//         // Store the token for admin
//         localStorage.setItem('token', token);
//         setIsLoggedIn(true);
//       } else {
//         if (!role) {
//           throw new Error('Please select a role');
//         }

//         // For other users, fetch based on role
//         if (role === 'Student') {
//           response = await fetch(`https://localhost:7282/api/Students/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
//             method: 'POST',
//             headers: {
//               'Accept': 'application/json'
//             }
//           });
//           idEndpoint = 'Students';
//         } else if (role === 'Professor') {
//           response = await fetch(`https://localhost:7282/api/Professors/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
//             method: 'POST',
//             headers: {
//               'Accept': 'application/json'
//             }
//           });
//           idEndpoint = 'Professors';
//         }

//         if (!response.ok) {
//           throw new Error('Invalid Username or password');
//         }
//       }

//       const data = await response.json();
//       const token = data.token;

//       if (!isAdmin) {
//         // Fetching ProfessorId or StudentId based on the role
//         const responseId = await fetch(`https://localhost:7282/api/${idEndpoint}/GetIdByEmail?email=${encodeURIComponent(email)}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           }
//         });

//         if (!responseId.ok) {
//           throw new Error('Error retrieving Id');
//         }

//         const idData = await responseId.json();
//         const userId = idData;

//         // Fetching status based on the user ID
//         const statusResponse = await fetch(`https://localhost:7282/api/${idEndpoint}/GetStatusById?id=${userId}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           }
//         });

//         if (!statusResponse.ok) {
//           throw new Error('Error retrieving status');
//         }

//         const statusData = await statusResponse.json();
//         const userStatus = statusData;

//         let errorMessage = '';

//         switch (userStatus) {
//           case 'Pending':
//             errorMessage = 'Your request is under process.';
//             break;
//           case 'Suspended':
//             errorMessage = 'Your account is suspended. Please contact the office.';
//             break;
//           case 'Rejected':
//             errorMessage = 'Your request is rejected.';
//             break;
//           default:
//             break;
//         }

//         if (errorMessage) {
//           throw new Error(errorMessage);
//         }

//         // Storing the Id and role in local storage
//         localStorage.setItem('userId', userId);
//         localStorage.setItem('userRole', role);
//       }

//       localStorage.setItem('token', token);
//       setIsLoggedIn(true);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   if (isLoggedIn) {
//     // Redirect to AdminDashboard if the user is admin
//     if (email === 'admin@gmail.com' && password === 'Admin@123') {
//       return <Navigate to="/admin-dashboard" />;
//     }
//     // Otherwise, redirect based on role
//     return role === 'Professor' ? <Navigate to="/professor-dashboard" /> : <Navigate to="/student-dashboard" />;
//   }

//   return (
//     <div className={classes.loginContainer}>
//       <form onSubmit={handleLogin} className="login-form">
//         <Typography variant="h4" component="h2" gutterBottom align="center">
//           Login
//         </Typography>
//         {error && <div className={classes.error}>{error}</div>}
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} className={classes.formGroup}>
//             <TextField
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               label="Email"
//               variant="outlined"
//               fullWidth
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <AccountCircle />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} className={classes.formGroup}>
//             <TextField
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               label="Password"
//               variant="outlined"
//               fullWidth
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Lock />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} className={classes.formGroup}>
//             <FormControl component="fieldset">
//               <RadioGroup aria-label="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} row>
//                 <FormControlLabel value="Student" control={<Radio />} label="Student" />
//                 <FormControlLabel value="Professor" control={<Radio />} label="Professor" />
//               </RadioGroup>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} className={classes.formGroup}>
//             <Button type="submit" variant="contained" color="primary" fullWidth>
//               Login
//             </Button>
//           </Grid>
//           <Grid item xs={12} className={classes.signUpLink}>
//             <Typography variant="body2">
//               <Link to="/student-signup">Signup as Student</Link>
//             </Typography>
//             <Typography variant="body2" style={{marginLeft: '16px'}}>
//               <Link to="/professor-signup">Signup as Professor</Link>
//             </Typography>
//           </Grid>
//         </Grid>
//       </form>
//     </div>
//   );
// }

// export default Login;



import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, Grid, FormControl, InputAdornment, makeStyles, Box } from '@material-ui/core';
import { AccountCircle, Lock } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    maxWidth: '800px',
    margin: 'auto',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  },
  loginForm: {
    flex: 1,
    paddingRight: theme.spacing(2),
  },
  imageContainer: {
    flex: 1,
    background: `url('https://img.freepik.com/free-photo/3d-character-emerging-from-smartphone_23-2151336507.jpg?t=st=1713818045~exp=1713821645~hmac=35c101897c8940928d762a80b32250693154debf665466e3d140ab0ac663bc4f&w=740')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  formGroup: {
    marginBottom: theme.spacing(2),
  },
  error: {
    color: 'red',
    marginBottom: theme.spacing(2),
  },
  signUpLink: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function Login() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response;
      let idEndpoint;
      let isAdmin = false;

      if (email === 'admin@gmail.com' && password === 'Admin@123') {
        isAdmin = true;

        response = await fetch('https://localhost:7282/api/Students/AdminLogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email:'admin@gmail.com', password:'Admin@123' }),
        });

        if (!response.ok) {
          throw new Error('Invalid admin credentials');
        }

        const data = await response.json();
        const token = data.token;

        localStorage.setItem('token', token);
        setIsLoggedIn(true);
      } else {
        if (!role) {
          throw new Error('Please select a role');
        }

        if (role === 'Student') {
          response = await fetch(`https://localhost:7282/api/Students/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            }
          });
          idEndpoint = 'Students';
        } else if (role === 'Professor') {
          response = await fetch(`https://localhost:7282/api/Professors/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            }
          });
          idEndpoint = 'Professors';
        }

        if (!response.ok) {
          throw new Error('Invalid Username or password');
        }
      }

      const data = await response.json();
      const token = data.token;

      if (!isAdmin) {
        const responseId = await fetch(`https://localhost:7282/api/${idEndpoint}/GetIdByEmail?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!responseId.ok) {
          throw new Error('Error retrieving Id');
        }

        const idData = await responseId.json();
        const userId = idData;

        const statusResponse = await fetch(`https://localhost:7282/api/${idEndpoint}/GetStatusById?id=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!statusResponse.ok) {
          throw new Error('Error retrieving status');
        }

        const statusData = await statusResponse.json();
        const userStatus = statusData;

        let errorMessage = '';

        switch (userStatus) {
          case 'Pending':
            errorMessage = 'Your request is under process.';
            break;
          case 'Suspended':
            errorMessage = 'Your account is suspended. Please contact the office.';
            break;
          case 'Rejected':
            errorMessage = 'Your request is rejected.';
            break;
          default:
            break;
        }

        if (errorMessage) {
          throw new Error(errorMessage);
        }

        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', role);
      }

      localStorage.setItem('token', token);
      setIsLoggedIn(true);
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoggedIn) {
    if (email === 'admin@gmail.com' && password === 'Admin@123') {
      return <Navigate to="/admin-dashboard" />;
    }
    return role === 'Professor' ? <Navigate to="/professor-dashboard" /> : <Navigate to="/student-dashboard" />;
  }

  return (
    <div className={classes.loginContainer}>
      <div className={classes.loginForm}>
        <form onSubmit={handleLogin} className="login-form">
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Login
          </Typography>
          {error && <div className={classes.error}>{error}</div>}
          <Grid container spacing={2} alignItems="center">
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
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
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
            </Grid>
            <Grid item xs={12} className={classes.formGroup}>
              <FormControl component="fieldset">
                <RadioGroup aria-label="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} row>
                  <FormControlLabel value="Student" control={<Radio />} label="Student" />
                  <FormControlLabel value="Professor" control={<Radio />} label="Professor" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} className={classes.formGroup}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Grid>
            <Grid item xs={12} className={classes.signUpLink}>
              <Typography variant="body2">
                <Link to="/student-signup">Signup as Student</Link>
              </Typography>
              <Typography variant="body2" style={{marginLeft: '16px'}}>
                <Link to="/professor-signup">Signup as Professor</Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
      <div className={classes.imageContainer}></div>
    </div>
  );
}

export default Login;
