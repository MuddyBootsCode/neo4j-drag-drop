import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import initialData from '../initialData';
import Column from '../components/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import Paper from '@material-ui/core/Paper';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  GET_TABLE,
  COL_UPDATE,
  ADD_TASK,
  REMOVE_TASK,
  CREATE_TASK,
  DELETE_TASK,
  TASK_SUBSCRIPTION,
} from '../queries/tableQueries';
import short from 'short-uuid';
import { addTaskFunction } from '../utils/tableFunctions';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    height: '100vh',
    backgroundColor: 'lightblue',
  },
  paper: {
    margin: '1em',
    display: 'flex',
  },
}));

const Table = () => {
  const classes = useStyles();
  const [state, setState] = useState(initialData);
  const { loading, error, data } = useQuery(GET_TABLE, {
    variables: 'Test Table',
  });
  const [colUpdate] = useMutation(COL_UPDATE);
  const [removeTask] = useMutation(REMOVE_TASK);
  const [addTask] = useMutation(ADD_TASK);
  const [createTask] = useMutation(CREATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const { taskSubData } = useSubscription(TASK_SUBSCRIPTION);

  const deleteColumnTask = async (taskId, columnId) => {
    const fallBackState = { ...state };

    const updatedTasks = { ...state.tasks };
    delete updatedTasks[taskId];

    const updatedColumn = {
      ...state.columns[columnId],
      taskIds: [...state.columns[columnId].taskIds.filter((t) => t !== taskId)],
    };

    const newState = {
      ...state,
      tasks: updatedTasks,
      columns: { ...state.columns, [columnId]: updatedColumn },
    };

    setState(newState);

    try {
      await deleteTask({
        variables: {
          id: taskId,
        },
      });
    } catch (e) {
      setState(fallBackState);
      console.log(e, ' Error at Task Deletion');
    }

    try {
      await colUpdate({
        variables: {
          ...updatedColumn,
        },
      });
    } catch (e) {
      setState(fallBackState);
      console.log(e, ' Error on column update after task delete');
    }
  };

  const addColumnTask = async (columnId) => {
    const taskId = short.generate();

    const fallBackState = { ...state };

    const colToUpdate = state.columns[columnId];

    const newState = addTaskFunction(colToUpdate, { ...state.tasks }, taskId);

    setState({
      ...state,
      tasks: newState.tasks,
      columns: { ...state.columns, [columnId]: newState.column },
    });

    try {
      await createTask({
        variables: {
          taskContent: newState.tasks[taskId].content,
          taskId,
          columnId,
        },
      });
    } catch (e) {
      setState(fallBackState);
      console.log(e, ' Error adding task');
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    const fallbackState = { ...state };

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source &&
      destination.index === source.index
    ) {
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = [...start.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);

      try {
        await colUpdate({
          variables: {
            ...newColumn,
          },
        });
        return;
      } catch (e) {
        setState(fallbackState);
        console.warn(e);
      }
    }

    if (start !== finish) {
      const startTaskIds = [...start.taskIds];
      const taskId = startTaskIds[source.index];
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: [...start.taskIds.filter((id) => id !== draggableId)],
      };

      const finishTaskIds = [...finish.taskIds];
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
      setState(newState);

      try {
        const data = await colUpdate({
          variables: {
            ...newStart,
          },
        });
        const {
          data: {
            UpdateColumn: { id },
          },
        } = data;
        await removeTask({
          variables: {
            from: { id: taskId },
            to: { id },
          },
        });
      } catch (e) {
        setState(fallbackState);
        console.error(e);
        console.log('Error at newStart update');
      }

      try {
        const data = await colUpdate({
          variables: {
            ...newFinish,
          },
        });
        const {
          data: {
            UpdateColumn: { id },
          },
        } = data;
        await addTask({
          variables: {
            from: { id: taskId },
            to: { id },
          },
        });
      } catch (e) {
        setState(fallbackState);
        console.error(e);
        console.log('Error at newFinish update');
      }
    }
  };

  const setTable = (data) => {
    const { Table } = data;
    const tasks = {};
    const columns = {};
    const columnOrder = Table[0].columns.map((column) => column.id);
    // Pull all tasks out into their own object
    Table[0].columns.forEach((col) => {
      col.tasks.forEach((task) => {
        tasks[task.id] = { id: task.id, content: task.content };
      });
    });
    // Pull out all columns and their associated task ids
    Table[0].columns.forEach((col) => {
      columns[col.id] = { id: col.id, title: col.title, taskIds: col.taskIds };
    });

    const table = {
      tasks,
      columns,
      columnOrder,
    };

    setState(table);
  };

  useEffect(() => {
    if (data) {
      setTable(data);
    }
  }, [data]);

  if (loading) {
    return <div>...Loading</div>;
  }

  if (error) {
    console.warn(error);
  }

  return (
    <Container className={classes.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Paper className={classes.paper}>
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                addTask={addColumnTask}
                deleteTask={deleteColumnTask}
              />
            );
          })}
        </Paper>
      </DragDropContext>
    </Container>
  );
};

export default Table;
