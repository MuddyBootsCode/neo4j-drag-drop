import { gql } from '@apollo/client';

const GET_TABLE = gql`
  query GetTables($title: String) {
    Table(title: $title) {
      id
      title
      columns(orderBy: id_asc) {
        id
        title
        taskIds
        tasks {
          id
          content
        }
      }
    }
  }
`;

const COL_UPDATE = gql`
  mutation UpdateColumn($id: ID!, $title: String, $taskIds: [ID]) {
    UpdateColumn(id: $id, title: $title, taskIds: $taskIds) {
      id
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTaskColumn($from: _TaskInput!, $to: _ColumnInput!) {
    AddTaskColumn(from: $from, to: $to) {
      to {
        id
      }
    }
  }
`;

const REMOVE_TASK = gql`
  mutation RemoveTaskColumn($from: _TaskInput!, $to: _ColumnInput!) {
    RemoveTaskColumn(from: $from, to: $to) {
      to {
        id
      }
    }
  }
`;

const CREATE_TASK = gql`
  mutation addTask($taskContent: String!, $columnId: ID!) {
    addTask(taskContent: $taskContent, columnId: $columnId) {
      id
      content
      column {
        id
      }
    }
  }
`;

export { GET_TABLE, ADD_TASK, REMOVE_TASK, COL_UPDATE, CREATE_TASK };
