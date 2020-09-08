import { selector, selectorFamily } from 'chromogen';
import {
  tableState
} from './atoms'

const tableColumns = selector({
  key: 'getTableColumns',
  get: ({get}) => {
    const table = get(tableState);
    return { columns } = tableColumns
  }
})