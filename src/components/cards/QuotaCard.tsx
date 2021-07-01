import React from 'react';
import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core'
import { useEffect } from 'react'
import { useAccountQuota, useConnectedWeb3Context } from '../../hooks'

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

interface Props {
  title?: string
  address?: string
}

export const QuotaCard: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const context = useConnectedWeb3Context()

  const { quota, fetchQuota } = useAccountQuota(context, props.address)

  useEffect(() => {
    let interval = setInterval(async () => {
      await fetchQuota()
    }, 1000)
    return () => {
      clearInterval(interval);
    }
  })

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom component="div">
            {props.title}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h5" component="h2">
                {quota.currentQuotaFormatted}
                <Typography className={classes.unit} color="textSecondary" component="span">
                  UT
                </Typography>
              </Typography>
              <Typography color="textSecondary">
                Current
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="h2">
                {quota.maxQuotaFormatted}
                <Typography className={classes.unit} color="textSecondary" component="span">
                  UT
                </Typography>
              </Typography>
              <Typography color="textSecondary">
                Max
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="h2">
                {quota.stakeAmountFormatted}
                <Typography className={classes.unit} color="textSecondary" component="span">
                  VITE
                </Typography>
              </Typography>
              <Typography color="textSecondary">
                Staked
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
