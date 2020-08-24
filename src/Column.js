import React from 'react';
import styled from "styled-components";
import Task from "./Task";
import {Droppable} from "react-beautiful-dnd";
import {gql, useMutation} from "@apollo/client";

const CREATE_TASK = gql`
    mutation addTask($taskContent: String!, $columnId: ID!){
        addTask(taskContent: $taskContent, columnId: $columnId){
            id
        }
    }
`

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 300px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 100px;
`;

const AddTaskButton = styled.button`
  margin-left: 5px;
  background-color: lightblue;
`

const Column = ({column, tasks}) => {
  const [addTask] = useMutation(CREATE_TASK);

  return (
    <Container>
      <div>
        <div>
          <Title>{column.title}</Title>
        </div>
        <div>
          Add Task
          <AddTaskButton
            onClick={() => addTask({ variables: {
              taskContent: `New task created in column ${column.title}`,
              columnId: column.id
              }})}
          >+</AddTaskButton>
        </div>
      </div>
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
    </Container>
  );
};

export default Column;