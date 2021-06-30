import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, TextField } from '@material-ui/core';
import { useWeb3Context } from '../../hooks';
import { WalletConstants } from '../../wallet/constants';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { WalletManager } from '../../wallet';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export const LoginModal = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const context = useWeb3Context()
  const { enqueueSnackbar } = useSnackbar();

  const { setWallet } = context

  const walletManager = new WalletManager();

  useEffect(() => {
    if (open) {
      console.log('login modal opened')
      setMnemonic(WalletConstants.DefaultMnemonic)
    }
  }, [open])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    if (walletManager.validateMnemonic(mnemonic)) {
      const wallet = walletManager.createWallet(mnemonic)
      setWallet(wallet)
    } else {
      enqueueSnackbar('Invalid mnemonic')
    }
  }

  const handleInput = (e: any) => {
    const newMnemonic = e.target.value
    console.log(newMnemonic)
    setMnemonic(newMnemonic)
  }

  return (
    <div>
      <Button color="inherit" onClick={handleOpen}>Login</Button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <TextField
              id="outlined-full-width"
              label="Enter your mnemonic"
              placeholder="..."
              fullWidth
              margin="normal"
              variant="outlined"
              value={mnemonic}
              onChange={handleInput}
            />
            <Button onClick={handleLogin}>Login</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
