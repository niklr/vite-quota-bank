import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { qrcode, modes, ecLevel } from 'qrcode.es';

const useStyles = makeStyles((theme) => ({
  qrcode: {
    background: '#fff',
    padding: '10px'
  }
}));

interface Props {
  text?: string
}

export const QrCode: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const elementRef = useRef<HTMLDivElement>(null);

  console.log(props.text)

  useEffect(() => {
    const defaultOpt = {
      size: 240,
      ecLevel: ecLevel.HIGH,
      minVersion: 4,
      background: '#fff',
      mode: modes.DRAW_WITH_IMAGE_BOX,
      radius: 0,
      image: process.env.PUBLIC_URL + '/icon.png',
      mSize: 0.3
    };

    if (props.text && elementRef.current) {
      elementRef.current.innerHTML = ''
      const q = new qrcode(elementRef.current);
      q.generate(props.text, defaultOpt).then(() => {
        console.log('QR code generated')
      });
    }
  }, [props.text])

  return (
    <>
      <div className={classes.qrcode} ref={elementRef}></div>
    </>
  );
}
