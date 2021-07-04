import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import { useConnectedWeb3Context } from '../../hooks';
import { ClickOnceButton } from '../common';
import { formatUtil } from '../../util/formatUtil';

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

export const CreateQuotaRequest: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [requestMessage, setRequestMessage] = useState<string>('');
  const { provider } = useConnectedWeb3Context();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleConfirmAsync = async () => {
    try {
      await provider.bank.createRequest(requestMessage)
    } catch (error) {
      enqueueSnackbar(formatUtil.formatSnackbarMessage(error))
    }
    setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          className={classes.messageInput}
          size="small"
          label="Request message"
          variant="outlined"
          value={requestMessage}
          onChange={e => setRequestMessage(e.target.value)} />
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
          <ClickOnceButton color="primary" callbackFn={handleConfirmAsync}>
            Confirm
          </ClickOnceButton>
        </DialogActions>
      </Dialog>
    </>
  );
}