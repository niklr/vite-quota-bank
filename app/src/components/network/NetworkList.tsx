import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, FormControl, InputLabel, makeStyles, Select, Theme } from '@material-ui/core';
import { INetworkStore } from '../../stores';
import { Network } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      '& .MuiSelect-root': {
        color: theme.palette.common.white
      },
      '& .MuiSvgIcon-root': {
        color: theme.palette.common.white
      }
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface Props {
  networkStore: INetworkStore
}

export const NetworkList: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const networks = props.networkStore.networks
  const [network, setNetwork] = useState<Network>(props.networkStore.network)

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event.target.value)
    const selectedNetwork = networks.find(e => e.id === event.target.value)
    if (selectedNetwork) {
      props.networkStore.network = selectedNetwork
      setNetwork(selectedNetwork)
    }
    window.location.reload()
  }

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl} size="small">
        <InputLabel id="select-network-label"></InputLabel>
        <Select
          labelId="select-network-label"
          id="select-network-label"
          value={network?.id}
          onChange={handleChange}
        >
          {networks.map(e => {
            return (
              <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </>
  );
}