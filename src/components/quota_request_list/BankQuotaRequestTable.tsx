import React from 'react';
import { Button, Chip, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import { BankDeleteDialog, BankStakeDialog, BankWithdrawDialog } from './dialogs';
import { useBlockHeight, useConnectedWeb3Context, useQuotaRequests } from '../../hooks';
import { QuotaRequest } from '../../types';
import { commonUtil } from '../../util/commonUtil';
import { QuotaRequestDueDate } from '../quota_request';
import { QuotaRequestExtensions } from '../../type-extensions';

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
  const { blockHeight, blockHeightSubject } = useBlockHeight(context)

  const [stakeDialogOpen, setStakeDialogOpen] = React.useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  console.log('render BankQuotaRequestTable', context.provider.networkStore.blockHeight)

  const refreshQuotaRequests = () => {
    fetchQuotaRequests(true)
  }

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
    setWithdrawDialogOpen(false);
    setDeleteDialogOpen(false);
  };

  const truncateAddress = (address?: string) => {
    return commonUtil.truncateStringInTheMiddle(address, 10, 5)
  }

  const isStaked = (item: QuotaRequest) => {
    return item.amount && !item.isExpired
  }

  const updateQuotaRequests = () => {
    if (quotaRequests && quotaRequests.length > 0) {
      quotaRequests.forEach(item => {
        QuotaRequestExtensions.getInstance().update(item, context.provider.networkStore.blockHeight)
      })
    }
  }
  updateQuotaRequests()

  blockHeightSubject.subscribe(result => {
    if (blockHeight !== result) {
      updateQuotaRequests()
    }
  })

  const canStake = (item: QuotaRequest) => {
    return !item.amount
  }

  const canDelete = (item: QuotaRequest) => {
    return !item.amount
  }

  const canWithdraw = (item: QuotaRequest) => {
    return item.amount && item.isExpired
  }

  const showActions = () => {
    return context.provider.networkStore.blockHeight !== '0'
  }

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
                    return <TableRow key={item.address}>
                      <TableCell>
                        <Tooltip title={item.address ?? ""} placement="top" arrow interactive>
                          <Chip size="small" label={truncateAddress(item.address)} />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {item.message ?? "-"}
                      </TableCell>
                      <TableCell>
                        {item.amountFormatted ?? "-"}
                      </TableCell>
                      <TableCell>
                        {item.expirationHeight ?? "-"}
                      </TableCell>
                      <TableCell>
                        <QuotaRequestDueDate quotaRequest={item}>
                        </QuotaRequestDueDate>
                      </TableCell>
                      <TableCell align="right">
                        {showActions() && (
                          <div>
                            {canStake(item) && (
                              <Button size="small" variant="contained" color="primary" className={classes.stakeButton} onClick={() => { handleClickOpen(DialogType.Stake) }}>
                                Stake
                              </Button>
                            )}
                            {isStaked(item) && (
                              <Chip size="small" label="Staked" />
                            )}
                            {canWithdraw(item) && (
                              <Button size="small" variant="outlined" onClick={() => { handleClickOpen(DialogType.Withdraw) }}>Withdraw</Button>
                            )}
                            {canDelete(item) && (
                              <IconButton aria-label="delete" onClick={() => { handleClickOpen(DialogType.Delete) }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <BankDeleteDialog open={deleteDialogOpen} closeFn={handleClose}></BankDeleteDialog>
      <BankStakeDialog open={stakeDialogOpen} closeFn={handleClose}></BankStakeDialog>
      <BankWithdrawDialog open={withdrawDialogOpen} closeFn={handleClose}></BankWithdrawDialog>
    </div>
  );
}
