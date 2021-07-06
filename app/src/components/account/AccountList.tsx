import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, FormControl, Icon, IconButton, InputLabel, makeStyles, Select, Theme } from '@material-ui/core';
import { useWeb3Context } from '../../hooks';
import { commonUtil } from '../../util/commonUtil';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.common.white,
        },
        '&:hover fieldset': {
          borderColor: theme.palette.common.white,
        },
      },
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

export const AccountList = () => {
  const classes = useStyles()
  const context = useWeb3Context()

  const { wallet } = context

  const addAddress = () => {
    context.walletManager.addAccount()
    context.setWallet(context.walletManager.getWallet())
  }

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event.target.value)
    const account = context.walletManager.getAccountByAddress(event.target.value as string)
    if (account && context.walletManager.setActiveAccount(account)) {
      context.setWallet(context.walletManager.getWallet())
    }
  }

  const truncateAddress = (address?: string) => {
    return commonUtil.truncateStringInTheMiddle(address, 10, 5)
  }

  return (
    <>
      <IconButton aria-label="add" onClick={addAddress}>
        <Icon style={{ color: 'white' }}>add_circle_outline</Icon>
      </IconButton>
      <FormControl variant="outlined" className={classes.formControl} size="small">
        <InputLabel id="select-address-label"></InputLabel>
        <Select
          labelId="select-address-label"
          id="select-address-label"
          value={wallet?.active?.address}
          onChange={handleChange}
        >
          {wallet?.accounts?.map(account => {
            return (
              <MenuItem key={account.address} value={account.address}>{truncateAddress(account.address)}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </>
  );
}