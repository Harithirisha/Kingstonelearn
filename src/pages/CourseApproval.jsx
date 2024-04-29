import React, { useState, useEffect } from 'react';
import { Button, Table, TableHead, TableBody, TableRow, TableCell, makeStyles, AppBar, Toolbar, Typography, Dialog, DialogTitle, DialogActions } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: 800,
    margin: 'auto',
  },
  table: {
    marginTop: theme.spacing(2),
  },
  actionButton: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

function CourseApproval() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batchDetails, setBatchDetails] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [showLessons, setShowLessons] = useState(false);
  const [showBatches, setShowBatches] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchLessons();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://localhost:7282/api/Courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.filter(course => course.courseStatus === 'Pending'));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://localhost:7282/api/Lessons', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }

      const data = await response.json();

      const lessonsWithCourseNames = await Promise.all(
        data.filter(lesson => lesson.lessonStatus === 'Pending').map(async (lesson) => {
          const courseName = await fetchCourseNameById(lesson.courseId);
          return {
            ...lesson,
            courseName,
          };
        })
      );

      setLessons(lessonsWithCourseNames);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://localhost:7282/api/Batches', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch batches');
      }

      const data = await response.json();
      const batchDetailsWithCourseNames = await Promise.all(
        data.filter(batch => batch.batchStatus === 'Pending').map(async (batch) => {
          const courseName = await fetchCourseNameById(batch.courseId);
          return {
            ...batch,
            courseName,
          };
        })
      );

      setBatchDetails(batchDetailsWithCourseNames);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const toggleShowLessons = () => {
    setCourses([]);
    setShowLessons(true);
    setShowBatches(false);
  };

  const toggleShowBatches = () => {
    setCourses([]);
    setLessons([]);
    setShowLessons(false);
    setShowBatches(true);
    fetchBatches();
  };

  const fetchCourseNameById = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`https://localhost:7282/api/Courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course name');
      }

      const data = await response.json();
      return data.courseName;
    } catch (error) {
      console.error('Error fetching course name:', error);
    }
  };

  const handleAction = async (id, action, type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      let endpoint = '';
      let successText = '';
      switch (type) {
        case 'course':
          switch (action) {
            case 'Approve':
              endpoint = `https://localhost:7282/api/Courses/Approve/${id}`;
              successText = 'Course approved successfully';
              break;
            case 'Reject':
              endpoint = `https://localhost:7282/api/Courses/Reject/${id}`;
              successText = 'Course rejected successfully';
              break;
            default:
              break;
          }
          break;
        case 'lesson':
          switch (action) {
            case 'Approve':
              endpoint = `https://localhost:7282/api/Lessons/Approve/${id}`;
              successText = 'Lesson approved successfully';
              break;
            case 'Reject':
              endpoint = `https://localhost:7282/api/Lessons/Reject/${id}`;
              successText = 'Lesson rejected successfully';
              break;
            default:
              break;
          }
          break;
        case 'batch':
          switch (action) {
            case 'Approve':
              endpoint = `https://localhost:7282/api/Batches/Approve?batchId=${id}`;
              successText = 'Batch approved successfully';
              break;
            case 'Reject':
              endpoint = `https://localhost:7282/api/Batches/Reject?batchId=${id}`;
              successText = 'Batch rejected successfully';
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }

      const response = await fetch(endpoint, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      if (response.status === 200) {
        setDialogText(successText);
        setOpenDialog(true);
      }

      if (type === 'course') {
        fetchCourses();
      } else if (type === 'lesson') {
        fetchLessons();
      } else if (type === 'batch') {
        fetchBatches();
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setDialogText('Error approving');
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const renderTable = (list, type) => {
    if (list.length === 0) {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            {type === 'course' ? 'Courses' : (type === 'lesson' ? 'Lessons' : 'Batches')}
          </Typography>
          <Typography variant="body1">No {type.toLowerCase()} to be displayed.</Typography>
        </>
      );
    }

    if (type === 'batch') {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            Batches
          </Typography>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Batch Name</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((batch) => (
                <TableRow key={batch.batchId}>
                  <TableCell>{batch.batchName}</TableCell>
                  <TableCell>{batch.courseName}</TableCell>
                  <TableCell>{batch.startDate}</TableCell>
                  <TableCell>{batch.endDate}</TableCell>
                  <TableCell>{batch.batchStatus}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className={classes.actionButton}
                      onClick={() => handleAction(batch.batchId, 'Approve', 'batch')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.actionButton}
                      onClick={() => handleAction(batch.batchId, 'Reject', 'batch')}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );
    }

    return (
      <>
        <Typography variant="h6" gutterBottom>
          {type === 'course' ? 'Courses' : 'Lessons'}
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {type !== 'course' && <TableCell>Course Name</TableCell>}
              <TableCell>{type === 'course' ? 'Course Name' : 'Lesson Name'}</TableCell>
              <TableCell>{type === 'course' ? 'Description' : 'Description'}</TableCell>
              {type === 'course' && <TableCell>Fees</TableCell>}
              {type === 'course' && <TableCell>Duration (weeks)</TableCell>}
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item) => (
              <TableRow key={type === 'course' ? item.courseId : item.lessonId}>
                {type !== 'course' && <TableCell>{item.courseName}</TableCell>}
                <TableCell>{type === 'course' ? item.courseName : item.lessonName}</TableCell>
                <TableCell>{type === 'course' ? item.courseDescription : item.lessonDescription}</TableCell>
                {type === 'course' && <TableCell>{item.fees}</TableCell>}
                {type === 'course' && <TableCell>{item.courseDuration}</TableCell>}
                <TableCell>{type === 'course' ? item.courseStatus : item.lessonStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    className={classes.actionButton}
                    onClick={() => handleAction(type === 'course' ? item.courseId : item.lessonId, 'Approve', type)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.actionButton}
                    onClick={() => handleAction(type === 'course' ? item.courseId : item.lessonId, 'Reject', type)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Courses Management
          </Typography>
          <div>
          <Button 
  variant="contained" 
  color="secondary" 
  onClick={toggleShowLessons} 
  style={{ color: '#ffffff', backgroundColor: 'blue', marginRight: '10px' }}
>
  Lesson Management
</Button>
<Button 
  variant="contained" 
  color="secondary" 
  onClick={toggleShowBatches} 
  style={{ color: '#ffffff', backgroundColor: 'blue', marginRight: '10px' }}
>
  Batch Management
</Button>

          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {!showLessons && !showBatches && renderTable(courses, 'course')}
      {showLessons && renderTable(lessons, 'lesson')}
      {showBatches && renderTable(batchDetails, 'batch')}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogText}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CourseApproval;
