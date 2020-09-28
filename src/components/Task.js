import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TaskDialog from './TaskDialog';

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
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {open ? (
        <TaskDialog open={open} handleClose={handleClose} taskId={id} />
      ) : (
        ''
      )}
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
              <Tooltip title='Edit Task'>
                <EditButton onClick={() => handleClickOpen()}>
                  <EditOutlinedIcon style={{ fontSize: 20 }} />
                </EditButton>
              </Tooltip>
              <Tooltip title='Delete Task'>
                <DeleteButton onClick={() => deleteTask(id, columnId)}>
                  <DeleteOutlinedIcon fontSize='small' />
                </DeleteButton>
              </Tooltip>
            </div>
          </Container>
        )}
      </Draggable>
    </>
  );
};

export default Task;
