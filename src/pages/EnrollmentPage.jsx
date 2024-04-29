// import React, { useState, useEffect } from 'react';
// import { AppBar, Toolbar, Typography, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Checkbox } from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   appBar: {
//     width: '100%',
//     top: 0,
//     zIndex: theme.zIndex.drawer + 1,
//   },
//   title: {
//     flexGrow: 1,
//     textAlign: 'left',
//   },
//   buttonContainer: {
//     padding: theme.spacing(2),
//   },
//   gridContainer: {
//     paddingTop: '64px',
//     paddingRight: '20px',
//     paddingLeft: '20px',
//   },
//   imageContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//   },
//   image: {
//     maxWidth: '100%',
//     maxHeight: '100%',
//   },
// }));

// function EnrollmentPage() {
//   const classes = useStyles();
//   const selectedCourseId = localStorage.getItem('selectedCourseId');
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [courseDetails, setCourseDetails] = useState(null);
//   const [fees, setFees] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [showLessons, setShowLessons] = useState(false);
//   const [showBatches, setShowBatches] = useState(false);
//   const [checkedBatchIndex, setCheckedBatchIndex] = useState(null);
//   const [enrollButtonEnabled, setEnrollButtonEnabled] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');

//     const fetchLessons = async () => {
//       try {
//         if (!selectedCourseId) {
//           console.error('Selected Course ID is undefined');
//           setLoading(false);
//           return;
//         }

//         const lessonTableResponse = await fetch(`https://localhost:7282/api/Lessons`, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${storedToken}`
//           }
//         });

//         if (!lessonTableResponse.ok) {
//           throw new Error(`HTTP error! Status: ${lessonTableResponse.status}`);
//         }

//         const allLessons = await lessonTableResponse.json();

//         const associatedLessons = allLessons.filter(lesson => 
//           lesson.courseId === parseInt(selectedCourseId) && lesson.lessonStatus === 'Approved'
//         ).map(lesson => ({
//           lessonName: lesson.lessonName,
//           lessonDescription: lesson.lessonDescription
//         }));

//         setLessons(associatedLessons);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchLessons();
//   }, [selectedCourseId]);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');

//     const fetchCourseDetails = async () => {
//       try {
//         const courseResponse = await fetch(`https://localhost:7282/api/Courses/${selectedCourseId}`, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${storedToken}`
//           }
//         });

//         if (!courseResponse.ok) {
//           throw new Error(`HTTP error! Status: ${courseResponse.status}`);
//         }

//         const courseData = await courseResponse.json();
//         setCourseDetails(courseData);
//         setFees(courseData.fees);
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError(err.message);
//       }
//     };

//     fetchCourseDetails();
//   }, [selectedCourseId]);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
  
//     const fetchBatches = async () => {
//       try {
//         const batchResponse = await fetch(`https://localhost:7282/api/Batches?CourseId=${selectedCourseId}&BatchStatus=Approved`, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${storedToken}`
//           }
//         });
  
//         if (!batchResponse.ok) {
//           throw new Error(`HTTP error! Status: ${batchResponse.status}`);
//         }
  
//         const batchData = await batchResponse.json();
        
//         // Filter batches based on the selected course ID and BatchStatus
//         const filteredBatches = batchData.filter(batch => batch.courseId === parseInt(selectedCourseId));
        
//         setBatches(filteredBatches);
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError(err.message);
//       }
//     };
  
//     if (showBatches) {
//       fetchBatches();
//     }
//   }, [selectedCourseId, showBatches]);

//   useEffect(() => {
//     // Enable enroll button only when a batch is selected
//     setEnrollButtonEnabled(checkedBatchIndex !== null);
//   }, [checkedBatchIndex]);

//   const handleEnrollClick = () => {
//     setOpenDialog(true);
//   };

//   const handlePayAndEnroll = async () => {
//     const storedToken = localStorage.getItem('token');

//     const enrollmentData = {
//       courseId: selectedCourseId,
//       professorId: courseDetails.professorId,
//       lessons: lessons.map(lesson => ({
//         lessonName: lesson.lessonName,
//         lessonDescription: lesson.lessonDescription,
//         lessonStatus: 'Pending'
//       }))
//     };

//     try {
//       const enrollmentResponse = await fetch(`https://localhost:7282/api/Enrollments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${storedToken}`
//         },
//         body: JSON.stringify(enrollmentData)
//       });

//       if (!enrollmentResponse.ok) {
//         throw new Error(`HTTP error! Status: ${enrollmentResponse.status}`);
//       }

//       setOpenDialog(false);
//       // Handle success, maybe redirect to a success page or show a success message
//     } catch (err) {
//       console.error('Enrollment error:', err);
//       setError(err.message);
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleToggleLessons = () => {
//     setShowBatches(false); // Close batches when toggling lessons
//     setShowLessons(!showLessons);
//   };

//   const handleToggleBatches = () => {
//     setShowLessons(false); // Close lessons when toggling batches
//     setShowBatches(!showBatches);
//   };

//   const handleCheckboxChange = (index) => {
//     setCheckedBatchIndex(index);
  
//     // Retrieve the batch ID from the batches array using the index
//     const selectedBatchId = batches[index].batchId;
  
//     // Store the selected batch ID in the local storage
//     localStorage.setItem('selectedBatchId', selectedBatchId);
//   };
  
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className={classes.root}>
//       <AppBar position="fixed" className={classes.appBar}>
//         <Toolbar>
//           <Typography variant="h6" className={classes.title}>
//             Lessons and Batches 
//           </Typography>
//           <div className={classes.buttonContainer}>
//             <Button variant="contained" color="primary" onClick={handleToggleLessons}>
//               {showLessons ? "Hide Lessons" : "Show Lessons"}
//             </Button>
//             <Button variant="contained" color="secondary" onClick={handleToggleBatches}>
//               {showBatches ? "Hide Batches" : "Show Batches"}
//             </Button>
//           </div>
//         </Toolbar>
//       </AppBar>
//       <Grid container className={classes.gridContainer}>
//         {showLessons && (
//           <Grid item xs={12} sm={6}>
//             <Typography variant="h6" className={classes.title}>
//               Lessons
//             </Typography>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Lesson Name</TableCell>
//                     <TableCell>Description</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {lessons.map((lesson, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{lesson.lessonName}</TableCell>
//                       <TableCell>{lesson.lessonDescription}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Grid>
//         )}
//         {showBatches && (
//           <Grid item xs={12} sm={6}>
//             <Typography variant="h6" className={classes.title}>
//               Batches 
//             </Typography>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell></TableCell>
//                     <TableCell>Batch Name</TableCell>
//                     <TableCell>Start Date</TableCell>
//                     <TableCell>End Date</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {batches.map((batch, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <Checkbox
//                           checked={checkedBatchIndex === index}
//                           onChange={() => handleCheckboxChange(index)}
//                           disabled={checkedBatchIndex !== null && checkedBatchIndex !== index}
//                         />
//                       </TableCell>
//                       <TableCell>{batch.batchName}</TableCell>
//                       <TableCell>{new Date(batch.startDate).toLocaleDateString()}</TableCell>
//                       <TableCell>{new Date(batch.endDate).toLocaleDateString()}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleEnrollClick}
//               disabled={!enrollButtonEnabled}
//               style={{ marginTop: '20px' }}
//             >
//               Enroll
//             </Button>
//           </Grid>
//         )}
//         <Grid item xs={12} sm={6}>
//           <Typography variant="body1" style={{ marginBottom: '20px',fontWeight:'bold',fontSize:'20px' }}>
//             "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
//           </Typography>
//           <p style={{fontFamily:'Helvetica sans-serif',fontSize:'16px',fontStyle:'italic'}}>Hey There! Look into the Lessons and Select Your Batches and Start Enrolling and Dive into Pool of Education!
//           </p>
//           <div className={classes.imageContainer}>
//             <img src="https://img.freepik.com/premium-photo/3d-render-little-boy-with-backpack-notebook_1057-30474.jpg?w=740" alt="Child with backpack" className={classes.image} />
//           </div>
//         </Grid>
//       </Grid>
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Enroll in Course</DialogTitle>
//         <DialogContent>
//           <Typography variant="subtitle1">Are you sure you want to pay and enroll in the course "{courseDetails?.courseName}" for {fees ? `$${fees}` : 'the specified fees'}?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button color="primary" onClick={handlePayAndEnroll}>
//             Pay and Enroll
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// export default EnrollmentPage;



import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Checkbox } from '@material-ui/core';

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
  buttonContainer: {
    padding: theme.spacing(2),
  },
  gridContainer: {
    paddingTop: '64px',
    paddingRight: '20px',
    paddingLeft: '20px',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

function EnrollmentPage() {
  const classes = useStyles();
  const selectedCourseId = localStorage.getItem('selectedCourseId');
  const selectedBatchId = localStorage.getItem('selectedBatchId');
  const professorId = localStorage.getItem('professorId'); // Assuming professorId is stored in localStorage
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [fees, setFees] = useState(null);
  const [batches, setBatches] = useState([]);
  const [showLessons, setShowLessons] = useState(false);
  const [showBatches, setShowBatches] = useState(false);
  const [checkedBatchIndex, setCheckedBatchIndex] = useState(null);
  const [enrollButtonEnabled, setEnrollButtonEnabled] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    const fetchLessons = async () => {
      try {
        if (!selectedCourseId) {
          console.error('Selected Course ID is undefined');
          setLoading(false);
          return;
        }

        const lessonTableResponse = await fetch(`https://localhost:7282/api/Lessons`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        if (!lessonTableResponse.ok) {
          throw new Error(`HTTP error! Status: ${lessonTableResponse.status}`);
        }

        const allLessons = await lessonTableResponse.json();

        const associatedLessons = allLessons.filter(lesson => 
          lesson.courseId === parseInt(selectedCourseId) && lesson.lessonStatus === 'Approved'
        ).map(lesson => ({
          lessonName: lesson.lessonName,
          lessonDescription: lesson.lessonDescription
        }));

        setLessons(associatedLessons);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLessons();
  }, [selectedCourseId]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await fetch(`https://localhost:7282/api/Courses/${selectedCourseId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        if (!courseResponse.ok) {
          throw new Error(`HTTP error! Status: ${courseResponse.status}`);
        }

        const courseData = await courseResponse.json();
        setCourseDetails(courseData);
        setFees(courseData.fees);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };

    fetchCourseDetails();
  }, [selectedCourseId]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
  
    const fetchBatches = async () => {
      try {
        const batchResponse = await fetch(`https://localhost:7282/api/Batches?CourseId=${selectedCourseId}&BatchStatus=Approved`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
  
        if (!batchResponse.ok) {
          throw new Error(`HTTP error! Status: ${batchResponse.status}`);
        }
  
        const batchData = await batchResponse.json();
        
        // Filter batches based on the selected course ID and BatchStatus
        const filteredBatches = batchData.filter(batch => batch.courseId === parseInt(selectedCourseId));
        
        setBatches(filteredBatches);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };
  
    if (showBatches) {
      fetchBatches();
    }
  }, [selectedCourseId, showBatches]);

  useEffect(() => {
    // Enable enroll button only when a batch is selected
    setEnrollButtonEnabled(checkedBatchIndex !== null);
  }, [checkedBatchIndex]);

  const handleEnrollClick = () => {
    setOpenDialog(true);
  };

  const handlePayAndEnroll = async () => {
    const storedToken = localStorage.getItem('token');

    const enrollmentData = {
      CourseId: parseInt(selectedCourseId),
      BatchId: parseInt(selectedBatchId),
      ProfessorId: parseInt(professorId), // Corrected typo here
      RegistrarStatus: 'Pending',
      TaskCompleted: null, // Set other properties to null
      CompletionStatus: null // Set other properties to null
    };

    try {
      const enrollmentResponse = await fetch(`https://localhost:7282/api/Enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify(enrollmentData)
      });

      if (!enrollmentResponse.ok) {
        const errorMessage = await enrollmentResponse.text();
        throw new Error(`HTTP error! Status: ${enrollmentResponse.status}. Message: ${errorMessage}`);
      }

      setOpenDialog(false);
      // Handle success, maybe redirect to a success page or show a success message
    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err.message);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleToggleLessons = () => {
    setShowBatches(false); // Close batches when toggling lessons
    setShowLessons(!showLessons);
  };

  const handleToggleBatches = () => {
    setShowLessons(false); // Close lessons when toggling batches
    setShowBatches(!showBatches);
  };

  const handleCheckboxChange = (index) => {
    setCheckedBatchIndex(index);
  
    // Retrieve the batch ID from the batches array using the index
    const selectedBatchId = batches[index].batchId;
  
    // Store the selected batch ID in the local storage
    localStorage.setItem('selectedBatchId', selectedBatchId);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Lessons and Batches 
          </Typography>
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" onClick={handleToggleLessons}>
              {showLessons ? "Hide Lessons" : "Show Lessons"}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleToggleBatches}>
              {showBatches ? "Hide Batches" : "Show Batches"}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Grid container className={classes.gridContainer}>
        {showLessons && (
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className={classes.title}>
              Lessons
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lesson Name</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessons.map((lesson, index) => (
                    <TableRow key={index}>
                      <TableCell>{lesson.lessonName}</TableCell>
                      <TableCell>{lesson.lessonDescription}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        {showBatches && (
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className={classes.title}>
              Batches 
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Batch Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batches.map((batch, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={checkedBatchIndex === index}
                          onChange={() => handleCheckboxChange(index)}
                          disabled={checkedBatchIndex !== null && checkedBatchIndex !== index}
                        />
                      </TableCell>
                      <TableCell>{batch.batchName}</TableCell>
                      <TableCell>{new Date(batch.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(batch.endDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEnrollClick}
              disabled={!enrollButtonEnabled}
              style={{ marginTop: '20px' }}
            >
              Enroll
            </Button>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" style={{ marginBottom: '20px',fontWeight:'bold',fontSize:'20px' }}>
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </Typography>
          <p style={{fontFamily:'Helvetica sans-serif',fontSize:'16px',fontStyle:'italic'}}>Hey There! Look into the Lessons and Select Your Batches and Start Enrolling and Dive into Pool of Education!
          </p>
          <div className={classes.imageContainer}>
            <img src="https://img.freepik.com/premium-photo/3d-render-little-boy-with-backpack-notebook_1057-30474.jpg?w=740" alt="Child with backpack" className={classes.image} />
          </div>
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enroll in Course</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Are you sure you want to pay and enroll in the course "{courseDetails?.courseName}" for {fees ? `$${fees}` : 'the specified fees'}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={handlePayAndEnroll}>
            Pay and Enroll
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EnrollmentPage;
