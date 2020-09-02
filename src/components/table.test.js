import {changeTaskColumn, columnUpdate, reorderTasks} from "./Table";

const defaultData = {
  tasks: {
    'task-1': {id: 'task-1', content: 'Take out the garbage'},
    'task-2': {id: 'task-2', content: 'Watch my favorite show'},
    'task-3': {id: 'task-3', content: 'Charge my phone'},
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    }
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const defaultCols = [
  {
    id: 'column-1',
    title: 'To do',
    taskIds: ['task-1', 'task-2', 'task-3'],
  },
  {
    id: 'column-2',
    title: 'In Progress',
    taskIds: [],
  },
  {
    id: 'column-3',
    title: 'Done',
    taskIds: [],
  }
]

const newColumn = {
  id: 'column-1',
  title: 'To do',
  taskIds: ['task-2', 'task-1', 'task-3']
};

const newColumnOrder = [
  {
    id: 'column-2',
    title: 'In Progress',
    taskIds: [],
  },
  {
    id: 'column-3',
    title: 'Done',
    taskIds: [],
  }
]

const allTaskColumn = {
    __typename: "Column",
    id: "c1",
    taskIds: [
      "tk1", "tk2", "tk3",
    ],
    tasks: [
      {
        __typename: "Task",
        id: 'tk1',
        content: "Task 1"
      },
      {
        __typename: "Task",
        id: 'tk2',
        content: "Task 2"
      },
      {
        __typename: "Task",
        id: 'tk3',
        content: "Task 3"
      }
    ]
}

const taskRemovedColumn = {
  __typename: "Column",
  id: "c1",
  taskIds: [
    "tk2", "tk3"
  ],
  tasks: [
    {
      __typename: "Task",
      id: 'tk2',
      content: "Task 2"
    },
    {
      __typename: "Task",
      id: 'tk3',
      content: "Task 3"
    }
  ]
}

it('should reorder the tasks and return an updated column', () => {
  const colToUpdate = defaultData.columns['column-1']
  const updated = reorderTasks(colToUpdate, 0, 1, 'task-1')
  expect(updated).toEqual(newColumn)
})

it('Should filter out the column being changed', () => {
  const colsToUpdate = defaultCols;
  const updated = columnUpdate(colsToUpdate, 'column-1')
  expect(updated).toEqual(newColumnOrder)
})

it('Should correctly filter out moved tasks and return an updated column', () => {
  const updated = changeTaskColumn(allTaskColumn, 0)
  expect(updated).toEqual(taskRemovedColumn)
})


