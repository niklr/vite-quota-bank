import React from 'react';
import { Card, CardContent, Chip, makeStyles, Typography } from '@material-ui/core'
import { useEffect } from 'react'
import { useBlockHeight, useConnectedWeb3Context } from '../../hooks'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 211,
    textAlign: 'center'
  },
  title: {
    fontSize: 14,
    marginBottom: 10
  },
  blockHeight: {
    marginTop: 15
  },
  chip: {
    marginTop: 15
  }
});

export const NetworkCard = () => {
  const classes = useStyles();
  const context = useConnectedWeb3Context()

  const { blockHeight, fetchBlockHeight } = useBlockHeight(context)

  useEffect(() => {
    let interval = setInterval(async () => {
      await fetchBlockHeight()
    }, 1000)
    return () => {
      // console.log('NetworkCard interval cleared')
      clearInterval(interval);
    }
  })

  const network = context.provider.networkStore.network

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Network
          </Typography>
          <Chip size="small" label={network?.name} /> / <Chip size="small" label={network?.networkId} />
          <Typography className={classes.blockHeight} variant="h5" component="h2">
            {blockHeight}
          </Typography>
          <Typography color="textSecondary">
            Block height
          </Typography>
          <Chip className={classes.chip} size="small" label={network?.rpcUrl} />
        </CardContent>
      </Card>
    </>
  );
}
