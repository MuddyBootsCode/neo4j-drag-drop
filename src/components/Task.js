import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  border: ${(props) =>
    props.isDragging ? '2px solid black' : '1px solid lightgrey'};
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) =>
    props.isDragging ? 'lightgreen' : 'lightgrey'};

  &:hover {
    background-color: white;
    border: 2px solid black;
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  
  &:hover {
  color: red;
`;

const EditButton = styled.button`
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  
  &:hover {
  color: blue;
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
          <div>
            <EditButton>
              <Tooltip title='Edit Task'>
                <EditOutlinedIcon style={{ fontSize: 20 }} />
              </Tooltip>
            </EditButton>
            <DeleteButton onClick={() => deleteTask(id, columnId)}>
              <Tooltip title='Delete Task'>
                <DeleteOutlinedIcon fontSize='small' />
              </Tooltip>
            </DeleteButton>
          </div>
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
