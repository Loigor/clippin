import React, { useEffect, useState } from 'react';
import { Paper, Grid, Button, Typography, Box, Divider, TextField } from '@material-ui/core';
import MasterPlayer from 'components/MasterPlayer';
import axios from 'axios'
import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as structure from '../../../../backend/src/models/structure';
import SearchField from 'components/SearchField';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
// import { useHistory } from "react-router-dom";



const Search: React.FC<WithSnackbarProps> = (props) => {
  const [samples, setSamples] = useState<structure.Sample[]>([]);
  const [searchValue, setSearchValue] = useState();
  const [page, setPage] = useState(1);
  const [samplesPerPage, setSamplesPerPage] = useState(10);
  const [editingSamplePage, setEditingSamplePage] = useState(false);

  const fetchSamples = async () => {
    try {
      const samples = (await axios.get('/api/v1/samples')).data
      setSamples(samples);
    } catch (error) {
      props.enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  useEffect(() => {
    fetchSamples();
  }, [searchValue])

  // const history = useHistory();

  const onChangeSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    // history.push('/search?q=' + value)
  }

  const PageNavigator = () => (
    <Box display="flex"
      justifyContent="center">
      <Box>
        <Button onClick={() => { setPage(page > 1 ? page - 1 : 1) }}><NavigateBefore /></Button>
      </Box>
      <Box display="flex"
        alignItems="center">
        {!editingSamplePage && <Typography onClick={() => setEditingSamplePage(true)}>{page} / {Math.floor(samples.length / samplesPerPage) + 1}</Typography>}
        {editingSamplePage && <TextField type="number" onBlur={() => setEditingSamplePage(false)} onChange={({ target }) => setSamplesPerPage(Number(target.value))} />}
      </Box>
      <Box>
        <Button onClick={() => { page < samples.length / samplesPerPage && setPage(page + 1) }}><NavigateNext /></Button>
      </Box>
    </Box>
  )

  const pickSamples = () => {
    if (samples) {
      const samples2 = samples;
      const pickSamples = samples2.slice((page - 1) * samplesPerPage, page * samplesPerPage);
      return pickSamples;
    } else return [];
  }

  return (
    <Paper>
      <SearchField onChange={onChangeSearch} defaultValue={searchValue} />
      {samples.length > 0 &&
        <Grid container>
          <Grid item xs={12}>
            <PageNavigator />
            <Divider />
          </Grid>
          <Grid item xs={12}><MasterPlayer samples={pickSamples()} /></Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Divider />
            <PageNavigator /></Grid>
        </Grid>
      }
    </Paper>
  )
}

export default withSnackbar(Search);