import React, {useEffect, useState} from 'react';
import {Container} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import initialEmptyData from "../initialData";
import Column from "../components/Column";
import {DragDropContext} from "react-beautiful-dnd";
import Paper from "@material-ui/core/Paper";
import {useMutation, useQuery} from "@apollo/client";
import {SWAP_TASK, GET_TABLE, TASK_UPDATE} from "../queries/taskTableQueries";

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

export const reorderTasks = (column, sourceIndex, destinationIndex, draggableId) => {
  const tasks = [...column.tasks]
  let moveTask = tasks.find(task => task.id === draggableId)
  tasks.splice(sourceIndex, 1);
  tasks.splice(destinationIndex, 0, moveTask);

  const newTasks = tasks.map((task, index) => {
    const cp = {...task}
    cp.placeMarker = `col-${column.id}-t${index}`
    return cp
  })

  return {
    ...column,
    tasks: [...newTasks]
  };
};

export const changeTaskColumn = (column, taskIndex) => {
    const startTaskIds = [...column.taskIds];
    const startTasks = [...column.tasks];
    startTaskIds.splice(taskIndex, 1);
    startTasks.splice(taskIndex, 1)
    return {
      ...column,
      taskIds: startTaskIds,
      tasks: startTasks
    };
}

export const addTaskColumn = (column, taskIndex, newTask, draggableId) => {
  const finishTaskIds = [...column.taskIds];
  const finishTasks = [...column.tasks]
  finishTaskIds.splice(taskIndex, 0, draggableId);
  finishTasks.splice(taskIndex, 0, newTask);
  return {
    ...column,
    taskIds: finishTaskIds,
    tasks: finishTasks
  }
}

export const allColumnUpdate = (columns, changeIds) => {
  const newCols = [...columns];
  changeIds.forEach((id) => {
    const removeIndex = newCols.map(col => col.id).indexOf(id)
    newCols.splice(removeIndex, 1)
  })
  return newCols;
}

const Table = () => {
  const classes = useStyles();
  const [state, setState] = useState(initialEmptyData);
  const {loading, error, data} = useQuery(GET_TABLE, {variables: {id: 't1'}});
  const [taskUpdate] = useMutation(TASK_UPDATE)
  const [swapTask] = useMutation(SWAP_TASK)

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

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId]

    if (start === finish) {

      const newColumn = reorderTasks(start, source.index, destination.index, draggableId)

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn
        }
      };

      setState(newState);

      try{
        await Promise.all(
          newColumn.tasks.map((task) => {
            taskUpdate({
              variables: {
                ...task
              },
            })
          })
        )
        return;
      } catch(e){
        setState(fallbackState)
        console.warn(e)
      }
    }

    if(start !== finish){
      const startTasks = [...start.tasks];
      const taskId = startTasks[source.index];
      startTasks.splice(source.index, 1);
      const newStart = {
        ...start,
        tasks: startTasks
      };

      const finishTaskIds = [...finish.taskIds];
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        taskIds: finishTaskIds
      }

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      }

      setState(newState)

      // try {
      //     await swapTask({
      //       variables: {
      //         toColumnId: newFinish.id,
      //         fromColumnId: newStart.id,
      //         taskId
      //       }
      //     })
      // } catch (error) {
      //   setState(fallbackState)
      //   console.log(error)
      // }
    }
  };

  const setTable = (data) => {
    const { Table } = data
    const tableData = Table[0];
    const columns = {};
    const columnOrder = tableData.columns.map(column => column.id);

    // Pull out all columns and their associated task ids
    tableData.columns.forEach((col) => {
      columns[col.id] = {id: col.id, title: col.title, tasks: col.tasks}
    })

    const table = {
      columns,
      columnOrder
    }

    setState(table)
  }

  useEffect(() => {

    if (data) {
      setTable(data)
    }
  }, [data])

  if (loading) {
    return <div>...Loading</div>
  }

  if (error) {
    console.warn(error)
  }

  return (
    <Container className={classes.root}>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Paper className={classes.paper}>
          {
            state && state.columnOrder.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column.tasks
              return <Column key={column.id} column={column} tasks={tasks}/>
            })
          }
        </Paper>
      </DragDropContext>
    </Container>
  );
};

export default Table;