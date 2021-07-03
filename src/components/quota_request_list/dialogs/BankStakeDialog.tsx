import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, makeStyles, TextField } from '@material-ui/core';

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
  closeFn: () => void
}

export const BankStakeDialog: React.FC<Props> = (props: Props) => {
  const classes = useStyles();

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
              <ListItemText primary="Address" secondary="vite_740f288042edc22df23f8511f83f58be4cf05597b17e800bf7" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Message" secondary="GitHub: niklr" />
            </ListItem>
          </List>
          <form className={classes.form} autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
            />
            <TextField
              margin="dense"
              label="Duration (blocks)"
              type="number"
              className={classes.durationInput}
            />
          </form>
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
