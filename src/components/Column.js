import React from 'react';
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import {Droppable} from "react-beautiful-dnd";
import styled from "styled-components";
import Task from './Task'
import {Divider, Fab} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { useMutation } from "@apollo/client";
import Tooltip from "@material-ui/core/Tooltip";
import { CREATE_TASK } from "../queries/taskTableQueries";

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
    justifyContent: 'space-around'
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

const Column = ({columnId}) => {
  console.log(columnId)
  const [createTask] = useMutation(CREATE_TASK);

  // const handleClick = () => {
  //   return createTask({
  //     variables: {
  //       columnId: column.id,
  //       taskContent: `Task created for Column ${column.id}`
  //     }
  //   })
  // }

  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <div className={classes.title}>
        <h3>{columnId}</h3>

          {/*<Fab color="primary" size="small" onClick={handleClick}>*/}
          {/*  <Tooltip title="Add Task">*/}
          {/*    <AddIcon/>*/}
          {/*  </Tooltip >*/}
          {/*</Fab>*/}

      </div>
      <Divider/>
      {/*<Droppable droppableId={column.id}>*/}
      {/*  {(provided, snapshot) =>*/}
      {/*    <TaskList*/}
      {/*      ref={provided.innerRef}*/}
      {/*      {...provided.droppableProps}*/}
      {/*      isDraggingOver={snapshot.isDraggingOver}*/}
      {/*    >*/}
      {/*      {tasks && tasks.map((task, index) => <Task key={task.id} task={task} index={index}/>)}*/}
      {/*      {provided.placeholder}*/}
      {/*    </TaskList>*/}
      {/*  }*/}
      {/*</Droppable>*/}
    </Paper>
  );
};

export default Column;