import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, makeStyles, Card, CardContent, Grid, Paper } from '@material-ui/core';

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
  courseCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    transition: 'transform .2s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  welcomeSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  imageContainer: {
    width: '50%',
    marginRight: theme.spacing(2),
  },
  image: {
    width: '100%',
    borderRadius: '50%',
  },
  quoteContainer: {
    width: '50%',
  },
}));

function StudentsDashboard() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    fetch('https://localhost:7282/api/Courses', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(async (data) => {
        const enrichedCourses = await Promise.all(data.map(async (course) => {
          const professorResponse = await fetch(`https://localhost:7282/api/Professors/${course.professorId}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          const professorData = await professorResponse.json();

          return {
            ...course,
            professorName: professorData.name,
          };
        }));

        setCourses(enrichedCourses);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleViewLessons = (courseId) => {
    localStorage.setItem('selectedCourseId', courseId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar alignItems="flex-start">
          <Typography variant="h6" className={classes.title}>
            Student Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ paddingTop: '64px', paddingLeft: '20px' }}>
        <Paper className={classes.welcomeSection}>
          <div className={classes.imageContainer}>
            <img 
              src="https://img.freepik.com/free-photo/front-view-little-girl-library_23-2151061796.jpg" 
              alt="Student Cartoon" 
              className={classes.image}
            />
          </div>
          <div className={classes.quoteContainer}>
            <h1>Welcome Champ!</h1>
            <blockquote className="blockquote text-center" style={{ fontSize: '1.5rem' }}>
              <p className="mb-4">"The mind is not a vessel to be filled, but a fire to be kindled."</p>
              <footer className="blockquote-footer">Plutarch</footer>
            </blockquote>
          </div>
        </Paper>
        <h2>Available Courses</h2>
        <Grid container spacing={3}>
          {courses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course.courseId}>
              <Card className={classes.courseCard}>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h6" style={{fontWeight:'bold'}}>{course.courseName}</Typography>
                  <Typography variant="body2" style={{fontWeight:'bold'}}>Professor: </Typography>
                  <Typography variant="body2">{course.professorName}</Typography>
                  <Typography variant="body2" style={{fontWeight:'bold'}}>Description: </Typography>
                  <Typography variant="body2">{course.courseDescription}</Typography>
                  <Typography variant="body2" style={{fontWeight:'bold'}}>Fees: </Typography>
                  <Typography variant="body2">{course.fees}</Typography>
                  <Typography variant="body2" style={{fontWeight:'bold'}}>Duration: </Typography>
                  <Typography variant="body2">{course.courseDuration}</Typography>
                </CardContent>
                <Button 
                  component={Link}
                  to={{
                    pathname: '/students/enrollment-page',
                    search: `?courseId=${course.courseId}`,
                  }}
                  variant="contained" 
                  color="primary" 
                  style={{ marginBottom: '10px' }}
                  onClick={() => handleViewLessons(course.courseId)}
                >
                  View Lessons
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default StudentsDashboard;
