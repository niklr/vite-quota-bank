import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core';

interface Props {
  open: boolean
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
              <ListItemText primary="Address" secondary="vite_740f288042edc22df23f8511f83f58be4cf05597b17e800bf7" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Message" secondary="GitHub: niklr" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Amount" secondary="1000" />
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
