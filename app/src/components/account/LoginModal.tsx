import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Button, Fade, Modal, Typography } from '@material-ui/core';
import { QrCode } from '.';
import { AppConstants } from '../../constants';
import { useConnectedWeb3Context } from '../../hooks';

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
    textAlign: 'center'
  },
  codeContainer: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '10px'
  },
  warning: {
    color: '#611a15',
    backgroundColor: '#fdecea',
    padding: '15px',
    textAlign: 'center'
  }
}));

export const LoginModal = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const context = useConnectedWeb3Context();
  const { enqueueSnackbar } = useSnackbar();

  const { walletManager, provider } = context

  useEffect(() => {
    if (open) {
      if (AppConstants.DefaultMnemonic) {
        setMnemonic(AppConstants.DefaultMnemonic)
      }
      // TODO: init wallet connector to avoid stale URIs
      console.log('login modal opened')
    }
  }, [open])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    const wallet = walletManager.createWebWallet(mnemonic);
    if (!wallet) {
      enqueueSnackbar('Invalid mnemonic')
    }
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
            <div className={classes.codeContainer}>
              <Typography>Scan the QR code via Vite Wallet App</Typography>
              <QrCode text={provider.vite.connector?.uri}></QrCode>
            </div>
            <Button variant="contained" onClick={handleLogin}>Use test account</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
