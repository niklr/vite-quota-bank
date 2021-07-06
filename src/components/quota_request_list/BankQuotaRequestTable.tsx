import React, { useEffect } from 'react';
import { IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import { BankQuotaRequest } from '.';
import { BankDeleteDialog, BankStakeDialog, BankWithdrawDialog, DialogType } from './dialogs';
import { GlobalEvent } from '../../emitters';
import { useConnectedWeb3Context, useQuotaRequests } from '../../hooks';
import { QuotaRequest } from '../../types';

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
  const emitter = context.provider.emitter

  const { isLoading: isQuotaRequestsLoading, quotaRequests, fetchQuotaRequests, setQuotaRequests } = useQuotaRequests(context)

  const [selectedItem, setSelectedItem] = React.useState(new QuotaRequest())
  const [stakeDialogOpen, setStakeDialogOpen] = React.useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  console.log('render BankQuotaRequestTable', context.provider.networkStore.blockHeight)

  useEffect(() => {
    const handleUpdate = (update: QuotaRequest) => {
      console.log('Handle QuotaRequestUpdated', update.address)
      const index = quotaRequests.findIndex(e => e.address === update.address)
      if (index >= 0) {
        // Replace existing request with update
        const updatedQuotaRequests = [...quotaRequests]
        updatedQuotaRequests[index] = update
        setQuotaRequests(updatedQuotaRequests)
      } else {
        // Prepend update to existing requests
        const newQuotaRequests = [update, ...quotaRequests]
        setQuotaRequests(newQuotaRequests)
      }
    }
    const handleDelete = (address: string) => {
      console.log('Handle QuotaRequestDeleted', address)
      const newQuotaRequests = quotaRequests.filter(e => e.address !== address)
      if (newQuotaRequests.length < quotaRequests.length) {
        setQuotaRequests(newQuotaRequests)
      }
    }
    emitter.on(GlobalEvent.QuotaRequestUpdated, handleUpdate)
    emitter.on(GlobalEvent.QuotaRequestDeleted, handleDelete)
    return () => {
      console.log('AccountQuotaRequestTable disposed')
      emitter.off(GlobalEvent.QuotaRequestUpdated, handleUpdate)
      emitter.off(GlobalEvent.QuotaRequestDeleted, handleDelete)
    };
  }, [emitter, quotaRequests, setQuotaRequests])

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
                    Note
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
      <BankDeleteDialog item={selectedItem} bank={context.provider.bank} open={deleteDialogOpen} closeFn={handleClose}></BankDeleteDialog>
      <BankStakeDialog item={selectedItem} bank={context.provider.bank} open={stakeDialogOpen} closeFn={handleClose}></BankStakeDialog>
      <BankWithdrawDialog item={selectedItem} bank={context.provider.bank} open={withdrawDialogOpen} closeFn={handleClose}></BankWithdrawDialog>
    </div>
  );
}
