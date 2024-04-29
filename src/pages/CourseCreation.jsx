import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  AppBar, Toolbar, Typography, Button, makeStyles, Container, 
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, Grid, Box
} from '@material-ui/core';
import { CheckCircleOutline as CheckCircleOutlineIcon, Close as CloseIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
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
  formContainer: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: theme.spacing(3),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  actionButton: {
    marginTop: theme.spacing(2),
  },
}));

const CourseCreation = () => {
  const classes = useStyles();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [courseData, setCourseData] = useState({
    courseName: '',
    courseDescription: '',
    fees: '',
    lessonCount: '',
    professorStatus: 'Active',
    registrarStatus: 'Pending',
    courseDuration: ''
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCourseData(prevState => ({ ...prevState, professorId: userId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const jsonData = {
        CourseName: courseData.courseName,
        CourseDescription: courseData.courseDescription,
        Fees: parseInt(courseData.fees), // Ensure fees is converted to integer
        CourseDuration: parseInt(courseData.courseDuration), // Ensure courseDuration is converted to integer
        LessonCount: parseInt(courseData.lessonCount), // Ensure lessonCount is converted to integer
        ProfessorStatus: courseData.professorStatus,
        ProfessorId: parseInt(courseData.professorId), // Ensure professorId is converted to integer
        CourseStatus: 'Pending'
      };
  
      const response = await axios.post('https://localhost:7282/api/Courses', jsonData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      setOpenSuccess(true);
    } catch (error) {
      console.error('Error creating course:', error);
      setOpenError(true);
    }
  };
  
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    window.location.href = '/professor/course-management';
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Create a New Course
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Grid container justify="center">
          <Grid item xs={12} md={8}>
            <div className={classes.formContainer}>
              <form onSubmit={handleSubmit}>
                <Typography variant="h4" gutterBottom>
                  Create Courses
                </Typography>
                <TextField
                  className={classes.textField}
                  type="text"
                  name="courseName"
                  label="Course Name"
                  variant="outlined"
                  value={courseData.courseName}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  className={classes.textField}
                  type="text"
                  name="courseDescription"
                  label="Course Description"
                  variant="outlined"
                  value={courseData.courseDescription}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  minRows={4}
                />
                <TextField
                  className={classes.textField}
                  type="text"
                  name="fees"
                  label="Fees"
                  variant="outlined"
                  value={courseData.fees}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  className={classes.textField}
                  type="text"
                  name="courseDuration"
                  label="Course Duration(in weeks)"
                  variant="outlined"
                  value={courseData.courseDuration}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  className={classes.textField}
                  type="text"
                  name="lessonCount"
                  label="Lesson Count"
                  variant="outlined"
                  value={courseData.lessonCount}
                  onChange={handleChange}
                  fullWidth
                />
                <Button type="submit" variant="contained" color="primary" fullWidth className={classes.actionButton}>
                  Create Course
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Success Dialog */}
      <Dialog open={openSuccess} onClose={handleCloseSuccess}>
        <DialogTitle>
          <IconButton edge="end" color="inherit" onClick={handleCloseSuccess}>
            <CheckCircleOutlineIcon />
          </IconButton>
          Course Created Successfully
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseSuccess} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={openError} onClose={handleCloseError}>
        <DialogTitle>
          <IconButton edge="end" color="inherit" onClick={handleCloseError}>
            <CloseIcon />
          </IconButton>
          Error Creating Course
        </DialogTitle>
        <DialogContent>
          An error occurred while creating the course. Please try again.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseError} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CourseCreation;
