import React, {useEffect, useState} from 'react';
import {Container} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import initialEmptyData from "../initialData";
import Column from "../components/Column";
import {DragDropContext} from "react-beautiful-dnd";
import Paper from "@material-ui/core/Paper";
import {useMutation, useQuery} from "@apollo/client";
import {
  SWAP_TASK,
  GET_TABLE,
  TASK_UPDATE,
  TASK_ORDER,
  GET_TASK,
  columnTasksFragment
} from "../queries/taskTableQueries";
import {scryRenderedComponentsWithType} from "react-dom/test-utils";

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
    const startTasks = [...column.tasks];
    startTasks.splice(taskIndex, 1)
    return {
      ...column,
      tasks: startTasks
    };
}

export const addTaskColumn = (column, taskIndex, newTask) => {
  const finishTasks = [...column.tasks]
  const cp = {...newTask, id: `col-${column.id}-t${taskIndex}`}
  finishTasks.splice(taskIndex, 0, cp);
  return {
    ...column,
    tasks: finishTasks
  }
}

const Table = () => {
  const classes = useStyles();
  const [state, setState] = useState(initialEmptyData);
  const {loading, error, data} = useQuery(GET_TABLE, {variables: {id: 't1'}});
  const [taskOrder] = useMutation(TASK_ORDER)
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
            taskOrder({
              variables: {
                oldId: task.id,
                newId: task.placeMarker
              },
              update: async (client, { data: { updateTaskOrder } }) => {
                try {
                  const data = client.readQuery({query: GET_TABLE, variables: {id: 't1'}});
                  const { Table } = data;
                  const oldTable = Table[0];
                  const strippedCols = [...oldTable.columns.filter(col => col.id !== start.id)]
                  const colToUpdate = oldTable.columns.find(col => col.id === start.id)
                  const updatedColumn = reorderTasks(colToUpdate, source.index, destination.index, draggableId)
                  const updatedTable = {
                    ...oldTable,
                    columns: [...strippedCols, updatedColumn]
                  }

                  client.writeQuery({
                    query: GET_TABLE, data: updatedTable
                  })
                } catch (error) {
                  console.log(error)
                }
              }
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
      const taskToMove = startTasks[source.index];
      startTasks.splice(source.index, 1);
      const newStart = {
        ...start,
        tasks: startTasks
      };

      const newFinish = addTaskColumn(finish, destination.index, taskToMove);

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      }

      console.table(newState)

      setState(newState)

      try {
          await swapTask({
            variables: {
              toColumnId: newFinish.id,
              fromColumnId: newStart.id,
              taskId: taskToMove.id,
              updatedId: newFinish.tasks[destination.index].id
            },
            update: cache => cache.evict({id: `Task:${taskToMove.id}`})
          })

      } catch (error) {
        setState(fallbackState)
        console.log(error)
      }
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