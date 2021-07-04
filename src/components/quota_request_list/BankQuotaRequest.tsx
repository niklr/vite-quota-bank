import React, { useEffect, useState } from 'react';
import { Button, Chip, IconButton, makeStyles, TableCell, TableRow, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import { DialogType } from './dialogs';
import { IConnectedWeb3Context } from '../../hooks';
import { QuotaRequest } from '../../types';
import { commonUtil } from '../../util/commonUtil';
import { QuotaRequestDueDate } from '../quota_request';
import { GlobalEvent } from '../../emitters';
import { AppConstants } from '../../constants';

const useStyles = makeStyles((theme) => ({
  refreshButton: {
    float: 'right'
  },
  stakeButton: {
    marginRight: 20
  }
}));

interface Props {
  context: IConnectedWeb3Context,
  item: QuotaRequest,
  handleClickOpenFn: (type: DialogType, item: QuotaRequest) => void
}

export const BankQuotaRequest: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const emitter = props.context.provider.emitter

  const [quotaRequest, setQuotaRequest] = useState<QuotaRequest>(props.item)

  // console.log('render BankQuotaRequest', props.item.address)

  useEffect(() => {
    const handleNetworkBlockHeight = (height: string) => {
      // Create new instance, otherwise setQuotaRequest has no effect
      const newQuotaRequest = new QuotaRequest(quotaRequest)
      newQuotaRequest.update(height)
      if (!quotaRequest.equals(newQuotaRequest)) {
        console.log('BankQuotaRequest changed', quotaRequest.address, height)
        setQuotaRequest(newQuotaRequest)
      }
    }
    // console.log('BankQuotaRequest created', quotaRequest.address)
    emitter.on(GlobalEvent.NetworkBlockHeight, handleNetworkBlockHeight)
    return () => {
      // console.log('BankQuotaRequest disposed', quotaRequest.address)
      emitter.off(GlobalEvent.NetworkBlockHeight, handleNetworkBlockHeight)
    };
  }, [emitter, quotaRequest, setQuotaRequest]);

  const truncateAddress = (address?: string) => {
    return commonUtil.truncateStringInTheMiddle(address, 10, 5)
  }

  const isStaked = (item: QuotaRequest) => {
    return item.amount && item.amount !== AppConstants.DefaultZeroString && !item.isExpired
  }

  const canStake = (item: QuotaRequest) => {
    return !item.amount
  }

  const canDelete = (item: QuotaRequest) => {
    return !item.amount
  }

  const canWithdraw = (item: QuotaRequest) => {
    return item.amount && item.isExpired
  }

  const showActions = () => {
    return props.context.provider.networkStore.blockHeight !== AppConstants.InitialNetworkBlockHeight
  }

  return (
    <TableRow>
      <TableCell>
        <Tooltip title={quotaRequest.address ?? ""} placement="top" arrow interactive>
          <Chip size="small" label={truncateAddress(quotaRequest.address)} />
        </Tooltip>
      </TableCell>
      <TableCell>
        {quotaRequest.message ?? "-"}
      </TableCell>
      <TableCell>
        {quotaRequest.amountFormatted ?? "-"}
      </TableCell>
      <TableCell>
        {quotaRequest.expirationHeight ?? "-"}
      </TableCell>
      <TableCell>
        <QuotaRequestDueDate quotaRequest={quotaRequest}>
        </QuotaRequestDueDate>
      </TableCell>
      <TableCell align="right">
        {showActions() && (
          <div>
            {canStake(quotaRequest) && (
              <Button size="small" variant="contained" color="primary" className={classes.stakeButton} onClick={() => { props.handleClickOpenFn(DialogType.Stake, quotaRequest) }}>
                Stake
              </Button>
            )}
            {isStaked(quotaRequest) && (
              <Chip size="small" label="Staked" />
            )}
            {canWithdraw(quotaRequest) && (
              <Button size="small" variant="outlined" onClick={() => { props.handleClickOpenFn(DialogType.Withdraw, quotaRequest) }}>Withdraw</Button>
            )}
            {canDelete(quotaRequest) && (
              <IconButton aria-label="delete" onClick={() => { props.handleClickOpenFn(DialogType.Delete, quotaRequest) }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
