import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    width: '100%', 
    top: 0,       
    zIndex: theme.zIndex.drawer + 1, 
  },
  title: {
    flexGrow: 1,
    textAlign: 'left', 
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  container: {
    marginTop: theme.spacing(4),
  },
  circularImage: {
    borderRadius: '50%', // Make the image circular
  },
}));

function ProfessorsDashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar alignItems="flex-start"> 
          <Typography variant="h6" className={classes.title}>
            Professor Dashboard
          </Typography>
          <Button 
            component={Link}
            to="/professor/create-course"
            color="inherit"
            className={classes.button}
          >
            Courses Management
          </Button>
          <Button 
            component={Link}
            to="/professor/manage-lessons"
            color="inherit"
            className={classes.button}
          >
            Lesson Management
          </Button>
          <Button 
            component={Link}
            to="/professor/manage-batches"
            color="inherit"
            className={classes.button}
          >
            Batch Management
          </Button>
        </Toolbar>
      </AppBar>
      
      <Grid container className={classes.container} spacing={3}>
        <Grid item md={6} xs={12}>
          <img 
            src="https://img.freepik.com/free-photo/3d-cartoon-portrait-person-practicing-law-profession_23-2151419572.jpg?size=626&ext=jpg&ga=GA1.1.1342565942.1710244181&semt=ais" 
            alt="Teacher Cartoon" 
            className={`${classes.circularImage} img-fluid mb-3`} 
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <h1>Welcome Guru!</h1>
          <blockquote className="blockquote text-center">
            <p className="mb-8" style={{fontSize: '1.5rem'}}> "The best teachers teach from the heart, not from the book." </p>
            <footer className="blockquote-footer">-Anonymous</footer>
          </blockquote>
        </Grid>
      </Grid>
      
    </div>
  );
}

export default ProfessorsDashboard;
