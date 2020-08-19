import React, {useState, useEffect} from 'react';
import './App.css';
import initialData from "./initialData";
import Column from "./Column";
import {DragDropContext} from "react-beautiful-dnd";
import {gql, useMutation, useQuery} from "@apollo/client";
import styled from "styled-components";

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
    mutation UpdateColumn($id: ID!, $title: String, $taskIds: [ID]){
        UpdateColumn(id: $id, title: $title, taskIds: $taskIds){
            id
        }
    }
`

const REMOVE_TASK = gql`
    mutation RemoveTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        RemoveTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`

const ADD_TASK = gql`
    mutation AddTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        AddTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`

const Container = styled.div`
  display: flex;
`;

function App() {
  const [state, setState] = useState(initialData);
  const {loading, error, data} = useQuery(GET_TABLES, {variables: 'Test Table'});
  const [colUpdate] = useMutation(COL_UPDATE)
  const [addTask] = useMutation(ADD_TASK);
  const [removeTask] = useMutation(REMOVE_TASK);

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

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId]
    if (start === finish) {
      const newTaskIds = [...start.taskIds]
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
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
      colUpdate({
        variables: {
          ...newColumn
        }
      })
        .catch(error => console.log(error))
      return;
    }

    const startTaskIds = [...start.taskIds];
    const taskId = startTaskIds[source.index];
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
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

    colUpdate({
      variables: {
        ...newStart
      }
    })
      .then((data) => {
        const {data: {UpdateColumn: {id}}} = data;
        removeTask({
          variables: {
            from: {id: taskId},
            to: {id}
          }
        })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))

    colUpdate({
      variables: {
        ...newFinish
      }
    })
      .then((data) => {
        const {data: {UpdateColumn: {id}}} = data;
        addTask({
          variables: {
            from: {id: taskId},
            to: {id}
          }
        })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))

  };

  const setTable = (data) => {
    const {Table} = data;
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
    <div className="App" style={{ display: 'flex', justifyContent: 'space-around'}}>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Container>
          {
            state.columnOrder.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map(taskId => state.tasks[taskId])
              return <Column key={column.id} column={column} tasks={tasks}/>
            })
          }
        </Container>
      </DragDropContext>
    </div>
  );
}

export default App;
