import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { QuotaRequest } from '../../../types';
import { IBankService } from '../../../services';
import { formatUtil } from '../../../util/formatUtil';
import { ClickOnceButton } from '../../common';

interface Props {
  open: boolean
  item: QuotaRequest
  bank: IBankService
  closeFn: () => void
}

export const BankWithdrawDialog: React.FC<Props> = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleWithdrawAsync = async () => {
    try {
      if (props.item.address) {
        await props.bank.withdrawRequest(props.item.address)
        props.closeFn()
      } else {
        throw new Error('No address provided.')
      }
    } catch (error) {
      enqueueSnackbar(formatUtil.formatSnackbarMessage(error))
    }
  }

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.closeFn}
      >
        <DialogTitle>Confirm withdraw</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary="Address" secondary={props.item.address} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Note" secondary={props.item.note} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Amount" secondary={props.item.amountFormatted} />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={props.closeFn}>
            Cancel
          </Button>
          <ClickOnceButton color="primary" callbackFn={handleWithdrawAsync} autoFocus={true}>
            Confirm
          </ClickOnceButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
