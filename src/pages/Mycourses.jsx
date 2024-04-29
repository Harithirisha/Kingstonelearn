import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Card, CardContent, Grid } from '@material-ui/core';

function CourseDetails() {
  const [courseDetails, setCourseDetails] = useState(null);
  const [professorName, setProfessorName] = useState('');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseStarted, setCourseStarted] = useState(false); // State to track whether the course has started

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch the selected course ID from local storage
        const selectedCourseId = localStorage.getItem('selectedCourseId');
        
        // Get token from local storage
        const token = localStorage.getItem('token');

        // Fetch course details using the selected course ID
        const courseDetailsResponse = await fetch(`https://localhost:7282/api/Courses/${selectedCourseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!courseDetailsResponse.ok) {
          throw new Error('Failed to fetch course details');
        }
        const courseDetailsData = await courseDetailsResponse.json();
        
        // Update state with course details
        setCourseDetails(courseDetailsData);
        
        // Store professor ID in local storage
        localStorage.setItem('selectedProfessorId', courseDetailsData.professorId);
        
        // Fetch professor name using professor ID
        const professorResponse = await fetch(`https://localhost:7282/api/Professors/${courseDetailsData.professorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!professorResponse.ok) {
          throw new Error('Failed to fetch professor details');
        }
        const professorData = await professorResponse.json();

        // Update state with professor name
        setProfessorName(professorData.name);
        
        // Fetch lessons for the selected course ID
        const lessonsResponse = await fetch(`https://localhost:7282/api/Lessons?courseId=${selectedCourseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!lessonsResponse.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const lessonsData = await lessonsResponse.json();

        // Update state with lessons
        setLessons(lessonsData);
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, []);

  const handleCompleteLesson = (lessonId) => {
    // Add logic to mark lesson as completed
  };

  const startCourse = () => {
    setCourseStarted(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (courseStarted) {
    // Render the lessons if the course has started
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6">My Dashboard</Typography>
          </Toolbar>
        </AppBar>
        
        <div style={{ paddingTop: '64px', padding: '20px' }}>
          <Typography variant="h5">{courseDetails.courseName}</Typography>
          <Typography>Professor: {professorName}</Typography>
          {/* Add more course details here */}

          <Grid container spacing={3}>
            {lessons.map(lesson => (
              <Grid item xs={12} sm={6} md={4} key={lesson.lessonId}>
                <Card style={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{lesson.lessonName}</Typography>
                    <Typography variant="body2">{lesson.lessonDescription}</Typography>
                    <Button variant="contained" color="primary" onClick={() => handleCompleteLesson(lesson.lessonId)}>Complete Lesson</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
  } else {
    // Render the start course button if the course has not started
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6">My Dashboard</Typography>
          </Toolbar>
        </AppBar>
        
        <div style={{ paddingTop: '64px', padding: '20px' }}>
          <Card style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h5">{courseDetails.courseName}</Typography>
              <Typography>Professor: {professorName}</Typography>
              <Button variant="contained" color="primary" onClick={startCourse}>Start Course</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default CourseDetails;
