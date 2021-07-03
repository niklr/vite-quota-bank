import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core';
import { QuotaRequest } from '../../../types';

interface Props {
  open: boolean
  item: QuotaRequest
  closeFn: () => void
}

export const BankWithdrawDialog: React.FC<Props> = (props: Props) => {

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
              <ListItemText primary="Message" secondary={props.item.message} />
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
          <Button variant="contained" color="primary" onClick={props.closeFn} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
