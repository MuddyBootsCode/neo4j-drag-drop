---
title: Drag and Drop with the GRANDstack
published: true
description: Adding drag and drop functionality to a GRANDstack application
tags: [React, Neo4j, Apollo, GraphQL]
cover_image: https://dev-to-uploads.s3.amazonaws.com/i/r3fv16xadm8glgvwdvsg.png
---
*This tutorial assumes you have basic familiarity with React, Apollo, and Neo4j*

While planning my most recent side project, I decided to play with a feature that I've always wanted to mess with on the front end, drag and drop functionality. It didn't take long to find out that there are a number of highly regarded drag and drop libraries for React but, after reading docs and reviews I decided that [React-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) was going to fit my use case. In addition it came boxed up with a very nice free tutorial course which you can find [here](https://egghead.io/courses/beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd). None of the code pertaining to the drag and drop functionality is mine, I adapted it from the tutorial, my only contribution being that I created it with hooks vs. class components. *You'll need to complete their tutorial before you start this one*

**Lets get started!**

After you've completed the drag and drop tutorial from Egghead, to start here all you need to do is pick up the starter [GRANDstack](https://grandstack.io) project, clone it and get it spun up in your preferred IDE. After you've got the project up and running we'll need to add these types to your schema.graphl file:
``` JSON
type Task {
 id: ID!
 content: String!
 column: Column @relation(name: "BELONGS_TO", direction: "OUT")
}
type Column {
 id: ID!
 title: String!
 tasks: [Task] @relation(name: "BELONGS_TO", direction: "IN")
 table: Table @relation(name: "BELONGS_TO", direction: "OUT")
 taskIds: [ID]
}
type Table {
 id: ID!
 title: String!
 columns: [Column] @relation(name: "BELONGS_TO", direction: "IN")
 columnOrder: [ID]
}
```

When our data is added our graph will look something like this.

![Data Graph](https://dev-to-uploads.s3.amazonaws.com/i/ss7hed1p9wl881bnoquz.png)

Lets go ahead and add data to our graph, open the Neo4j desktop, copy and paste this Cypher code:

``` Cypher
CREATE(t1:Table {id: "t1", title: "Test Table", columnOrder: []}),
(c1:Column {id: "c1", title: "New Test Column", taskIds: []}),
(c2:Column {id: "c2", title: "New Test Column 2", taskIds: []}),
(c3:Column {id: "c3", title: "New Test Column 3", taskIds: []}),
(tk1:Task {id: "tk1", content: "Task 1"}),
(tk2:Task {id: "tk2", content: "Task 2"}),
(tk3:Task {id: "tk3", content: "Task 3"})
with t1, c1, c2, c3, tk1, tk2, tk3
CREATE (t1)<-[:BELONGS_TO]-(c1)
CREATE (t1)<-[:BELONGS_TO]-(c2)
CREATE (t1)<-[:BELONGS_TO]-(c3)
CREATE (c1)<-[:BELONGS_TO]-(tk1)
CREATE (c1)<-[:BELONGS_TO]-(tk2)
CREATE (c1)<-[:BELONGS_TO]-(tk3)
```

This will create the graph structure we're after. Next, run these two cypher commands:
``` Cypher
match(t:Table)
match(c:Column)
with t, collect(c.id) as ids
set t.columnOrder = ids
```
and
``` Cpyher
match(c:Column {id: "c1"})
match(t:Task)
with c, collect(t.id) as ids
set c.taskIds = ids
```

This sets up the initial ids and ensure that our columns start out correctly. With that done we'll be able to get started.

[Here's](https://github.com/MuddyBootsCode/neo4j-drag-drop) a link to GitHub repository for the completed project. You'll be picking up at the point where you've got multiple columns and are able to swap the order of tasks and also swap them between columns. Up until this point, there's been no back end for the project so any changes that you've made will be undone when you refresh the browser or navigate away. Additionally, we're getting our application state from an object that's been created vs. calling API and that's what we'll add and fix next.

If you haven't cloned the repo and have instead been following along with the [Egghead.io](https://egghead.io/courses/beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd) tutorial adding Apollo to our project is going to be easy. Simply install it with yarn or npm whichever your preferred method for me, it's yarn:
```
yarn add @apollo/client
```
In previous versions of Apollo you'd need to install quite a few other packages but in V3 they all come bundled together. After we've installed Apollo we need to create a new client in the root of our application:
``` JavaScript
index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@atlaskit/css-reset';
import App from './App';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
const client = new ApolloClient({
 uri: process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:4001/graphql',
 cache: new InMemoryCache(),
})
ReactDOM.render(
 <React.StrictMode>
 <ApolloProvider client={client}>
 <App />
 </ApolloProvider>
 </React.StrictMode>,
 document.getElementById('root')
);
```

And that's all we need to get up and running with Apollo Client, make sure you've changed the appropriate environment variables or pointed the client at the correct locally running GraphQL API. With that done we're able to go ahead and start querying our Neo4j instance and making the application update and maintain our data in real time. In our App.js file we're going to add a GraphQL query and some mutations that will allow us to capture our application's state. First we'll need to import our needed tools from @apollo/client:
``` JavaScript
import { gql, useMutation, useQuery } from "@apollo/client";
```
Then we can create our query, for brevity I'm including this in the App.js file but as the size of your application grows you might consider breaking queries and mutations out into their own files. First, we'll want to get our table or page and it's associated columns and tasks from our Neo4j instance.
In this case, I'm calling the table by name:
``` gql
const GET_TABLE = gql`
    query GetTables($title: String){
        Table(title: $title){
            id
            title
            columnOrder
            columns{
                id
                title
                taskIds
                tasks{
                    id
                    content
                }
            }
        }
    }
`
```
This query allows us to get the specific table we're after. It pulls the columns out and tasks along with it. In order to use the query we need to add it to our component:
```
const {loading, error, data} = useQuery(GET_TABLE, {variables: 'Test Table'});
```
This allows us to add directly query our Neo4j instance and get that data we need but first we'll need to make some changes to the application as a whole and manipulate the data returned to fit our current structure.

*Data Object From Egghead tutorial*
At the current state of the application you should be using this initialData object to set your state. However now that we're going to be pulling data in via our API well need to change it from this:
``` JSON
const initialData = {
  tasks: {
    'task-1': {id: 'task-1', content: 'Take out the garbage'},
    'task-2': {id: 'task-2', content: 'Watch my favorite show'},
    'task-3': {id: 'task-3', content: 'Charge my phone'},
    'task-4': {id: 'task-4', content: 'Cook dinner'},
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
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
```
to this:
``` JSON
const initialData = {
  tasks: {

  },
  columns: {

  },
  columnOrder: []
}
```

This gives us the structure of the data we expect before the application is actually able to load it, keeping us from getting rendering and null errors. To ensure that we're getting our data correctly from the API and not encountering async errors we're going to add useEffect and make use of Apollo's loading, and error states.
``` JavaScript
useEffect(() => {

  if (data) {
    setTable(data)
  }
}, [data])

if (loading) {
  return <div>...Loading</div>
}

if (error) {
  console.warn(error)
}
```
These actions take place before the component has rendered allowing data to be fetched and more importantly for our fetched data to be reshaped into the form our application is expecting. We do this in our setTable function, which is called in useEffect once it's verified that we have data.
``` JavaScript
const setTable = (data) => {
  const {Table} = data;
  const tasks = {};
  const columns = {};
  const columnOrder = Table[0].columnOrder;
  // Pull all tasks out into their own object
  Table[0].columns.forEach((col) => {
    col.tasks.forEach((task) => {
      tasks[task.id] = {id: task.id, content: task.content}
    })
  });
  // Pull out all columns and their associated task ids
  Table[0].columns.forEach((col) => {
    columns[col.id] = {id: col.id, title: col.title, taskIds: col.taskIds}
  })

  const table = {
    tasks,
    columns,
    columnOrder
  }

  setState(table)
}
```
This step is important because our data returned from our GraphQL API is in the shape we requested in it from out GET_TABLE query, and needs to be reshaped in order to properly fit our application. As it is, this gives us a basic frame work to start saving the state changes of our data in our data base.

**Saving Column Order**
The first thing we're going to add to the application is the ability for the application to save changes in the order of tasks on a particular column. To do this, we'll add a mutation to update the state of the column, this Mutation is automatically created for us by the GRANDstack's augmented schema functionality. In application we need to send the mutation with all of the info that the column has and in this case we're interested in returning the column ID.
``` gql
const COL_UPDATE = gql`
    mutation UpdateColumn($id: ID!, $title: String, $taskIds: [ID]){
        UpdateColumn(id: $id, title: $title, taskIds: $taskIds){
            id
        }
    }
`
```
We'll then add the useMutation hook to our application:
```
const [colUpdate] = useMutation(COL_UPDATE)
```
I've omitted the optional error and data properties and I'll be handling this in a very simple way in our onDragEnd function. Where there's a column update we'll add the update function, pardon the wall of text that follows:
``` JavaScript
const onDragEnd = (result) => {
  const {destination, source, draggableId} = result;

  if (!destination) {
    return;
  }

  if (
    destination.droppableId === source &&
    destination.index === source.index
  ) {
    return;
  }

  const start = state.columns[source.droppableId];
  const finish = state.columns[destination.droppableId]
  if (start === finish) {
    const newTaskIds = [...start.taskIds]
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...start,
      taskIds: newTaskIds
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn
      }
    };

    setState(newState);
    colUpdate({
      variables: {
        ...newColumn
      }
    })
      .catch(error => console.log(error))
    return;
  }
```
You'll see that after the new column state is updated, we do the same with our UpdateColumn Mutation changing the order of the taskIds array and preserving the order of the tasks. At this point, our application will be saving the order of the tasks no matter what column they're moved to but it will also be duplicating tasks because we're not removing them from their old columns. Also because this data is stored in a GraphDB we've got swap the relationships as well. Meaning that when the task moves from one column we have to sever the relationship with that column and create a new [:BELONGS_TO] relationship with the new column. We accomplish this with another set of auto-generated mutations:
``` gql
const REMOVE_TASK = gql`
    mutation RemoveTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        RemoveTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`

const ADD_TASK = gql`
    mutation AddTaskColumn($from: _TaskInput!, $to: _ColumnInput!){
        AddTaskColumn(from: $from, to: $to){
            to {
                id
            }
        }
    }
`
```
These mutations allow us to remove the relationship between a task and a column and then also create a new relationship between the same task and a new column. We bring these useMutation hooks in as:
```
const [addTask] = useMutation(ADD_TASK);
const [removeTask] = useMutation(REMOVE_TASK);
```
and add them into our onDragEnd function along with our UpdateColumn mutation to capture all the changes occurring when we swap a task between columns.
``` JavaScript
colUpdate({
  variables: {
    ...newStart
  }
})
  .then((data) => {
    const {data: {UpdateColumn: {id}}} = data;
    removeTask({
      variables: {
        from: {id: taskId},
        to: {id}
      }
    })
      .catch(error => console.log(error))
  })
  .catch(error => console.log(error))

colUpdate({
  variables: {
    ...newFinish
  }
})
  .then((data) => {
    const {data: {UpdateColumn: {id}}} = data;
    addTask({
      variables: {
        from: {id: taskId},
        to: {id}
      }
    })
      .catch(error => console.log(error))
  })
  .catch(error => console.log(error))
```
The promise chaining is a little ugly but it works and now our tasks properly change relationships when moved. In our original graph we had:

![Original Graph](https://dev-to-uploads.s3.amazonaws.com/i/qjkyvcebhoovx309y8ix.png)

And now we're able to see our changes if you move "Task 1" to "Test Column 2" you'll get this result from your graph:

![Updated Graph](https://dev-to-uploads.s3.amazonaws.com/i/y8eryrysruqran94ep6q.png)

And finally move "Task 3" to "Test Column 3" and you'll end up with:

![Last Graph](https://dev-to-uploads.s3.amazonaws.com/i/236f5yrd9fp4philoc0n.png)

And now we've got drag and drop functionality enabled in our GRANDstack application. You can see that it's a little more complicated than it might be with a SQL data base because you have to work about the relationships but luckily the auto-generated mutations and Apollo make it super easy to work with. So go forth and drag and drop all the things!
