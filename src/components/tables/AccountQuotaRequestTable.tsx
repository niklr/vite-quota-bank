import React from 'react';
import { Chip, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  title: {
    fontWeight: 500,
    marginBottom: 20
  }
}));

export const AccountQuotaRequestTable = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>My Quota Request</Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Message
                </TableCell>
                <TableCell>
                  Amount
                </TableCell>
                <TableCell>
                  Expected Snapshot Height
                </TableCell>
                <TableCell>
                  Expected Due Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  Twitter: 0xRomanNiklaus
                </TableCell>
                <TableCell>
                  -
                </TableCell>
                <TableCell>
                  1350996
                </TableCell>
                <TableCell>
                  Request has expired!
                </TableCell>
                <TableCell>
                  <Chip size="small" label="Expired" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
