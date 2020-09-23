export const mockTable = {
  __typename: 'Table',
  id: 't1',
  title: 'Test Table',
  columns: [
    {
      __typename: 'Column',
      id: 'c1',
      title: 'New Test Column',
      taskIds: ['tk1', 'tk2', 'tk3'],
      tasks: [
        {
          __typename: 'Task',
          id: 'tk3',
          content: 'Task 3',
        },
        {
          __typename: 'Task',
          id: 'tk1',
          content: 'Task 1',
        },
        {
          __typename: 'Task',
          id: 'tk2',
          content: 'Task 2',
        },
      ],
    },
    {
      __typename: 'Column',
      id: 'c2',
      title: 'New Test Column 2',
      taskIds: [],
      tasks: [],
    },
    {
      __typename: 'Column',
      id: 'c3',
      title: 'New Test Column 3',
      taskIds: [],
      tasks: [],
    },
  ],
};

export const otherMock = [
  {
    __typename: 'Table',
    id: 't1',
    title: 'Test Table',
    columns: [
      {
        __typename: 'Column',
        id: 'c1',
        title: 'New Test Column',
        taskIds: ['tk1', 'tk2', 'tk3'],
        tasks: [
          {
            __typename: 'Task',
            id: 'tk3',
            content: 'Task 3',
          },
          {
            __typename: 'Task',
            id: 'tk1',
            content: 'Task 1',
          },
          {
            __typename: 'Task',
            id: 'tk2',
            content: 'Task 2',
          },
        ],
      },
      {
        __typename: 'Column',
        id: 'c2',
        title: 'New Test Column 2',
        taskIds: [],
        tasks: [],
      },
      {
        __typename: 'Column',
        id: 'c3',
        title: 'New Test Column 3',
        taskIds: [],
        tasks: [],
      },
    ],
  },
];

export const mockState = {
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
};
