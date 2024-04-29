import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles, Card, CardContent, Grid, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  appBar: {
    width: '100%',
    backgroundColor: '#1976d2',
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 'bold',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
  },
  image: {
    maxWidth: '70%',
    height: 'auto',
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    marginLeft: '-50px',
  },
  welcomeNote: {
    fontSize: '1.5rem',
    maxWidth: '50%',
    color: '#333',
    padding: '20px',
    fontFamily: 'Roboto, sans-serif',
  },
  courseCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'background-color 0.3s, transform 0.3s',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      transform: 'scale(1.05)',
    },
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '300px',
    borderRadius: '15px',
    fontFamily: 'Roboto, sans-serif',
  },
  studentItem: {
    transition: 'background-color 0.3s, transform 0.3s',
    '&:hover': {
      backgroundColor: '#e6f7ff',
      transform: 'scale(1.05)',
    },
    cursor: 'pointer',
  },
  mt5: {
    width: '100%',
  },
});

function Home() {
  const classes = useStyles();

  return (
    <div>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Kingston University
          </Typography>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.imageContainer}>
        <img 
          src="https://img.freepik.com/premium-vector/online-learning-concept-teacher-chalkboard-video-lesson-distance-study-school-flat-style_186332-184.jpg" 
          alt="Random Cartoon eLearning" 
          className={classes.image}
        />
        <div className={classes.welcomeNote}>
          <h2>Welcome to Kingston University!</h2>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', fontFamily: 'Roboto, sans-serif' }}>
            Dive into knowledge anytime, anywhere. Happy learning!
          </p>
        </div>
      </div>
      {/* Courses in Horizontal Grid */}
      <div className={classes.mt5}>
        <h2 className="mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>Courses</h2>
        <Grid container spacing={3}>
          {/* Artificial Intelligence */}
          <Grid item xs={12} sm={4}>
            <Card className={`${classes.courseCard}`}>
              <CardContent>
                <Typography variant="h5" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Artificial Intelligence
                </Typography>
                <p>
                  Explore the world of AI with our comprehensive course covering neural networks, machine learning, and more.
                </p>
              </CardContent>
            </Card>
          </Grid>
          {/* Machine Learning */}
          <Grid item xs={12} sm={4}>
            <Card className={`${classes.courseCard}`}>
              <CardContent>
                <Typography variant="h5" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Machine Learning
                </Typography>
                <p>
                  Dive into the exciting field of machine learning and learn how to build predictive models using Python.
                </p>
              </CardContent>
            </Card>
          </Grid>
          {/* Java Fundamentals */}
          <Grid item xs={12} sm={4}>
            <Card className={`${classes.courseCard}`}>
              <CardContent>
                <Typography variant="h5" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Java Fundamentals
                </Typography>
                <p>
                  Master the basics of Java programming and build strong foundations for your coding journey.
                </p>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
          
      {/* Random Students Pictures and Reviews */}
      <div className={classes.mt5}>
        <h2 className="mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>Student Reviews</h2>
        <Grid container spacing={3}>
          {/* Student 1 */}
          <Grid item xs={12} sm={4} className={`${classes.studentItem} text-center`}>
            <Avatar src="https://randomuser.me/api/portraits/men/1.jpg" alt="Student 1" className="mb-3" style={{ width: '120px', height: '120px' }}/>
            <p>
              Great learning experience! Kingston University provides top-notch courses that are both informative and engaging.
            </p>
          </Grid>
          {/* Student 2 */}
          <Grid item xs={12} sm={4} className={`${classes.studentItem} text-center`}>
            <Avatar src="https://randomuser.me/api/portraits/women/2.jpg" alt="Student 2" className="mb-3" style={{ width: '120px', height: '120px' }}/>
            <p>
              Awesome courses at Kingston University! I've learned so much and I'm excited to apply my new skills.
            </p>
          </Grid>
          {/* Student 3 */}
          <Grid item xs={12} sm={4} className={`${classes.studentItem} text-center`}>
            <Avatar src="https://randomuser.me/api/portraits/men/3.jpg" alt="Student 3" className="mb-3" style={{ width: '120px', height: '120px' }}/>
            <p>
              Highly recommend Kingston University! The courses are well-structured and the instructors are knowledgeable.
            </p>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Home;
