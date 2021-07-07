import React from 'react';
import { Tooltip } from '@material-ui/core'
import { commonUtil } from '../../util/commonUtil';

interface Props {
  value?: string
  maxLength: number
  defaultValue?: string
}

export const TruncateTooltip: React.FC<Props> = (props: Props) => {
  const defaultValue = props.defaultValue ?? "-"
  const renderTooltip = () => {
    if (props.value && props.value.length > props.maxLength) {
      const truncateValue = commonUtil.truncateString(props.value, props.maxLength)
      return (
        <Tooltip title={props.value} placement="top" arrow interactive>
          <span>{truncateValue ?? defaultValue}</span>
        </Tooltip>
      )
    }
    return (
      <span>{props.value ?? defaultValue}</span>
    )
  }

  return (
    <>
      {renderTooltip()}
    </>
  );
}
