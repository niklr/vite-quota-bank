import React from 'react';
import { Card, CardContent, Chip, Grid, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { useEffect } from 'react'
import { useAccountQuota, useConnectedWeb3Context } from '../../hooks'
import { truncateStringInTheMiddle } from '../../util/tools';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 170,
  },
  title: {
    fontSize: 14,
  },
  unit: {
    marginLeft: 5,
  }
});

export const AccountCard = () => {
  const classes = useStyles();
  const context = useConnectedWeb3Context()

  const { quota, fetchQuota } = useAccountQuota(context, context.account)

  useEffect(() => {
    let interval = setInterval(async () => {
      await fetchQuota()
    }, 1000)
    return () => {
      // console.log('NetworkCard interval cleared')
      clearInterval(interval);
    }
  })

  const truncateAddress = (address?: string) => {
    return truncateStringInTheMiddle(address, 15, 10)
  }

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom component="div">
            Account
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h5" component="h2">
                12342234
                <Typography className={classes.unit} color="textSecondary" component="span">
                  VITE
                </Typography>
              </Typography>
              <Typography color="textSecondary">
                Balance
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="h2">
                {quota.currentQuotaFormatted}
                <Typography className={classes.unit} color="textSecondary" component="span">
                  UT
                </Typography>
              </Typography>
              <Typography color="textSecondary">
                Quota
              </Typography>
            </Grid>
          </Grid>
          <br />
          <Tooltip title={context.account ?? ""} placement="top" arrow interactive>
            <Chip size="small" label={truncateAddress(context.account)} />
          </Tooltip>
        </CardContent>
      </Card>
    </>
  );
}
