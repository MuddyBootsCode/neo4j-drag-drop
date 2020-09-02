import { columnUpdate } from "./Table";

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

const newColumn = {
  id: 'column-1',
  title: 'To do',
  taskIds: ['task-2', 'task-1', 'task-3']
};

it('should return an updated column', () => {
  const colToUpdate = defaultData.columns['column-1']
  const updated = columnUpdate(colToUpdate, 0, 1, 'task-1')
  expect(updated).toEqual(newColumn)
})

