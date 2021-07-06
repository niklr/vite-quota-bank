import React from 'react';
import { Button, PropTypes } from '@material-ui/core';

interface Props {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  variant?: 'text' | 'outlined' | 'contained'
  color?: PropTypes.Color
  autoFocus?: boolean
  callbackFn: () => Promise<void>
}

export const ClickOnceButton: React.FC<Props> = (props: Props) => {
  const [isDisabled, setIsDisabled] = React.useState(false)

  const handleClick = async () => {
    setIsDisabled(true)
    try {
      await props.callbackFn()
    } catch (error) {
      console.log(error)
    }
    setIsDisabled(false)
  }

  return (
    <Button
      size={props.size ?? "small"}
      variant={props.variant ?? "contained"}
      color={props.color}
      onClick={handleClick}
      disabled={isDisabled}
      autoFocus={props.autoFocus}>
      {props.children}
    </Button>
  );
}
