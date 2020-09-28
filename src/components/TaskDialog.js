import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 'auto',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TaskDialog = ({ open, handleClose, taskId }) => {
  const classes = useStyles();

  const taskString = `We be trying to edit tasks when we get this figured out. For task ${taskId}`;

  return (
    <div id='task-dialog'>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        className={classes.paper}
      >
        <DialogTitle id='dialog-title'>Task {taskId}</DialogTitle>
        <DialogContent>
          <DialogContentText>{taskString}</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Email Address'
            type='email'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => handleClose()} color='primary'>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskDialog;
