import React from 'react';
import { Tooltip } from '@material-ui/core'
import { QuotaRequest } from '../../types';

interface Props {
  quotaRequest?: QuotaRequest
}

export const QuotaRequestDueDate: React.FC<Props> = (props: Props) => {
  const renderDueDate = () => {
    if (props?.quotaRequest?.isExpired) {
      if (props?.quotaRequest?.amount) {
        return (
          <Tooltip title={props?.quotaRequest?.expirationDateFormatted ?? ""} placement="top" arrow interactive>
            <span>Staking expired!</span>
          </Tooltip>
        )
      } else {
        return (
          <Tooltip title={props?.quotaRequest?.expirationDateFormatted ?? ""} placement="top" arrow interactive>
            <span>Request has expired!</span>
          </Tooltip>
        )
      }
    } else {
      return (
        <span>{props?.quotaRequest?.expirationDateFormatted ?? '-'}</span>
      )
    }
  }

  return (
    <>
      {renderDueDate()}
    </>
  );
}
