import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, FormControl, Icon, IconButton, InputLabel, makeStyles, Select, Theme } from '@material-ui/core';
import { useWeb3Context } from '../../hooks';
import { commonUtil } from '../../util/commonUtil';
import { WalletAccountType } from '../../wallet';

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

  const { walletManager } = context

  const wallet = walletManager.getWallet()

  const canAddAddress = wallet?.active?.type === WalletAccountType.Web
  const addAddress = () => {
    const account = walletManager.addAccount()
    if (account) {
      walletManager.setActiveAccount(account)
    }
  }

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event.target.value)
    const account = walletManager.getAccountByAddress(event.target.value as string)
    if (account) {
      walletManager.setActiveAccount(account)
    }
  }

  const truncateAddress = (address?: string) => {
    return commonUtil.truncateStringInTheMiddle(address, 10, 5)
  }

  return (
    <>
      <div hidden={!canAddAddress}>
        <IconButton aria-label="add" onClick={addAddress}>
          <Icon style={{ color: 'white' }}>add_circle_outline</Icon>
        </IconButton>
      </div>
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