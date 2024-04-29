// import React from 'react';
// import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, Button, Grid, Typography } from '@mui/material';
// import { styled } from '@mui/system';

// const StyledAppBar = styled(AppBar)(({ theme }) => ({
//   marginBottom: theme.spacing(3),
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   marginRight: theme.spacing(2),
// }));

// function CourseManagement() {
//   return (
//     <div>
//       <StyledAppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             Course Management Dashboard
//           </Typography>
//           <Link to="/professor/create-course">
//             <StyledButton color="inherit">Create Course</StyledButton>
//           </Link>
//           <Link to="/professor/view-courses">
//             <StyledButton color="inherit">View Courses</StyledButton>
//           </Link>
//           <Link to="/professor/update-course">
//             <StyledButton color="inherit">Update Course</StyledButton>
//           </Link>
//           <Link to="/professor/delete-course">
//             <StyledButton color="inherit">Delete</StyledButton>
//           </Link>
//         </Toolbar>
//       </StyledAppBar>
      
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Link to="/professor/create-course">
//             <Button variant="contained" color="primary" fullWidth>
//               Create Course
//             </Button>
//           </Link>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Link to="/professor/view-courses">
//             <Button variant="contained" color="primary" fullWidth>
//               View Courses
//             </Button>
//           </Link>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Link to="/professor/update-course">
//             <Button variant="contained" color="primary" fullWidth>
//               Update Course
//             </Button>
//           </Link>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Link to="/professor/delete-course">
//             <Button variant="contained" color="primary" fullWidth>
//               Delete
//             </Button>
//           </Link>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }

// export default CourseManagement;



import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Grid, Typography } from '@mui/material';

function CourseManagement() {
  return (
    <div>
      <AppBar position="static" style={{ width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Course Management Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} style={{ marginTop: '1.5rem' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/professor/create-course">
            <Button variant="contained" color="primary" fullWidth>
              Create Course
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/professor/view-courses">
            <Button variant="contained" color="primary" fullWidth>
              View Courses
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/professor/update-course">
            <Button variant="contained" color="primary" fullWidth>
              Update Course
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/professor/delete-course">
            <Button variant="contained" color="primary" fullWidth>
              Delete
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default CourseManagement;
