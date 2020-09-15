import {gql} from '@apollo/client';

export const GET_TABLE = gql`
    query GetTable($id: ID){
        Table(id: $id){
            id
            title
            columnOrder
            columns(orderBy: id_asc){
                id
                title
                tasks(orderBy: id_asc){
                    id
                    content
                }
            }
        }
    }
`

export const columnTasksFragment = gql`
    fragment columnTasksFragment on Column {
        tasks {
            id
            content
        }
    }
`

export const GET_TASK = gql`
    query GetTask($id: ID){
        Task(id: $id){
            id,
            content
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
    mutation UpdateColumn($id: ID!, $title: String){
        UpdateColumn(id: $id, title: $title){
            id
            title
            tasks{
                id
                content
            }
        }
    }
`

export const TASK_UPDATE = gql`
    mutation UpdateTask($id: ID!, $content: String){
        UpdateTask(id: $id, content: $content){
            id
        }
    }
`

export const TASK_ORDER = gql`
    mutation updateTaskOrder($oldId: ID!, $newId: ID!){
        updateTaskOrder(oldId: $oldId, newId: $newId){
            id
            content
        }
    }
`

export const SWAP_TASK = gql`
    mutation swapTask($fromColumnId: ID!, $toColumnId: ID!, $taskId: ID!, $updatedId: ID!){
        swapTask(fromColumnId: $fromColumnId, toColumnId: $toColumnId, taskId: $taskId, updatedId: $updatedId){
            id
            tasks{
                id
            }
        }
    }
`