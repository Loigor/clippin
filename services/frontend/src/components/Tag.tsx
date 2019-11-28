import React from 'react';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import { makeStyles, createStyles, ThemeProvider } from '@material-ui/styles';
import { Theme, createMuiTheme } from '@material-ui/core';
import orange from '@material-ui/core/colors/orange';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[400]
    },
  }
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    chip: {
      border: '1px solid black'
    }
  }),
);

const Tag: React.FC<ChipProps> = (props) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <span className={classes.root}>
        <Chip color={'primary'} size="small" className={classes.chip}  {...props}>
        </Chip>
      </span>
    </ThemeProvider>
  )
}


export default Tag;