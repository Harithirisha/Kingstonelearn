import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Grid, makeStyles, AppBar, Toolbar, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    marginLeft: '-200px',
  },
  appBar: {
    width: '100%',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  avatar: {
    width: '400px',
    height: '530px',
    marginLeft: '-20px',
    marginTop: '40px',
  },
  adminText: {
    fontSize: '60px',
    marginLeft:'350px',
    marginTop:'90px',
    fontFamily:'Helvetica sans-serif',
    fontStyle:'italica'

  },
  quote: {
    fontSize: '25px',
    marginLeft:'200px',
    marginTop:'90px',
    fontFamily:'Helvetica sans-serif'
  },
}));

function AdminDashboard() {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleStudentApprovalClick = () => {
    navigate('/student-management');
  };

  const handleProfessorManagementClick = () => {
    navigate('/professor-management');
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            Admin Dashboard
          </Typography>
          <div>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleStudentApprovalClick} 
              className={classes.button}
            >
              Student Approval
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleProfessorManagementClick} 
              className={classes.button}
            >
              Professor Management
            </Button>
            <Link to="/course-approvals" className={classes.button}>
              <Button variant="contained" color="primary">
                Course Approvals
              </Button>
            </Link>
            <Link to="/payment-approvals" className={classes.button}>
              <Button variant="contained" color="primary">
                Payment Approvals
              </Button>
            </Link>
            <Link to="/reports" className={classes.button}>
              <Button variant="contained" color="primary">
                Reports
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} style={{ marginTop: '64px', padding: '20px' }}>
        <Grid item xs={3}>
          <Avatar alt="Admin Image" src="https://img.freepik.com/free-photo/3d-cartoon-portrait-person-practicing-law-profession_23-2151419566.jpg?t=st=1713899525~exp=1713903125~hmac=9f8807211be3329fcfb84e4b7163ddc2458987b1ca1c7622d727757347daa1e5&w=360" className={classes.avatar} />
        </Grid>
        <Grid item xs={9}>
          <Grid container direction="column" alignItems="flex-start">
            <Typography variant="h5" className={classes.adminText}>Hello Admin!</Typography>
            <Typography variant="body1" className={classes.quote}>"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela</Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminDashboard;
