import { gql } from '@apollo/client';

export const GET_TABLE = gql`
    query GetTable($id: ID){
        Table(id: $id){
            id
            title
            columnOrder
            columns{
                id
                title
                taskIds
                tasks(orderBy: id_asc){
                    id
                    content
                }
            }
        }
    }
`

export const CREATE_TASK = gql`
    mutation addTask($taskContent: String!, $columnId: ID!){
        addTask(taskContent: $taskContent, columnId: $columnId){
            id
            taskIds
            tasks{
                id
                content
            }
        }
    }
`

export const COL_UPDATE = gql`
    mutation UpdateColumn($id: ID!, $title: String, $taskIds: [ID]){
        UpdateColumn(id: $id, title: $title, taskIds: $taskIds){
            id
            taskIds
            tasks{
                id
            }
        }
    }
`

export const ADD_TASK = gql`
    mutation AddTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        AddTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`

export const REMOVE_TASK = gql`
    mutation RemoveTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        RemoveTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`