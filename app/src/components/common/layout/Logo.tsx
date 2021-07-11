import { Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '20px'
  },
  table: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  logo: {
    marginTop: '7px',
    marginRight: '5px',
    width: '45px'
  },
  title: {
    fontSize: 22,
    fontWeight: 500,
    margin: '0px !important'
  },
  subtitleCell: {
    textAlign: 'right'
  },
  subtitle: {
    fontSize: 12,
    color: '#535353'
  }
}));

export const Logo = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <table className={classes.table}>
          <tbody>
            <tr>
              <td rowSpan={2}>
                <img className={classes.logo} src={"./icon.png"} alt="logo" />
              </td>
              <td>
                <Typography className={classes.title}>Vite Quota Bank</Typography>
              </td>
            </tr>
            <tr>
              <td className={classes.subtitleCell}>
                <Typography className={classes.subtitle}>
                  by&nbsp;
                  <Link href="https://github.com/niklr" color="inherit" target="_blank">
                    github.com/niklr
                  </Link>
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
