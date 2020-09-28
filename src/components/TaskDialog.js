import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction='down'
      timeout={{ appear: 500, enter: 1000, exit: 500 }}
      ref={ref}
      {...props}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  dialog: {},
}));

const TaskDialog = ({ open, handleClose, taskId }) => {
  const classes = useStyles();

  const taskString = `We be trying to edit tasks when we get this figured out. For task ${taskId}`;

  return (
    <div id='task-dialog'>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        className={classes.dialog}
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
          <Button onClick={() => handleClose()} color='secondary'>
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
