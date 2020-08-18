import React, { useState, useEffect } from 'react';
import './App.css';
import initialData from "./initialData";
import Column from "./Column";
import { DragDropContext } from "react-beautiful-dnd";
import {gql, useMutation, useQuery } from "@apollo/client";

const GET_TABLES = gql`
  query GetTables($title: String){
    Table(title: $title){
        id
        title
        columnOrder
        columns{
            id
            title
            taskIds
            tasks{
                id
                content
            }
        }
    }
  }
`

const COL_UPDATE = gql`
  mutation UpdateColumn($id: ID!, $title: String, $taskIds: [ID], $tasks: [Task]){
    UpdateColumn(id: $id, title: $title, taskIds: $taskIds, tasks: $tasks){
        id,
        title,
        taskIds,
        tasks,
    }
  }
`

function App() {
  const [state, setState] = useState(initialData);
  const { loading, error, data } = useQuery(GET_TABLES, {variables: 'Test Table'});
  const [update, { updateLoading, updateError}] = useMutation(COL_UPDATE)

  const onDragEnd = (result) => {
    const {destination, source, draggableId} = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source &&
      destination.index === source.index
    ) {
      return;
    }

    const column = state.columns[source.droppableId];
    const newTaskIds = [...column.taskIds]
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn
      }
    };

    setState(newState);
    console.log(state)

  };

  const setTable = (data) => {
    const { Table } = data;
    const tasks = {};
    const columns = {};
    const columnOrder = Table[0].columnOrder;
    // Pull all tasks out into their own object
    Table[0].columns.forEach((col) => {
      col.tasks.forEach((task) => {
        tasks[task.id] = {id: task.id, content: task.content}
      })
    });
    // Pull out all columns and their associated task ids
    Table[0].columns.forEach((col) => {
      columns[col.id] = {id: col.id, title: col.title, taskIds: col.taskIds}
    })

    const table = {
      tasks,
      columns,
      columnOrder
    }
    setState(table)
  }

  useEffect(() => {
    console.log(state, ' From State Change')
  }, [state])

  useEffect(() => {

    if(data) {
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
    <div className="App">
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        {
          state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map(taskId => state.tasks[taskId])
            return <Column key={column.id} column={column} tasks={tasks}/>
          })
        }
      </DragDropContext>
    </div>
  );
}

export default App;
