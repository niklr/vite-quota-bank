import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { useConnectedWeb3Context } from '../../hooks';
import { GlobalEvent } from '../../emitters';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ConfirmTransactionDialog() {
  const context = useConnectedWeb3Context()
  const emitter = context.provider.emitter

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const handleEvent = (open: boolean) => {
      setOpen(open)
    }
    emitter.on(GlobalEvent.ConfirmTransactionDialog, handleEvent)
    return () => {
      emitter.off(GlobalEvent.ConfirmTransactionDialog, handleEvent)
    };
  }, [emitter, setOpen])

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      style={{ zIndex: 9999 }}
    >
      <DialogTitle>ViteConnect</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please confirm transaction on VITE Wallet App
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
