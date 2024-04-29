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
  uploadContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  uploadButton: {
    marginRight: theme.spacing(2),
  },
}));

const CourseCreation = () => {
  const classes = useStyles();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [courseData, setCourseData] = useState({
    courseName: '',
    courseDescription: '',
    courseImage: null,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('CourseName', courseData.courseName);
      formData.append('CourseDescription', courseData.courseDescription);
      formData.append('CourseImage', selectedFile);  
      formData.append('Fees', courseData.fees);
      formData.append('LessonCount', courseData.lessonCount);
      formData.append('ProfessorStatus', courseData.professorStatus);
      formData.append('CourseDuration', courseData.courseDuration);
      formData.append('ProfessorId', courseData.professorId);
      formData.append('CourseStatus', 'Pending');
      
      const response = await axios.post('https://localhost:7282/api/Courses', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
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
                <Box className={classes.uploadContainer}>
                  <input
                    type="file"
                    id="upload-file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="upload-file">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      component="span" 
                      className={classes.uploadButton}
                    >
                      Upload File
                    </Button>
                  </label>
                  {selectedFile && (
                    <TextField
                      className={classes.textField}
                      type="text"
                      name="courseImageName"
                      label="Selected File"
                      variant="outlined"
                      value={selectedFile.name}
                      fullWidth
                      disabled
                    />
                  )}
                </Box>
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
