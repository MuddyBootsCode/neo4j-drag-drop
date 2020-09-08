import { atom } from 'chromogen';

const tableState = atom({
  key: 'table',
  default: []
})

const columnWithId = ({column}) => {
  const { id, title, tasks } = column;
  return (
    atom({
      key: column.id,
      default: {
        id,
        title,
        tasks
      }
    })
  )
};

export {
  tableState,
  columnWithId
}