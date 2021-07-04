import React from 'react';
import { IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import { BankDeleteDialog, BankStakeDialog, BankWithdrawDialog, DialogType } from './dialogs';
import { useConnectedWeb3Context, useQuotaRequests } from '../../hooks';
import { QuotaRequest } from '../../types';
import { BankQuotaRequest } from '.';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  title: {
    fontWeight: 500,
    marginBottom: 20
  },
  refreshButton: {
    float: 'right'
  },
  stakeButton: {
    marginRight: 20
  }
}));

export const BankQuotaRequestTable = () => {
  const classes = useStyles();
  const context = useConnectedWeb3Context()

  const { isLoading: isQuotaRequestsLoading, quotaRequests, fetchQuotaRequests } = useQuotaRequests(context)

  const [selectedItem, setSelectedItem] = React.useState(new QuotaRequest())
  const [stakeDialogOpen, setStakeDialogOpen] = React.useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  console.log('render BankQuotaRequestTable', context.provider.networkStore.blockHeight)

  const refreshQuotaRequests = () => {
    fetchQuotaRequests(true)
  }

  const handleClickOpen = (type: DialogType, item: QuotaRequest) => {
    setSelectedItem(item)
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
    setWithdrawDialogOpen(false);
    setDeleteDialogOpen(false);
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>
        Bank Quota Requests
        <IconButton className={classes.refreshButton} aria-label="refresh" onClick={refreshQuotaRequests}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Typography>
      {isQuotaRequestsLoading ? (
        <Typography variant="caption">Loading...</Typography>
      ) : (
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
                {quotaRequests
                  && quotaRequests.length > 0
                  && quotaRequests.map(item => {
                    return <BankQuotaRequest key={item.address} context={context} item={item} handleClickOpenFn={handleClickOpen}></BankQuotaRequest>
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <BankDeleteDialog item={selectedItem} open={deleteDialogOpen} closeFn={handleClose}></BankDeleteDialog>
      <BankStakeDialog item={selectedItem} open={stakeDialogOpen} closeFn={handleClose}></BankStakeDialog>
      <BankWithdrawDialog item={selectedItem} open={withdrawDialogOpen} closeFn={handleClose}></BankWithdrawDialog>
    </div>
  );
}
