import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { QuotaRequest } from '../../../types';
import { IBankService } from '../../../services';
import { ClickOnceButton } from '../../common';
import { formatUtil } from '../../../util/formatUtil';

interface Props {
  open: boolean
  item: QuotaRequest
  bank: IBankService
  closeFn: () => void
}

export const BankDeleteDialog: React.FC<Props> = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteAsync = async () => {
    try {
      if (props.item.address) {
        await props.bank.deleteRequest(props.item.address)
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
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary="Address" secondary={props.item.address} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Note" secondary={props.item.note} />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={props.closeFn}>
            Cancel
          </Button>
          <ClickOnceButton color="secondary" callbackFn={handleDeleteAsync} autoFocus={true}>
            Delete
          </ClickOnceButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
