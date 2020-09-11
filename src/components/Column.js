import React from 'react';
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Task from './Task'
import {Divider} from "@material-ui/core";
import {gql, useMutation} from "@apollo/client";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: '1em',
    backgroundColor: 'lightgrey'
  },
  title: {
    padding: '8px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  taskList: {
    padding: '8px',
    transition: 'background-color 0.2s ease',
    backgroundColor: (props) => props.isDraggingOver ? 'skyblue' : 'grey',
    flexGrow: 1,
    minHeight: '100px'
  }
}));

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 100px;
`;

const ADD_TASK = gql`
    mutation addTask($taskContent: String!, $columnId: ID!){
        addTask(taskContent: $taskContent, columnId: $columnId){
            id
        }
    }
`

const Column = ({ column, tasks }) => {
  const classes = useStyles();
  const [createTask] = useMutation(ADD_TASK)


  const handleClick = () => {
    return createTask({
      variables: {
        columnId: column.id,
        taskContent: `Task created for Column ${column.id}`
      }
    })
  }

  return (
    <Paper className={classes.paper}>
      <div className={classes.title}>
        <h3>{column.title}</h3>
        <Fab color="primary" size="small" onClick={handleClick}>
          <Tooltip title="Add Task">
            <AddIcon/>
          </Tooltip >
        </Fab>
      </div>
      <Divider />
      <Droppable droppableId={column.id}>
        {(provided, snapshot) =>
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.map((task, index) => <Task key={task.id} task={task} index={index}/>)}
            {provided.placeholder}
          </TaskList>
        }
      </Droppable>
    </Paper>
  );
};

export default Column;