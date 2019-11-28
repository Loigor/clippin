import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Launch from '@material-ui/icons/Launch';
import { Pack } from '../../../backend/src/models/structure';
import { useHistory } from "react-router-dom";
import { Grid, Divider, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

interface Props {
  packs: Pack[];
}

const PackList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const history = useHistory();

  return (
    <List className={classes.root}>
      {props.packs && props.packs.map(pack => {
        const labelId = `checkbox-list-label-${pack.id}`;
        return (
          <div key={pack.id}>
            <ListItem role={undefined} dense button onClick={handleToggle(pack.id)}>
              <ListItemIcon>
                <IconButton onClick={() => history.push(`/packs/${pack.id}`)} edge="end" aria-label="comments">
                  <Launch />
                </IconButton>

              </ListItemIcon>

              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <ListItemText id={labelId} primary={<Typography variant={'h6'}>{pack.name}</Typography>} />
                </Grid>
                <Grid item xs={6}>
                  <ListItemText primary={`Samples: ${pack.samples ? pack.samples.length : 0}`} />

                </Grid>
              </Grid>

              <ListItemSecondaryAction>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(pack.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        );
      })}
    </List>
  );
}

export default PackList;