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

function StudentManagement() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://localhost:7282/api/Students', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAction = async (userId, action) => {
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
          await deleteStudent(userId);
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

      const response = await fetch(`https://localhost:7282/api/Students/${action}?userId=${userId}`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      fetchUsers();
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const deleteStudent = async (userId) => {
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

      const response = await fetch(`https://localhost:7282/api/Students/${userId}`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      fetchUsers();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const renderUserTable = (userList) => {
    if (userList.length === 0) {
      return <Typography variant="body1">No details to be displayed.</Typography>;
    }

    let heading = '';
    switch (selectedStatus) {
      case 'Pending':
        heading = 'Pending Requests';
        break;
      case 'Approved':
        heading = 'Approved Users';
        break;
      case 'Suspended':
        heading = 'Suspended Users';
        break;
      case 'Rejected':
        heading = 'Rejected Users';
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
            {userList.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  {user.status === 'Pending' && (
                    <>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(user.id, 'Approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(user.id, 'Reject')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {user.status === 'Approved' && (
                    <>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(user.id, 'Suspend')}
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(user.id, 'Delete')}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {user.status === 'Suspended' && (
                    <>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(user.id, 'Reinstate')}
                      >
                        Reinstate
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.actionButton}
                        onClick={() => handleAction(user.id, 'Delete')}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {user.status === 'Rejected' && (
                    <Button
                      variant="contained"
                      className={classes.actionButton}
                      onClick={() => handleAction(user.id, 'Delete')}
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
            Student Management
          </Typography>
          <div style={{ marginLeft: 'auto' }}>
            {renderActionButtons()}
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for the fixed AppBar */}
      {renderUserTable(users.filter(user => user.status === selectedStatus))}
    </>
  );
}

export default StudentManagement;
