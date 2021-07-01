import React from 'react';
import { Card, CardContent, Chip, makeStyles, Typography } from '@material-ui/core'
import { useEffect } from 'react'
import { useBlockHeight, useConnectedWeb3Context } from '../../hooks'
import { networks } from '../../common/networks';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 170,
  },
  title: {
    fontSize: 14,
  },
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

  const network = networks.find(e => e.id === context.network.id)

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom component="div">
            Network <Chip size="small" label={network?.name} /> / <Chip size="small" label={network?.id} />
          </Typography>
          <Typography variant="h5" component="h2">
            {blockHeight}
          </Typography>
          <Typography color="textSecondary">
            Block height
          </Typography>
          <br />
          <Chip size="small" label={network?.url} />
        </CardContent>
      </Card>
    </>
  );
}
