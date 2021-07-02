import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%'
  },
  messageInput: {
    flexGrow: 1,
    marginRight: 20
  }
}));

export const RequestQuota = () => {
  const classes = useStyles();

  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField className={classes.messageInput} size="small" label="Request message" variant="outlined" />
        <Button variant="contained" color="primary">Request Quota</Button>
      </form>
    </>
  );
}
