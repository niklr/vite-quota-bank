import React from 'react';
import { Button, Chip, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import { truncateStringInTheMiddle } from '../../util/tools';

enum DialogType {
  Stake = 'STAKE',
  Withdraw = 'WITHDRAW',
  Delete = 'DELETE',
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  title: {
    fontWeight: 500,
    marginBottom: 20
  },
  stakeButton: {
    marginRight: 20
  }
}));

export const BankQuotaRequestTable = () => {
  const classes = useStyles();
  const [stakeDialogOpen, setStakeDialogOpen] = React.useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleClickOpen = (type: DialogType) => {
    switch (type) {
      case DialogType.Stake:
        setStakeDialogOpen(true);
        break;
      case DialogType.Withdraw:
        setWithdrawDialogOpen(true);
        break;
      case DialogType.Delete:
        setDeleteDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    setStakeDialogOpen(false);
    setWithdrawDialogOpen(true);
    setDeleteDialogOpen(true);
  };

  const truncateAddress = (address?: string) => {
    return truncateStringInTheMiddle(address, 10, 5)
  }

  const address = 'vite_740f288042edc22df23f8511f83f58be4cf05597b17e800bf7'

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>Bank Quota Requests</Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Address
                </TableCell>
                <TableCell>
                  Message
                </TableCell>
                <TableCell>
                  Amount
                </TableCell>
                <TableCell>
                  Expected Snapshot Height
                </TableCell>
                <TableCell>
                  Expected Due Date
                </TableCell>
                <TableCell align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Tooltip title={address ?? ""} placement="top" arrow interactive>
                    <Chip size="small" label={truncateAddress(address)} />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  -
                </TableCell>
                <TableCell>
                  -
                </TableCell>
                <TableCell>
                  1350996
                </TableCell>
                <TableCell>
                  Jul-05-2021 09:01:50 AM
                </TableCell>
                <TableCell align="right">
                  <Button size="small" variant="contained" color="primary" className={classes.stakeButton}>
                    Stake
                  </Button>
                  <IconButton aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Tooltip title={address ?? ""} placement="top" arrow interactive>
                    <Chip size="small" label={truncateAddress(address)} />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  Twitter: 0xRomanNiklaus
                </TableCell>
                <TableCell>
                  -
                </TableCell>
                <TableCell>
                  1350996
                </TableCell>
                <TableCell>
                  Request has expired!
                </TableCell>
                <TableCell align="right">
                  <IconButton aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Tooltip title={address ?? ""} placement="top" arrow interactive>
                    <Chip size="small" label={truncateAddress(address)} />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  GitHub: niklr
                </TableCell>
                <TableCell>
                  1000
                </TableCell>
                <TableCell>
                  1350996
                </TableCell>
                <TableCell>
                  Jul-05-2021 09:01:50 AM
                </TableCell>
                <TableCell align="right">
                  <Chip size="small" label="Active" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Tooltip title={address ?? ""} placement="top" arrow interactive>
                    <Chip size="small" label={truncateAddress(address)} />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  -
                </TableCell>
                <TableCell>
                  1000
                </TableCell>
                <TableCell>
                  1350996
                </TableCell>
                <TableCell>
                  Staking expired!
                </TableCell>
                <TableCell align="right">
                  <Button size="small" variant="outlined">Withdraw</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
