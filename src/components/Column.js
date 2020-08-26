import React from 'react';
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Task from './Task'
import {Divider} from "@material-ui/core";
import {gql} from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: '1em',
    backgroundColor: 'lightgrey'
  },
  title: {
    padding: '8px'
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
    mutation AddTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        AddTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`

const Column = ({ column, tasks }) => {
const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <div className={classes.title}>
        <h3>{column.title}</h3>
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