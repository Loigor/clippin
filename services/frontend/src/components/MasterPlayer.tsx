import React from 'react';
// import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import { ListItemProps } from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Divider from '@material-ui/core/Divider';
// import InboxIcon from '@material-ui/icons/Inbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
import AudioPlayer from './AudioPlayer';

import * as schema from '../../../backend/src/models/schema';
import _ from 'lodash';
import PlayerDrawer from './PlayerDrawer';




// function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
//   return <ListItem button component="a" {...props} />;
// }


interface PlayerProps {
  samples: (schema.sample | any)[];
  multitrack?: boolean;
}

interface PlayerState {
  playing: boolean;
  soloId?: number;
}



class MasterPlayer extends React.Component<PlayerProps, PlayerState> {
  private players: React.RefObject<AudioPlayer>[] = [];
  constructor(props) {
    super(props);
    this.state = {
      playing: false
    }
    for (const sample of props.samples) {
      this.players[sample.id] = React.createRef<AudioPlayer>();
    }
  }

  play = () => {
    if (this.props.multitrack) {
      // Play all samples  (Not optimal solution ;P)
      // this.players.map(player => _.get(player, 'current').playIt())
      Object.keys(this.players).map(key => this.players[key].current.playIt())
      this.setState({ playing: true });
    }
  }

  stop = () => {
    this.players.map(player => _.get(player, 'current').playIt())
    this.setState({ playing: false })
  }

  drawerPlayClicked = () => {
    this.state.playing ? this.stop() : this.play();
  }

  soloTrack = (sampleId: number) => {
    Object.keys(this.players).map(key => key === String(sampleId) ? this.players[key].current.solo() : this.players[key].current.mute())
    this.setState({ soloId: sampleId })
  }

  render() {
    const { playing } = this.state;
    return (
      <div>
        <List component="nav">
          {this.props.samples.map(sample =>
            <ListItem key={'sample_list_item_' + sample.id} style={{ padding: 5 }}>
              <AudioPlayer
                ref={this.players[sample.id]}
                multitrack={this.props.multitrack}
                sample={sample}
                key={sample.id}
                id={sample.id}
                src={sample.file_uri}
                soloTrack={this.soloTrack}
              />
            </ListItem>
          )}
        </List>
        {this.props.multitrack && <PlayerDrawer playing={playing} onClickPlay={this.drawerPlayClicked} />}
      </div>
    );
  }
}



export default MasterPlayer