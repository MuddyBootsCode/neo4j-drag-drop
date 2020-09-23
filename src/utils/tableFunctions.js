const addTaskFunction = (column, tasks, newTaskId) => {
  const defaultTask = {
    id: newTaskId,
    content: `Task created for Column ${column.id}`,
  };

  const updatedTaskIds = [...column.taskIds, newTaskId];

  const updatedTasks = { ...tasks, [newTaskId]: defaultTask };

  const newColumn = {
    ...column,
    taskIds: updatedTaskIds,
  };

  return {
    tasks: updatedTasks,
    column: newColumn,
  };
};

export { addTaskFunction };
