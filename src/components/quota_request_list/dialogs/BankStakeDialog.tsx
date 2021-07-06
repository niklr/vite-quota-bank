import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, makeStyles, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { QuotaRequest } from '../../../types';
import { IBankService } from '../../../services';
import { formatUtil } from '../../../util/formatUtil';
import { ClickOnceButton } from '../../common';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%'
  },
  durationInput: {
    float: 'right'
  }
}));

interface Props {
  open: boolean
  item: QuotaRequest
  bank: IBankService
  closeFn: () => void
}

export const BankStakeDialog: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  const handleStakeAsync = async () => {
    try {
      if (props.item.address) {
        await props.bank.stakeRequest(props.item.address, Number.parseInt(amount), Number.parseInt(duration))
        props.closeFn()
      } else {
        throw new Error('No address provided.')
      }
    } catch (error) {
      enqueueSnackbar(formatUtil.formatSnackbarMessage(error))
    }
  }

  // const handleInput = (value: string, callbackFn: React.Dispatch<React.SetStateAction<number>>) => {
  //   if (Number.isInteger(value)) {
  //     callbackFn(Number.parseInt(value))
  //   }
  // }

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.closeFn}
      >
        <DialogTitle>Confirm quota staking</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary="Address" secondary={props.item.address} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Note" secondary={props.item.note} />
            </ListItem>
          </List>
          <form className={classes.form} autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
              value={amount}
              inputProps={{ min: 1 }}
              onChange={e => setAmount(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Duration (blocks)"
              type="number"
              className={classes.durationInput}
              value={duration}
              inputProps={{ min: 1 }}
              onChange={e => setDuration(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={props.closeFn}>
            Cancel
          </Button>
          <ClickOnceButton color="primary" callbackFn={handleStakeAsync} autoFocus={true}>
            Confirm
          </ClickOnceButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
