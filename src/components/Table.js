import React, {useEffect, useState} from 'react';
import {Container} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import initialData from "../initialData";
import Column from "../components/Column";
import { DragDropContext } from "react-beautiful-dnd";
import Paper from "@material-ui/core/Paper";
import { useMutation, useQuery } from "@apollo/client";
import {GET_TABLE, COL_UPDATE, ADD_TASK, REMOVE_TASK } from "../queries/taskTableQueries";

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      height: '100vh'
    },
    paper: {
      margin: '1em',
      display: 'flex'
    }
}));


const Table = () => {
  const classes = useStyles();
  const [state, setState] = useState(initialData);
  const {loading, error, data} = useQuery(GET_TABLE, {variables: {id: 't1'}});
  const [colUpdate] = useMutation(COL_UPDATE)
  const [addTask] = useMutation(ADD_TASK);
  const [removeTask] = useMutation(REMOVE_TASK);

  const onDragEnd = async (result) => {
    const {destination, source, draggableId} = result;
    const fallbackState = {...state};

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source &&
      destination.index === source.index
    ) {
      return;
    }

    const start = state.columns.find(col => col.id === source.droppableId);
    const finish = state.columns.find(col => col.id === destination.droppableId);

    if (start === finish) {
      const newTaskIds = [...start.taskIds]
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };


      const updatedColumns = state.columns.filter(col => col.id !== start.id)

      const newColumns = [...updatedColumns, newColumn]

      const newState = {
        ...state,
        columns: newColumns
      };

      setState(newState);

      try{
        await colUpdate({
          variables: {
            id: newColumn.id,
            taskIds: newTaskIds
          }
        })
        return;
      } catch(e){
        setState(fallbackState)
        console.log(e)
      }
    }

    if(start !== finish){
      const startTaskIds = [...start.taskIds];
      const startTasks = [...start.tasks];
      const moveTask = startTasks[0]
      const taskId = startTaskIds[source.index];
      startTaskIds.splice(source.index, 1);
      startTasks.splice(source.index, 1)
      const newStart = {
        ...start,
        taskIds: startTaskIds,
        tasks: startTasks
      };


      const finishTaskIds = [...finish.taskIds];
      const finishTasks = [...finish.tasks]
      finishTaskIds.splice(destination.index, 0, draggableId);
      finishTasks.splice(destination.index, 0, moveTask);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
        tasks: finishTasks
      }

      const changeIds = [start.id, finish.id];
      const currentColumns = [...state.columns];
      changeIds.forEach((id) => {
        const removeIndex = currentColumns.map(col => col.id).indexOf(id)
        currentColumns.splice(removeIndex, 1)
      })
      const updatedColumns = [...currentColumns, newStart, newFinish]

      const newState = {
        ...state,
        columns: updatedColumns
      }
      console.log(newState, ' New State')
      setState(newState)

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
        setState(fallbackState)
        console.error(e);
        console.log('Error at newStart update')
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
        setState(fallbackState)
        console.error(e);
        console.log('Error at newFinish update')
      }
    }
  };

  useEffect(() => {

    if (data) {
      const { Table } = data;
      setState(Table[0])
    }
  }, [data])

  if (loading) {
    return <div>...Loading</div>
  }

  if (error) {
    console.warn(error)
  }

  console.log(state)

  return (
    <Container className={classes.root}>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Paper className={classes.paper}>
          {
            state && state.columnOrder.map((columnId) => {
              const column = state.columns.find(column => column.id === columnId);
              const tasks = column.taskIds.map(id => {
                return column.tasks.find(task => task.id === id)
              })
              return <Column key={column.id} column={column} tasks={tasks} />
            })
          }
        </Paper>
      </DragDropContext>
    </Container>
  );
};

export default Table;