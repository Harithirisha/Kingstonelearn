import React, { useState, useEffect } from 'react';
import { makeStyles, Card, CardContent, Typography, AppBar, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    width: '100%', // Set AppBar width to cover entire page
    position: 'fixed', // Position AppBar at the top of the page
  },
  title: {
    marginLeft: theme.spacing(2), // Add margin to separate the title from the edge of AppBar
  },
  table: {
    minWidth: 650,
    marginTop: theme.spacing(8), // Add margin top to prevent content from being hidden behind the AppBar
  },
  actionButton: {
    margin: theme.spacing(1),
  },
}));

function EnrollmentList() {
  const classes = useStyles();
  const [enrollments, setEnrollments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = () => {
    fetch('https://localhost:7282/api/Enrollments?registrarStatus=Pending', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then(response => response.json())
      .then(data => {
        setEnrollments(data);
      })
      .catch(error => console.error('Error fetching enrollments:', error));
  };

  const handleAction = (enrollmentId, action) => {
    const url = `https://localhost:7282/api/Enrollments/${action}?enrollmentId=${enrollmentId}`;
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          // If the action is successful, update the enrollments list
          fetchEnrollments();
        } else {
          throw new Error('Failed to perform action');
        }
      })
      .catch(error => console.error('Error performing action:', error));
  };
  
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Payment List
          </Typography>
        </Toolbar>
      </AppBar>
      <TableContainer>
        <Table className={classes.table} aria-label="enrollment table">
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((enrollment, index) => (
              <TableRow key={index}>
                <TableCell>{enrollment.courseId && (
                  <FetchCourseName courseId={enrollment.courseId} />
                )}</TableCell>
                <TableCell>{enrollment.studentId && (
                  <FetchStudentName studentId={enrollment.studentId} />
                )}</TableCell>
                <TableCell>{enrollment.registrarStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.actionButton}
                    onClick={() => handleAction(enrollment.id, 'Approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.actionButton}
                    onClick={() => handleAction(enrollment.id, 'Reject')}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function FetchCourseName({ courseId }) {
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    fetch(`https://localhost:7282/api/Courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
      },
    })
      .then(response => response.json())
      .then(data => {
        setCourseName(data.courseName);
      })
      .catch(error => console.error('Error fetching course name:', error));
  }, [courseId]);

  return <span>{courseName}</span>;
}

function FetchStudentName({ studentId }) {
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetch(`https://localhost:7282/api/Students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the Authorization header
      },
    })
      .then(response => response.json())
      .then(data => {
        setStudentName(data.name);
      })
      .catch(error => {
        console.error('Error fetching student name:', error);
        // Display student ID if fetching student name fails
        setStudentName(studentId);
      });
  }, [studentId]);

  return <span>{studentName}</span>;
}

export default EnrollmentList;
