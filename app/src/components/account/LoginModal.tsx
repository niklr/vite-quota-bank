import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Button, Fade, Modal, Paper, TextField, Typography } from '@material-ui/core';
import { AppConstants } from '../../constants';
import { useWeb3Context } from '../../hooks';

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
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const context = useWeb3Context()
  const { enqueueSnackbar } = useSnackbar();

  const { walletManager } = context

  useEffect(() => {
    if (open) {
      if (AppConstants.DefaultMnemonic) {
        setMnemonic(AppConstants.DefaultMnemonic)
        setIsDisabled(true)
      }
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

  const handleInput = (e: any) => {
    const newMnemonic = e.target.value
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
            <Paper hidden={!isDisabled}>
              <div className={classes.warning}>
                <Typography>This login is for showcasing the <strong>proof-of-concept</strong> on TESTNET only.</Typography>
                <Typography>Entering your own mnemonic is not supported or recommended!</Typography>
              </div>
            </Paper>
            <TextField
              id="outlined-full-width"
              label="Default mnemonic"
              placeholder="..."
              fullWidth
              margin="normal"
              variant="outlined"
              value={mnemonic}
              onChange={handleInput}
              disabled={isDisabled}
            />
            <Button onClick={handleLogin}>Login</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
