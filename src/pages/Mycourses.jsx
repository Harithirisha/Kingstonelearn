// import React, { useState, useEffect } from 'react';
// import { AppBar, Toolbar, Typography, makeStyles, Card, CardContent, Button } from '@material-ui/core';
// import { jsPDF } from 'jspdf';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   title: {
//     flexGrow: 1,
//   },
//   courseContainer: {
//     paddingTop: theme.spacing(8),
//     paddingLeft: theme.spacing(2),
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   lessonTitle: {
//     width: '100%',
//     fontWeight: 'bold',
//     textAlign: 'left',
//     marginBottom: theme.spacing(2),
//   },
//   courseCard: {
//     width: 300,
//     margin: theme.spacing(1),
//     textAlign: 'center',
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   cardContent: {
//     flexGrow: 1,
//   },
//   completeButton: {
//     marginTop: 'auto',
//   },
//   downloadButton: {
//     marginTop: '10px',
//   },
//   appBar: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//   },
// }));

// function EnrollmentTable() {
//   const classes = useStyles();
//   const [enrollments, setEnrollments] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [studentId, setStudentId] = useState(null);
//   const [professorId, setProfessorId] = useState(null);
//   const [completedLessons, setCompletedLessons] = useState([]);
//   const [totalLessonsCount, setTotalLessonsCount] = useState(0);
//   const [completedLessonsCount, setCompletedLessonsCount] = useState(0);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');
    
//     if (!token || !userId) {
//       console.error('No token or userId found.');
//       return;
//     }

//     setStudentId(userId);

//     fetch('https://localhost:7282/api/Enrollments', {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         const userEnrollments = data.filter(enrollment => enrollment.studentId === parseInt(userId) && enrollment.courseId !== 0);
//         setEnrollments(userEnrollments);
  
//         const fetchCoursePromises = userEnrollments.map(enrollment =>
//           fetch(`https://localhost:7282/api/Courses/${enrollment.courseId}`, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           })
//           .then(response => response.json())
//           .catch(error => console.error(`Error fetching course ${enrollment.courseId}:`, error))
//         );
  
//         Promise.all(fetchCoursePromises)
//           .then(courseDataArray => {
//             const uniqueCourses = courseDataArray.reduce((acc, courseData) => {
//               if (!acc.some(course => course.courseId === courseData.courseId)) {
//                 acc.push(courseData);
//               }
//               return acc;
//             }, []);
//             setCourses(uniqueCourses);
//           })
//           .catch(error => console.error('Error fetching course data:', error));
//       })
//       .catch(error => console.error('Error fetching enrollments:', error));
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     fetch('https://localhost:7282/api/LessonCompleteds', {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         const lessonIds = data.map(lesson => lesson.lessonId);
//         setCompletedLessons(lessonIds);
//       })
//       .catch(error => console.error('Error fetching completed lessons:', error));
//   }, []);

//   useEffect(() => {
//     const completedLessonsStorage = JSON.parse(localStorage.getItem('completedLessons'));
//     if (completedLessonsStorage) {
//       setCompletedLessons(completedLessonsStorage);
//       setCompletedLessonsCount(completedLessonsStorage.length);
//     }
//   }, []);

//   const fetchProfessorId = (studentId) => {
//     const token = localStorage.getItem('token');

//     fetch(`https://localhost:7282/api/Courses?studentId=${studentId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (data && data.length > 0) {
//           setProfessorId(data[0].professorId);
//         }
//       })
//       .catch(error => console.error('Error fetching professorId:', error));
//   };

//   const handleProceed = (courseId) => {
//     setSelectedCourseId(courseId);

//     const token = localStorage.getItem('token');
    
//     fetch(`https://localhost:7282/api/Lessons?courseId=${courseId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         const filteredLessons = data.filter(lesson => !completedLessons.includes(lesson.lessonId) && lesson.courseId === courseId && lesson.lessonStatus === 'Approved');
//         setLessons(filteredLessons);
//         setTotalLessonsCount(filteredLessons.length);
//         setCompletedLessonsCount(0); // Reset completed lessons count when selecting a new course
//       })
//       .catch(error => console.error('Error fetching lessons:', error));

//     fetchProfessorId(studentId);
//   };

//   const handleCompleteLesson = (lessonId) => {
//     const token = localStorage.getItem('token');

//     const data = {
//       studentId: studentId,
//       courseId: selectedCourseId,
//       professorId: professorId,
//       lessonId: lessonId,
//       IsCompleted: true,
//     };

//     fetch('https://localhost:7282/api/LessonCompleteds', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(data),
//     })
//       .then(response => {
//         if (response.ok) {
//           console.log(`Lesson ${lessonId} completed successfully!`);
//           const updatedCompletedLessons = [...completedLessons, lessonId];
//           setCompletedLessons(updatedCompletedLessons);
//           setCompletedLessonsCount(prevCount => prevCount + 1);
//           localStorage.setItem('completedLessons', JSON.stringify(updatedCompletedLessons));
//         } else {
//           console.error(`Error completing lesson ${lessonId}:`, response.statusText);
//         }
//       })
//       .catch(error => console.error(`Error completing lesson ${lessonId}:`, error));
//   };

//   const handleDownloadCertificate = () => {
//     if (completedLessonsCount === totalLessonsCount) {
//       const doc = new jsPDF();
//       doc.text('Certificate of Completion', 10, 10);
//       doc.save('certificate.pdf');
//     } else {
//       console.log('You must complete all lessons to download the certificate.');
//     }
//   };
  
//   return (
//     <div className={classes.root}>
//       <AppBar position="fixed" className={classes.appBar}>
//         <Toolbar>
//           <Typography variant="h6" className={classes.title}>
//             Course Details
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <div className={classes.courseContainer}>
//         {selectedCourseId ? (
//           <div>
//             {lessons.length > 0 && (
//               <div className={classes.courseContainer}>
//                 <Typography variant="h5" className={classes.lessonTitle}>Lessons:</Typography>
//                 {lessons.map(lesson => (
//                   <Card key={lesson.lessonId} className={classes.courseCard}>
//                     <CardContent className={classes.cardContent}>
//                       <Typography variant="h5" component="h2">
//                         {lesson.lessonName}
//                       </Typography>
//                       <Typography color="textSecondary">
//                         {lesson.lessonDescription}
//                       </Typography>
//                     </CardContent>
//                     <Button 
//                       variant="contained" 
//                       color="primary" 
//                       className={classes.completeButton}
//                       onClick={() => handleCompleteLesson(lesson.lessonId)}
//                       disabled={completedLessons.includes(lesson.lessonId)}
//                     >
//                       {completedLessons.includes(lesson.lessonId) ? 'Lesson Completed' : 'Complete Lesson'}
//                     </Button>
//                   </Card>
//                 ))}
//               </div>
//             )}
//             <Button 
//               variant="contained" 
//               color="primary" 
//               className={classes.downloadButton}
//               onClick={handleDownloadCertificate}
//               disabled={completedLessonsCount !== totalLessonsCount}
//             >
//               Download Certificate
//             </Button>
//           </div>
//         ) : (
//           <div>
//             {courses.map(course => (
//               <Card key={course.courseId} className={classes.courseCard}>
//                 <CardContent>
//                   <Typography variant="h5" component="h2">
//                     {course.courseName}
//                   </Typography>
//                   <Typography color="textSecondary">
//                     {course.courseDescription}
//                   </Typography>
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => handleProceed(course.courseId)}
//                     style={{ marginTop: '10px' }}
//                   >
//                     Proceed to Course
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default EnrollmentTable;




import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, makeStyles, Card, CardContent, Button } from '@material-ui/core';
import { jsPDF } from 'jspdf';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  courseContainer: {
    paddingTop: theme.spacing(8),
    paddingLeft: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
  },
  lessonTitle: {
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  courseCard: {
    width: 300,
    margin: theme.spacing(1),
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  completeButton: {
    marginTop: 'auto',
  },
  downloadButton: {
    marginTop: '10px',
  },
  appBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
}));

function EnrollmentTable() {
  const classes = useStyles();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [professorId, setProfessorId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [totalLessonsCount, setTotalLessonsCount] = useState(0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [professorName, setProfessorName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      console.error('No token or userId found.');
      return;
    }

    setStudentId(userId);

    fetchStudentName(userId, token);

    fetch('https://localhost:7282/api/Enrollments', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const userEnrollments = data.filter(enrollment => enrollment.studentId === parseInt(userId) && enrollment.courseId !== 0);
        setEnrollments(userEnrollments);
  
        const fetchCoursePromises = userEnrollments.map(enrollment =>
          fetch(`https://localhost:7282/api/Courses/${enrollment.courseId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => response.json())
          .catch(error => console.error(`Error fetching course ${enrollment.courseId}:`, error))
        );
  
        Promise.all(fetchCoursePromises)
          .then(courseDataArray => {
            const uniqueCourses = courseDataArray.reduce((acc, courseData) => {
              if (!acc.some(course => course.courseId === courseData.courseId)) {
                acc.push(courseData);
              }
              return acc;
            }, []);
            setCourses(uniqueCourses);
          })
          .catch(error => console.error('Error fetching course data:', error));
      })
      .catch(error => console.error('Error fetching enrollments:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('https://localhost:7282/api/LessonCompleteds', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const lessonIds = data.map(lesson => lesson.lessonId);
        setCompletedLessons(lessonIds);
      })
      .catch(error => console.error('Error fetching completed lessons:', error));
  }, []);

  useEffect(() => {
    const completedLessonsStorage = JSON.parse(localStorage.getItem('completedLessons'));
    if (completedLessonsStorage) {
      setCompletedLessons(completedLessonsStorage);
      setCompletedLessonsCount(completedLessonsStorage.length);
    }
  }, []);

  const fetchProfessorId = (studentId) => {
    const token = localStorage.getItem('token');

    fetch(`https://localhost:7282/api/Courses?studentId=${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setProfessorId(data[0].professorId);
          fetchProfessorName(data[0].professorId, token);
        }
      })
      .catch(error => console.error('Error fetching professorId:', error));
  };

  const fetchProfessorName = (profId, token) => {
    fetch(`https://localhost:7282/api/Professors/${profId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setProfessorName(data.name);
        }
      })
      .catch(error => console.error('Error fetching professor name:', error));
  };

  const fetchStudentName = (studentId, token) => {
    fetch(`https://localhost:7282/api/Students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setStudentName(data.name);
        }
      })
      .catch(error => console.error('Error fetching student name:', error));
  };

  const fetchCourseName = (courseId, token) => {
    fetch(`https://localhost:7282/api/Lessons/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const courseIdInLessonsTable = data[0].courseId;
          fetch(`https://localhost:7282/api/Courses/${courseIdInLessonsTable}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(response => response.json())
            .then(courseData => {
              if (courseData) {
                setCourseName(courseData.courseName);
              }
            })
            .catch(error => console.error('Error fetching course name:', error));
        }
      })
      .catch(error => console.error('Error fetching lesson details:', error));
  };

  const handleProceed = (courseId) => {
    setSelectedCourseId(courseId);

    const token = localStorage.getItem('token');
    
    fetch(`https://localhost:7282/api/Lessons?courseId=${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const filteredLessons = data.filter(lesson => !completedLessons.includes(lesson.lessonId) && lesson.courseId === courseId && lesson.lessonStatus === 'Approved');
        setLessons(filteredLessons);
        setTotalLessonsCount(filteredLessons.length);
        setCompletedLessonsCount(0); // Reset completed lessons count when selecting a new course
      })
      .catch(error => console.error('Error fetching lessons:', error));

    fetchProfessorId(studentId);
  };

  const handleCompleteLesson = (lessonId) => {
    const token = localStorage.getItem('token');

    const data = {
      studentId: studentId,
      courseId: selectedCourseId,
      professorId: professorId,
      lessonId: lessonId,
      IsCompleted: true,
    };

    fetch('https://localhost:7282/api/LessonCompleteds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          console.log(`Lesson ${lessonId} completed successfully!`);
          const updatedCompletedLessons = [...completedLessons, lessonId];
          setCompletedLessons(updatedCompletedLessons);
          setCompletedLessonsCount(prevCount => prevCount + 1);
          localStorage.setItem('completedLessons', JSON.stringify(updatedCompletedLessons));
        } else {
          console.error(`Error completing lesson ${lessonId}:`, response.statusText);
        }
      })
      .catch(error => console.error(`Error completing lesson ${lessonId}:`, error));
  };

  const handleDownloadCertificate = () => {
    if (completedLessonsCount === totalLessonsCount) {
      const doc = new jsPDF();
      doc.text('Certificate of Completion', 10, 10);
      doc.text(`This is to certify that\n\n${studentName}\n\nhas successfully completed the course\n\n${courseName}\n\nunder the instruction of\n\n${professorName}\n\nDate: ${new Date().toLocaleDateString()}\n\nFake Signature`, 10, 30);
      doc.save('certificate.pdf');
    } else {
      console.log('You must complete all lessons to download the certificate.');
    }
  };
  
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Course Details
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.courseContainer}>
        {selectedCourseId ? (
          <div>
            {lessons.length > 0 && (
              <div className={classes.courseContainer}>
                <Typography variant="h5" className={classes.lessonTitle}>Lessons:</Typography>
                {lessons.map(lesson => (
                  <Card key={lesson.lessonId} className={classes.courseCard}>
                    <CardContent className={classes.cardContent}>
                      <Typography variant="h5" component="h2">
                        {lesson.lessonName}
                      </Typography>
                      <Typography color="textSecondary">
                        {lesson.lessonDescription}
                      </Typography>
                    </CardContent>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      className={classes.completeButton}
                      onClick={() => handleCompleteLesson(lesson.lessonId)}
                      disabled={completedLessons.includes(lesson.lessonId)}
                    >
                      {completedLessons.includes(lesson.lessonId) ? 'Lesson Completed' : 'Complete Lesson'}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              className={classes.downloadButton}
              onClick={handleDownloadCertificate}
              disabled={completedLessonsCount !== totalLessonsCount}
            >
              Download Certificate
            </Button>
          </div>
        ) : (
          <div>
            {courses.map(course => (
              <Card key={course.courseId} className={classes.courseCard}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {course.courseName}
                  </Typography>
                  <Typography color="textSecondary">
                    {course.courseDescription}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleProceed(course.courseId)}
                    style={{ marginTop: '10px' }}
                  >
                    Proceed to Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrollmentTable;
