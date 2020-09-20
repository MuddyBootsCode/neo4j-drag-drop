import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import { Delete } from '@material-ui/icons';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) =>
    props.isDragging ? 'lightgreen' : 'lightgrey'};

  &:hover {
    background-color: white;
  }
`;

const Task = ({ task, index, deleteTask, columnId }) => {
  const { content, id } = task;

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
          <Fab
            color='secondary'
            size='small'
            onClick={() => deleteTask(id, columnId)}
          >
            <Tooltip title='Delete Task'>
              <Delete />
            </Tooltip>
          </Fab>
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
