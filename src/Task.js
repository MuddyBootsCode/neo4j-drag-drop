import React from 'react';
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')}
`;


const Task = ({task, index}) => {
  const { content, id } = task

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) =>
      <Container
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        isDragging={snapshot.isDragging}
      >
      {content}
        </Container>
      }
    </Draggable>

)};

export default Task;