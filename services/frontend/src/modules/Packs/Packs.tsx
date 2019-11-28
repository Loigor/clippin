import React, { useEffect, useState } from 'react';
// import React, { useState } from 'react';
import axios from 'axios';
import { Paper, Typography } from '@material-ui/core';
import PackList from 'components/PackList';
import { withSnackbar, WithSnackbarProps } from 'notistack';

const Packs: React.FC<WithSnackbarProps> = (props) => {
  const [packs, setPacks] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPacks();
  }, [])

  const fetchPacks = async () => {
    setLoading(true);
    try {
      const packs = (await axios.get('/api/v1/packs')).data;
      setPacks(packs);
    } catch (error) {
      props.enqueueSnackbar(error.message, { variant: 'error' })
    }
    setLoading(false);
  }

  return (
    <Paper>
      {loading && <Typography>Loading...</Typography>}
      {packs && <PackList packs={packs} />}
    </Paper>
  )
}

export default withSnackbar(Packs);