import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Table from '../components/Table';
import '@testing-library/jest-dom';
import { gql } from '@apollo/client';
import short from 'short-uuid';
import { addTaskFunction } from '../utils/tableFunctions';

afterEach(cleanup);

const GET_TABLE = gql`
  query GetTable($id: ID) {
    Table(id: $id) {
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

const mocks = [
  {
    request: {
      query: GET_TABLE,
      variables: {
        title: 't1',
      },
    },
    result: {
      data: {
        Table: [
          {
            id: 't1',
            title: 'Test Table',
            columns: [
              {
                id: 'c1',
                title: 'New Test Column',
                taskIds: ['tk1', 'tk2', 'tk3'],
                tasks: [
                  {
                    id: 'tk1',
                    content: 'Task 1',
                  },
                  {
                    id: 'tk2',
                    content: 'Task 2',
                  },
                  {
                    id: 'tk3',
                    content: 'Task 3',
                  },
                ],
              },
              {
                id: 'c2',
                title: 'New Test Column 2',
                taskIds: [],
                tasks: [],
              },
              {
                id: 'c3',
                title: 'New Test Column 3',
                taskIds: [],
                tasks: [],
              },
            ],
          },
        ],
      },
    },
  },
];

// describe('Table tests', () => {
//   it('Should render the table without errors', async () => {
//     render(
//       <MockedProvider mocks={mocks}>
//         <Table />
//       </MockedProvider>
//     );
//   });
// });

it('should correctly add a task to columns', () => {
  const taskId = short.generate();

  const column = {
    id: 'c1',
    title: 'New Test Column',
    taskIds: ['tk1', 'tk2', 'tk3'],
  };

  const updatedColumn = {
    id: 'c1',
    title: 'New Test Column',
    taskIds: ['tk1', 'tk2', 'tk3', taskId],
  };

  const tasks = {
    tk1: {
      id: 'tk1',
      content: 'Task 1',
    },
  };

  const updatedTasks = {
    tk1: {
      id: 'tk1',
      content: 'Task 1',
    },
    [taskId]: {
      id: taskId,
      content: 'Task created for Column c1',
    },
  };

  const newState = addTaskFunction(column, tasks, taskId);
  expect(newState.column).toMatchObject(updatedColumn);
  expect(newState.tasks).toEqual(updatedTasks);
});
