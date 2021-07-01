import React from 'react';
import { Avatar, Button, Card, CardActions, CardContent, Chip, makeStyles, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useConnectedWeb3Context } from '../../hooks'
import { networks } from '../../common/networks';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
});

export const NetworkCard = () => {
  const classes = useStyles();
  const context = useConnectedWeb3Context()

  const [blockHeight, setBlockHeight] = useState(context.networkStatus.blockHeight);

  const network = networks.find(e => e.id === context.network.id)

  useEffect(() => {
    console.log('context.networkStatus.blockHeight', context.networkStatus.blockHeight)
  }, [context.networkStatus.blockHeight])

  const onClickHandler = () => {
    setBlockHeight(context.networkStatus.blockHeight)
    console.log('setBlockHeight', context.networkStatus.blockHeight)
  }
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
          <Typography variant="body2" component="p">
            IS_DEV: {String(process.env.REACT_APP_IS_DEV)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={onClickHandler}>Press me</Button>
        </CardActions>
      </Card>
    </>
  );
}
