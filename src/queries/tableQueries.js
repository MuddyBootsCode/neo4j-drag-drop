import {gql} from "@apollo/client";

const GET_TABLE = gql`
    query GetTables($title: String){
        Table(title: $title){
            id
            title
            columns(orderBy: id_asc){
                id
                title
                taskIds
                tasks{
                    id
                    content
                }
                table {
                    id
                }
            }
        }
    }
`

const GET_COLUMN = gql`
    query GetColumn($id: ID){
        GetColumn(id: $id){
            id
            tasks{
                id
            }
            taskIds
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

const ADD_TASK_RELATIONSHIP = gql`
    mutation AddTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        AddTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`

const REMOVE_TASK_RELATIONSHIP = gql`
    mutation RemoveTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        RemoveTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`

const ADD_TASK = gql`
    mutation addTask($taskContent: String!, $columnId: ID!){
        addTask(taskContent: $taskContent, columnId: $columnId){
            id
        }
    }
`

export {
  GET_TABLE,
  REMOVE_TASK_RELATIONSHIP,
  ADD_TASK_RELATIONSHIP,
  COL_UPDATE,
  ADD_TASK,
  GET_COLUMN
}