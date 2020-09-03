import { gql } from '@apollo/client';

export const GET_TABLE = gql`
    query GetTable($id: ID){
        Table(id: $id){
            id
            title
            columnOrder
            columns(orderBy: id_asc){
                id
                title
                tasks(orderBy: placeMarker_asc){
                    id
                    content
                    placeMarker
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
                placeMarker
            }
        }
    }
`

export const COL_UPDATE = gql`
    mutation UpdateColumn($id: ID!, $title: String){
        UpdateColumn(id: $id, title: $title){
            id
            title
            tasks{
                id
            }
        }
    }
`

export const TASK_UPDATE = gql`
    mutation UpdateTask($id: ID!, $content: String, $placeMarker: String){
        UpdateTask(id: $id, content: $content, placeMarker: $placeMarker){
            id
        }
    }
`

export const SWAP_TASK = gql`
    mutation swapTask($fromColumnId: ID!, $toColumnId: ID!, $taskId: ID!){
        swapTask(fromColumnId: $fromColumnId, toColumnId: $toColumnId, taskId: $taskId){
            id
            content
        }
    }
`