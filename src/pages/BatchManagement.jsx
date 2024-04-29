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
}));

const BatchCreation = () => {
  const classes = useStyles();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batchData, setBatchData] = useState({
    batchName: '',
    courseName: '',
    startDate: '',
    endDate: '',
    batchStatus: 'Pending'
  });

  useEffect(() => {
    const userId = localStorage.getItem('ProfessorId');
    
    if (!userId) {
      console.error('ProfessorId not found in local storage');
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

  useEffect(() => {
    const fetchCourseId = async (courseName) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://localhost:7282/api/Courses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const selectedCourse = response.data.find(course => course.courseName === courseName);
        return selectedCourse ? selectedCourse.courseId : '';
      } catch (error) {
        console.error('Error fetching courseId:', error);
        return '';
      }
    };

    const fetchAndSetCourseId = async () => {
      const courseId = await fetchCourseId(batchData.courseName);
      setBatchData(prevState => ({ ...prevState, courseId }));
    };

    fetchAndSetCourseId();

  }, [batchData.courseName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setBatchData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateBatch = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('ProfessorId'); // Get ProfessorId as userId
      const response = await axios.post(
        'https://localhost:7282/api/Batches',
        { ...batchData, ProfessorId: userId },  // Include ProfessorId in the batch data
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
      console.error('Error creating batch:', error);
      setOpenError(true);
    }
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    setBatchData({
      batchName: '',
      courseName: '',
      startDate: '',
      endDate: '',
      batchStatus: 'Pending'
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
            Create a New Batch
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Grid container justify="center">
          <Grid item xs={12} md={8}>
            <div className={classes.formContainer}>
              <form onSubmit={(e) => e.preventDefault()}>
                <Typography variant="h4" gutterBottom>
                  Create Batch
                </Typography>
                
                <TextField
                  className={classes.textField}
                  type="text"
                  name="batchName"
                  label="Batch Name"
                  variant="outlined"
                  fullWidth
                  value={batchData.batchName}
                  onChange={handleChange}
                />

                <Select
                  className={classes.selectField}
                  name="courseName"
                  value={batchData.courseName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="" disabled>Select Course</MenuItem>
                  {courses.map(course => (
                    <MenuItem key={course.courseId} value={course.courseName}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>

                <TextField
                  className={classes.textField}
                  type="date"
                  name="startDate"
                  label="Start Date"
                  variant="outlined"
                  fullWidth
                  value={batchData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    placeholder: "Start Date"
                  }}
                />

                <TextField
                  className={classes.textField}
                  type="date"
                  name="endDate"
                  label="End Date"
                  variant="outlined"
                  fullWidth
                  value={batchData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    placeholder: "End Date"
                  }}
                />

                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  className={classes.actionButton}
                  onClick={handleCreateBatch}
                >
                  Create Batch
                </Button>

                <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                  <DialogTitle>
                    <IconButton edge="end" color="inherit" onClick={handleCloseSuccess}>
                      <CheckCircleOutlineIcon />
                    </IconButton>
                    Batch Created Successfully
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
                    Error Creating Batch
                  </DialogTitle>
                  <DialogContent>
                    An error occurred while creating the batch. Please try again.
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

export default BatchCreation;
