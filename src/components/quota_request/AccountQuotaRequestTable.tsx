import { useState } from 'react';
import { Chip, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import { QuotaRequest } from '../../types';
import { QuotaRequestDueDate } from '../quota_request';
import { useBlockHeight, useConnectedWeb3Context } from '../../hooks';
import { QuotaRequestExtensions } from '../../type-extensions';

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
  const defaultQuotaRequest = new QuotaRequest()

  const { blockHeightSubject } = useBlockHeight(context)

  const [quotaRequest, setQuotaRequest] = useState<QuotaRequest>(defaultQuotaRequest);

  const updateQuotaRequest = async () => {
    setQuotaRequest(defaultQuotaRequest)
    if (context.account) {
      try {
        const result = await context.provider.bank.getQuotaRequestByAddress(context.account)
        QuotaRequestExtensions.getInstance().update(result, context?.networkStatus?.blockHeight)
        setQuotaRequest(result)
      } catch (error) {
        // Ignore not found error
      }
    }
  }
  blockHeightSubject.subscribe(() => {
    setTimeout(() => {
      updateQuotaRequest()
    }, 2000)
  })

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
