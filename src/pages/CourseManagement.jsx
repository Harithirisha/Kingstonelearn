import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Grid, Typography } from '@mui/material';

function CourseManagement() {
  const [pendingCourses, setPendingCourses] = useState([]);

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const response = await fetch('https://localhost:7282/api/Courses?CourseStatus=Pending');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPendingCourses(data);
    } catch (error) {
      console.error('Error fetching pending courses:', error);
    }
  };

  return (
    <div>
      <AppBar position="static" style={{ width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Course Management Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} style={{ marginTop: '1.5rem' }}>
        {pendingCourses.map(course => (
          <Grid item xs={12} sm={6} md={3} key={course.courseId}>
            <Link to={`/professor/view-courses/${course.courseId}`}>
              <Button variant="contained" color="primary" fullWidth>
                {course.courseName}
              </Button>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default CourseManagement;
