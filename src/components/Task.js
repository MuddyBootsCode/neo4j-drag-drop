import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? 'lightgreen' : 'lightgrey')};
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: white;
  }
`;

const Task = ({ task, index, deleteTask }) => {
  const { content, id, columnId } = task;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {content}
          <Fab color='secondary' size='small' onClick={() => deleteTask(id, columnId)}>
            <Tooltip title='Delete Task'>
              <DeleteIcon />
            </Tooltip>
          </Fab>
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
