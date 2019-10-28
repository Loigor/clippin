import React from 'react';
import { createMuiTheme, makeStyles } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import AudioPlayer from 'material-ui-audio-player';

const muiTheme = createMuiTheme({});

const useStyles = makeStyles(theme => {
  return {
    root: {
      borderRadius: 0,
      border: 0,
      borderStyle: '0px',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    loopIcon: {
      color: '#3f51b5',
      '&.selected': {
        color: '#0921a9'
      },
      '&:hover': {
        color: '#7986cb'
      },
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },
    playIcon: {
      color: '#f50057',
      '&:hover': {
        color: '#ff4081'
      }
    },
    volumeIcon: {
      color: 'rgba(0, 0, 0, 0.54)'
    },
    volumeSlider: {
      color: 'black'
    },
    progressTime: {
      color: 'rgba(0, 0, 0, 0.54)'
    },
    mainSlider: {
      color: '#3f51b5',
      '& .MuiSlider-rail': {
        color: '#7986cb'
      },
      '& .MuiSlider-track': {
        color: '#3f51b5'
      },
      '& .MuiSlider-thumb': {
        color: '#303f9f'
      }
    },

  };
});

interface PlayerProps {
  src: string;
}

const Player: React.FC<PlayerProps> = (props) => {


  return (
    <ThemeProvider theme={muiTheme}>
      <AudioPlayer
        rounded={false}
        height={'80%'}
        useStyles={useStyles}
        spacing={1}
        elevation={0}
        src={props.src}

      />
    </ThemeProvider>
  )
}



export default Player