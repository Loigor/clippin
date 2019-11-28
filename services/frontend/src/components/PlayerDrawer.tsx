import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import CssBaseline from '@material-ui/core/CssBaseline';

import { Grid, Fab } from '@material-ui/core';
import { PlayArrow, Stop } from '@material-ui/icons';

const drawerWidth = 240;
const drawerHeight = 120;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: '100%',
      height: drawerHeight,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      overflowY: 'hidden'
    },
    drawerOpen: {
      height: drawerWidth,
      transition: theme.transitions.create('height', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('height', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      height: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        height: theme.spacing(9) + 1,
      },
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

interface Props {
  playing: boolean;
  onClickPlay: () => void;
}

const PlayerDrawer: React.FC<Props> = (props) => {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  const open = false;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        anchor="bottom"
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <Grid container>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <div style={{ flex: 1 }}>
              <Fab onClick={() => props.onClickPlay()} color="primary" size={'small'} style={{ margin: '0 auto' }}>
                {!props.playing ? <PlayArrow /> : <Stop />}
              </Fab>
            </div>
          </Grid>
          <Grid item xs={6}>

          </Grid>
        </Grid>
      </Drawer >
    </div>
  );
}
export default PlayerDrawer;