import React, { useState, useEffect } from 'react';
import { Button, Table, TableHead, TableBody, TableRow, TableCell, makeStyles, AppBar, Toolbar, Typography } from '@material-ui/core';

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

function ProfessorManagement() {
  const classes = useStyles();
  const [professors, setProfessors] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://localhost:7282/api/Professors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch professors');
      }

      const data = await response.json();

      setProfessors(data);
    } catch (error) {
      console.error('Error fetching professors:', error);
    }
  };

  const handleAction = async (professorId, action) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      let newStatus = '';
      switch (action) {
        case 'Approve':
          newStatus = 'Approved';
          break;
        case 'Reject':
          newStatus = 'Rejected';
          break;
        case 'Suspend':
          newStatus = 'Suspended';
          break;
        case 'Reinstate':
          newStatus = 'Approved';
          break;
        case 'Delete':
          await deleteProfessor(professorId);
          return;
        default:
          break;
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      };

      const response = await fetch(`https://localhost:7282/api/Professors/${action}?professorId=${professorId}`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      fetchProfessors();
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const deleteProfessor = async (professorId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(`https://localhost:7282/api/Professors/${professorId}`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to delete professor');
      }

      fetchProfessors();
    } catch (error) {
      console.error('Error deleting professor:', error);
    }
  };

  const renderProfessorTable = (professorList) => {
    if (professorList.length === 0) {
      return <Typography variant="body1">No details to be displayed.</Typography>;
    }

    let heading = '';
    switch (selectedStatus) {
      case 'Pending':
        heading = 'Pending Requests';
        break;
      case 'Approved':
        heading = 'Approved Professors';
        break;
      case 'Suspended':
        heading = 'Suspended Professors';
        break;
      case 'Rejected':
        heading = 'Rejected Professors';
        break;
      default:
        break;
    }

    return (
      <>
        <Typography variant="h6" gutterBottom>
          {heading}
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professorList.map((professor) => (
              <TableRow key={professor.id}>
                <TableCell>{professor.name}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.status}</TableCell>
                <TableCell>
                  {professor.status === 'Pending' && (
                    <>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(professor.id, 'Approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(professor.id, 'Reject')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {professor.status === 'Approved' && (
                    <>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(professor.id, 'Suspend')}
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(professor.id, 'Delete')}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {professor.status === 'Suspended' && (
                    <>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(professor.id, 'Reinstate')}
                      >
                        Reinstate
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(professor.id, 'Delete')}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {professor.status === 'Rejected' && (
                    <Button
                      variant="contained"
                      className={classes.actionButton}
                      onClick={() => handleAction(professor.id, 'Delete')}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };

  const renderActionButtons = () => {
    return (
      <>
        <Button
          variant="contained"
          color={selectedStatus === 'Pending' ? "primary" : "default"}
          className={classes.actionButton}
          onClick={() => setSelectedStatus('Pending')}
        >
          Pending
        </Button>
        <Button
          variant="contained"
          color={selectedStatus === 'Approved' ? "primary" : "default"}
          className={classes.actionButton}
          onClick={() => setSelectedStatus('Approved')}
        >
          Approved
        </Button>
        <Button
          variant="contained"
          color={selectedStatus === 'Suspended' ? "primary" : "default"}
          className={classes.actionButton}
          onClick={() => setSelectedStatus('Suspended')}
        >
          Suspended
        </Button>
        <Button
          variant="contained"
          color={selectedStatus === 'Rejected' ? "primary" : "default"}
          className={classes.actionButton}
          onClick={() => setSelectedStatus('Rejected')}
        >
          Rejected
        </Button>
      </>
    );
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">
            Professor Management
          </Typography>
          <div style={{ marginLeft: 'auto' }}>
            {renderActionButtons()}
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for the fixed AppBar */}
      {renderProfessorTable(professors.filter(professor => professor.status === selectedStatus))}
    </>
  );
}

export default ProfessorManagement;
