import React from 'react';
import WaveSurfer from 'wavesurfer.js';

import { Fab, CircularProgress } from '@material-ui/core';
// import { useTheme } from '@material-ui/core/styles';

import { PlayArrow, Stop, PlayCircleFilled, SkipPrevious } from '@material-ui/icons'
// import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
// import SkipNextIcon from '@material-ui/icons/SkipNext';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { Sample } from '../../../backend/src/models/structure';
import _ from 'lodash';
import lightBlue from '@material-ui/core/colors/lightBlue';

//import { peaks } from 'peaks.js'
import Tag from './Tag';
//require('wavesurfer/plugin/wavesurfer.minimap')

const HEIGHT_SHRINKED = 50;
const HEIGHT_EXPANDED = 150;

interface PlayerProps {
  src: string;
  sample: Sample;
  id: number;
  finish?: (id: number) => void;
  multitrack?: boolean;
  solo?: boolean;
  soloTrack: (sampleId: number) => void;
}

interface PlayerState {
  playKey?: number;
  playPosition: number;
  expanded: boolean;
  isSolo: boolean;
  loading: number;
  playing: boolean;
  muted: boolean;
}

class AudioPlayer extends React.Component<PlayerProps, PlayerState> {
  public wavesurfer;
  constructor(props) {
    super(props);
    this.state = {
      playPosition: 0,
      expanded: false,
      isSolo: props.solo || false,
      loading: 0,
      playing: false,
      muted: false
    }
  }

  setWavesurferSize = (expanded) => {
    setTimeout(() => {
      this.wavesurfer.drawer.destroy();
      // this.wavesurfer.drawer.containerWidth = 500;
      // // this.wavesurfer.drawer.setHeight(size);
      this.wavesurfer.params.height = expanded ? HEIGHT_EXPANDED : HEIGHT_SHRINKED;
      this.wavesurfer.params.fillParent = true;
      this.wavesurfer.createDrawer();
      this.wavesurfer.drawBuffer();
    }, 10);

  }

  expandCard = () => {
    this.setWavesurferSize(!this.state.expanded);
    this.setState({ expanded: !this.state.expanded });
  }

  componentDidMount() {
    let xhr = { cache: 'default', mode: 'cors', method: 'GET', credentials: 'same-origin', redirect: 'follow', referrer: 'client' };

    this.wavesurfer = WaveSurfer.create({
      container: '#wave' + this.props.id,
      loading: this.state.loading,
      height: HEIGHT_SHRINKED,
      progressColor: lightBlue[100],
      responsive: true,
      waveColor: lightBlue[400],
      fillParent: true,
      cursorColor: lightBlue[600],
      hideScrollbar: true,
      normalize: true,
      barWidth: 0,
      cursorWidth: 1,
      xhr: xhr
    })

    const waveform = _.get(this.props.sample, 'metadata.analysis.waveform.data');
    if (waveform) {
      this.wavesurfer.load(this.props.src, waveform, 'auto');
    } else {
      this.wavesurfer.load(this.props.src);

    }

    // Move cursor to point
    this.wavesurfer.on('seek', (point) => {
      if (point && point >= 0)
        this.setState({ playPosition: point })
    })

    this.wavesurfer.on('play', () => {
      this.setState({ playing: true })
    })
    this.wavesurfer.on('mute', (mute) => {
      this.setState({ muted: mute })
    })
    this.wavesurfer.on('pause', () => {
      this.setState({ playing: false })
      //
    })
    this.wavesurfer.on('finish', () => {
      this.setState({ playing: false })
      //
      if (this.props.finish) this.props.finish(this.props.id);
    })

    // 0..100
    this.wavesurfer.on('loading', (t) => {
      this.setState({ loading: t })
    })

    this.wavesurfer.on('ready', () => {
      this.setState({ loading: 100 })
    })
    // window.addEventListener('keydown', this.handleKeyPress);
  }

  public playIt = () => {
    this.wavesurfer.playPause();
  };

  public fastPlay = () => {
    this.wavesurfer.seekTo(Number(this.state.playPosition));
    this.wavesurfer.play();
  }

  public reset = () => {
    this.wavesurfer.seekTo(0);
    this.setState({ playPosition: 0 })
  }

  public mute = (muted: boolean) => {
    if (this.wavesurfer.getMute() !== muted) {
      this.wavesurfer.setMute(muted);
    }
  }

  public solo = (isSolo: boolean) => {
    //
  }

  public refresh = (_) => {
    this.setWavesurferSize(this.state.expanded);
  }

  render() {
    //const theme = useTheme();
    //const { classes } = this.props;
    const { playing, muted, loading } = this.state;
    const multitrackButtonStyle = {
      padding: 0,
      minHeight: 0,
      minWidth: 0,
    }
    const { expanded } = this.state;
    const { solo } = this.props;
    return (
      <>
        <div style={{ width: '100%' }} key={'player_' + this.props.sample.id}>
          <ExpansionPanel onClick={e => e.preventDefault()} expanded={this.state.expanded} style={{ width: '100%' }} square={true} elevation={1}>
            <ExpansionPanelSummary
              aria-controls="panel1c-content"
              id="panel1c-header"
              style={{ height: 80, marginTop: expanded ? 50 : 0 }}
            >
              <Typography variant="subtitle2" style={{ position: 'absolute', top: -4, marginLeft: 4 }}> {this.props.sample.filename}</Typography>

              {this.props.multitrack &&
                <div className="multitrack-controls" style={{ display: 'flex', flexDirection: 'column', position: 'absolute', width: '25px', left: 0, top: 0 }}>
                  <Button color="secondary" variant={muted ? 'contained' : 'outlined'} style={multitrackButtonStyle} onClick={() => this.mute(!muted)}>M</Button>
                  <Button color="primary" variant={solo ? 'contained' : 'outlined'} style={multitrackButtonStyle} onClick={() => { }}>S</Button>
                </div>
              }
              <div style={{ flexBasis: expanded ? '60%' : '33.33%', overflow: 'hidden', alignItems: 'flex-start' }} onClick={(e) => { e.preventDefault() }}>

                <div style={{ display: 'flex' }}>

                  <div style={{ padding: '5px' }}>
                    {loading < 100 ? <CircularProgress variant="static" color={"secondary"} value={loading} /> :
                      <Fab onClick={this.fastPlay} color="secondary" size={'small'} style={{ margin: '0 auto' }}>
                        <PlayCircleFilled />
                      </Fab>}
                  </div>
                  <div>
                    <SkipPrevious onClick={this.reset} />
                  </div>
                  <div style={{ overflow: 'hidden', flex: 5, height: expanded ? HEIGHT_EXPANDED : HEIGHT_SHRINKED }}>
                    <div id={`wave${this.props.id}`}
                      style={{ overflow: 'hidden', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div style={{ flex: 1, textAlign: 'right', padding: '5px' }}>
                    <Fab onClick={this.playIt} color="primary" size={'small'} style={{ margin: '0 auto' }}>
                      {!playing ? <PlayArrow /> : <Stop />}
                    </Fab>
                  </div>
                </div>

              </div>
              <div style={{ flexBasis: expanded ? '20%' : '33.33%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                {/*  NOTHING  */}
              </div>

              <div onClick={() => this.expandCard()} style={{ flexBasis: expanded ? '20%' : '33.33%', marginRight: '50px', overflow: 'hidden' }}>
                <div className={'AudioPlayer-tags'} style={{ width: '100%', height: expanded ? HEIGHT_EXPANDED : HEIGHT_SHRINKED }}>
                  {this.props.sample.tags && this.props.sample.tags.map(tag => <Tag key={tag.id} label={tag.name} />)}
                </div>
              </div>

              <div style={{ right: 0 }}>
                <ExpandMoreIcon onClick={() => this.expandCard()} />
              </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ alignItems: 'center' }}>
              <div style={{ flexBasis: '33.33%' }}>


              </div>
              <div style={{ flexBasis: '33.33%' }}>

                <dl>
                  <dt>Tempo</dt> <dd>{_.get(this.props.sample, 'metadata.analysis.tempo')}</dd>
                  <dt>Size</dt> <dd>{(_.get(this.props.sample, 'metadata.file.size') / (1024 * 1024)).toFixed(3)} Mb</dd>
                </dl>
              </div>
              <div style={{ flexBasis: '33.33%' }}>
                <Typography variant="caption">
                  Tag editor
              <br />

                </Typography>
              </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button size="small">Cancel</Button>
              <Button size="small" color="primary">
                Save
             </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        </div>
      </>
    );
  }
}


export default AudioPlayer
// export default forwardRef((props, ref) => <AudioPlayer {...props} ref={ref} />);