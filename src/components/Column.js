import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Task from './Task';
import { Divider } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: '1em',
    backgroundColor: 'lightgrey',
  },
  title: {
    padding: '8px',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 100px;
  overflow: auto;
`;

const Column = ({ column, tasks, addTask, deleteTask }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <div className={classes.title}>
        <h3>{column.title}</h3>
        <Fab color='primary' size='small' onClick={() => addTask(column.id)}>
          <Tooltip title='Add Task'>
            <AddIcon />
          </Tooltip>
        </Fab>
      </div>
      <Divider />
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} deleteTask={deleteTask} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Paper>
  );
};

export default Column;
