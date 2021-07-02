import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';

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

interface Props {
  testFn?: () => void
}

export const RequestQuota: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    //setOpen(true);
    if (props.testFn) {
      props.testFn();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField className={classes.messageInput} size="small" label="Request message" variant="outlined" />
        <Button variant="contained" color="primary" onClick={handleClickOpen}>Request Quota</Button>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Confirm quota request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will receive quota as soon as the Vite Quota Bank accepts the request.
            Please note that this is a manual operation, hence some delays could be associated.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleClose} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
