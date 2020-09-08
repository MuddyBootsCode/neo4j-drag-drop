import React, {useEffect, useState} from 'react';
import { Container } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import initialEmptyData from "../initialData";
import Column from "../components/Column";
import {DragDropContext} from "react-beautiful-dnd";
import Paper from "@material-ui/core/Paper";
import {useMutation, useQuery} from "@apollo/client";
import {SWAP_TASK, GET_TABLE, TASK_UPDATE} from "../queries/taskTableQueries";
import {useRecoilState, useSetRecoilState} from "recoil";
import {tableState} from "../store/atoms";

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      height: '100vh'
    },
    paper: {
      margin: '1em',
      display: 'flex'
    }
}));


const Table = () => {
  const classes = useStyles();
  const { data, error, loading} = useQuery(GET_TABLE);
  const [columns, setColumns] = useRecoilState(tableState)

  useEffect(() => {

    if (data) {
      console.log(data)
      const { Table } = data;
      setColumns(Table[0].columns.map(col => col.id))
    }
  }, [data])

  if (loading) {
    return <div>...Loading</div>
  }

  if (error) {
    console.warn(error)
  }

  return (
    <Container className={classes.root}>
      <DragDropContext
        // onDragEnd={onDragEnd}
      >
        <Paper className={classes.paper}>
          stuff
          {
            columns && columns.map((Id) => {
              return <Column key={Id} columnId={Id}/>
            })
          }
        </Paper>
      </DragDropContext>
    </Container>
  );
};

export default Table;