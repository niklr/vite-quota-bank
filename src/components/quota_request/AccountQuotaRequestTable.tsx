import { useCallback, useState } from 'react';
import { Chip, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import { QuotaRequest } from '../../types';
import { QuotaRequestDueDate } from '../quota_request';
import { useConnectedWeb3Context } from '../../hooks';
import { useEffect } from 'react';
import { GlobalEvent } from '../../emitters';

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
}));

export const AccountQuotaRequestTable = () => {
  const classes = useStyles();
  const context = useConnectedWeb3Context()
  const account = context.account
  const emitter = context.provider.emitter

  const [quotaRequest, setQuotaRequest] = useState<QuotaRequest>(new QuotaRequest());

  const updateQuotaRequest = useCallback(
    async () => {
      setQuotaRequest(new QuotaRequest())
      if (context.account) {
        try {
          const result = await context.provider.bank.getRequestByAddress(context.account)
          setQuotaRequest(result)
        } catch (error) {
          setQuotaRequest(new QuotaRequest())
        }
      }
    }, [context, setQuotaRequest]
  )

  useEffect(() => {
    const handleUpdate = (update: QuotaRequest) => {
      if (account === update.address) {
        console.log('Handle QuotaRequestUpdate', update.address)
        setQuotaRequest(update)
      }
    }
    emitter.on(GlobalEvent.QuotaRequestUpdated, handleUpdate)
    updateQuotaRequest()
    return () => {
      console.log('AccountQuotaRequestTable disposed')
      emitter.off(GlobalEvent.QuotaRequestUpdated, handleUpdate)
    };
  }, [account, emitter, updateQuotaRequest, setQuotaRequest])

  useEffect(() => {
    const handleNetworkBlockHeight = (height: string) => {
      // Create new instance, otherwise setQuotaRequest has no effect
      const newQuotaRequest = new QuotaRequest(quotaRequest)
      newQuotaRequest.update(height)
      if (!quotaRequest.equals(newQuotaRequest)) {
        console.log('AccountQuotaRequestTable changed', quotaRequest.address, height)
        setQuotaRequest(newQuotaRequest)
      }
    }
    // console.log('AccountQuotaRequestTable created', quotaRequest.address)
    emitter.on(GlobalEvent.NetworkBlockHeight, handleNetworkBlockHeight)
    return () => {
      // console.log('AccountQuotaRequestTable disposed', quotaRequest.address)
      emitter.off(GlobalEvent.NetworkBlockHeight, handleNetworkBlockHeight)
    };
  }, [emitter, quotaRequest, setQuotaRequest]);

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>
        My Quota Request
        <IconButton className={classes.refreshButton} aria-label="refresh" onClick={updateQuotaRequest}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
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
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {quotaRequest?.message ?? '-'}
                </TableCell>
                <TableCell>
                  {quotaRequest?.amountFormatted ?? '-'}
                </TableCell>
                <TableCell>
                  {quotaRequest?.expirationHeight ?? '-'}
                </TableCell>
                <TableCell>
                  <QuotaRequestDueDate quotaRequest={quotaRequest}>
                  </QuotaRequestDueDate>
                </TableCell>
                <TableCell>
                  {quotaRequest?.status ? (
                    <Chip size="small" label={quotaRequest.status} />
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
