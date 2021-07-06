import React from 'react';
import { Chip, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import { useEffect } from 'react'
import { useAccountBalance, useAccountQuota, useConnectedWeb3Context } from '../../hooks'
import { commonUtil } from '../../util/commonUtil';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  quota: {
    color: theme.palette.grey[500]
  },
  subtitle: {
    fontWeight: 250
  },
  unit: {
    fontSize: 10,
    display: 'inline',
    color: theme.palette.grey[500]
  },
  chip: {
    margin: 10
  }
}));

interface Props {
  title?: string
  address?: string
}

export const AddressSummaryTable: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const context = useConnectedWeb3Context()
  const delay = 1000

  const { quota, fetchQuota } = useAccountQuota(context, props.address)
  const { balance, fetchBalance } = useAccountBalance(context, props.address)

  useEffect(() => {
    let interval = setInterval(async () => {
      if (props.address) {
        await fetchBalance()
        await fetchQuota()
      }
    }, delay)
    return () => {
      clearInterval(interval);
    }
  })

  const truncateAddress = (address?: string) => {
    return commonUtil.truncateStringInTheMiddle(address, 15, 10)
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {props.title}
              </TableCell>
              <TableCell className={classes.quota} align="center" colSpan={3}>
                Quota
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.subtitle}>Balance</TableCell>
              <TableCell className={classes.subtitle} align="right">Current</TableCell>
              <TableCell className={classes.subtitle} align="right">Max</TableCell>
              <TableCell className={classes.subtitle} align="right">Staked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {balance.amountFormatted} <Typography className={classes.unit}>VITE</Typography>
              </TableCell>
              <TableCell align="right">
                {quota.currentQuotaFormatted} <Typography className={classes.unit}>UT</Typography>
              </TableCell>
              <TableCell align="right">
                {quota.maxQuotaFormatted} <Typography className={classes.unit}>UT</Typography>
              </TableCell>
              <TableCell align="right">
                {quota.stakeAmountFormatted} <Typography className={classes.unit}>VITE</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Tooltip title={props.address ?? ""} placement="top" arrow interactive>
        <Chip className={classes.chip} size="small" label={truncateAddress(props.address)} />
      </Tooltip>
    </Paper>
  );
}
