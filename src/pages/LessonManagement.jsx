import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, Button, makeStyles, Container,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Grid, Select, MenuItem
} from '@material-ui/core';
import { CheckCircleOutline as CheckCircleOutlineIcon, Close as CloseIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
    padding: theme.spacing(4),
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  actionButton: {
    marginTop: theme.spacing(3),
  },
  selectField: {
    marginBottom: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(3),
  },
}));

const LessonCreation = () => {
  const classes = useStyles();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lessonCount, setLessonCount] = useState(0);
  const [createdLessonCount, setCreatedLessonCount] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const [lessonData, setLessonData] = useState({
    lessonName: '',
    lessonDescription: '',
    lessonStatus: 'Pending',
    courseId: ''
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://localhost:7282/api/Courses?professorId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setLessonData(prevState => ({ ...prevState, [name]: value }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7282/api/Courses/${value}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setLessonCount(response.data.lessonCount);
    } catch (error) {
      console.error('Error fetching lesson count:', error);
    }
  };

  const handleCreateLesson = async (lessonName, lessonDescription, courseId) => {
    const lessonEntry = {
      LessonName: lessonName,
      LessonDescription: lessonDescription,
      LessonStatus: 'Pending',
      CourseId: courseId,
      ProfessorId: parseInt(localStorage.getItem('userId'))
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://localhost:7282/api/Lessons',
        lessonEntry,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response:', response.data);
      setOpenSuccess(true);

    } catch (error) {
      console.error('Error creating lesson:', error);
      setOpenError(true);
    }
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    
    setCurrentLessonIndex(prevIndex => prevIndex + 1);

    setLessonData({
      ...lessonData,
      [`lessonName${currentLessonIndex}`]: '',
      [`lessonDescription${currentLessonIndex}`]: ''
    });
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Create a New Lesson
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Grid container justify="center">
          <Grid item xs={12} md={8}>
            <div className={classes.formContainer}>
              <form onSubmit={(e) => e.preventDefault()}>
                <Typography variant="h4" gutterBottom>
                  Create Lesson
                </Typography>
                <Select
                  className={classes.selectField}
                  name="courseId"
                  value={lessonData.courseId}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="" disabled>Select Course</MenuItem>
                  {courses.map(course => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>

                {Array.from({ length: lessonCount }, (_, i) => i).map(index => (
                  <div key={index}>
                    <TextField
                      className={classes.textField}
                      type="text"
                      name={`lessonName${index}`}
                      label={`Lesson Name ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={lessonData[`lessonName${index}`]}
                      onChange={(e) => setLessonData(prevState => ({ ...prevState, [`lessonName${index}`]: e.target.value }))}
                      disabled={index !== currentLessonIndex}
                    />
                    <TextField
                      className={classes.textField}
                      type="text"
                      name={`lessonDescription${index}`}
                      label={`Lesson Description ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      multiline
                      minRows={4}
                      value={lessonData[`lessonDescription${index}`]}
                      onChange={(e) => setLessonData(prevState => ({ ...prevState, [`lessonDescription${index}`]: e.target.value }))}
                      disabled={index !== currentLessonIndex}
                    />
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      className={classes.actionButton}
                      onClick={() => handleCreateLesson(lessonData[`lessonName${index}`], lessonData[`lessonDescription${index}`], lessonData.courseId)}
                      disabled={index !== currentLessonIndex}
                    >
                      Create Lesson
                    </Button>
                  </div>
                ))}

                <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                  <DialogTitle>
                    <IconButton edge="end" color="inherit" onClick={handleCloseSuccess}>
                      <CheckCircleOutlineIcon />
                    </IconButton>
                    Lesson Created Successfully
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleCloseSuccess} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog open={openError} onClose={handleCloseError}>
                  <DialogTitle>
                    <IconButton edge="end" color="inherit" onClick={handleCloseError}>
                      <CloseIcon />
                    </IconButton>
                    Error Creating Lesson
                  </DialogTitle>
                  <DialogContent>
                    An error occurred while creating the lesson. Please try again.
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseError} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LessonCreation;
