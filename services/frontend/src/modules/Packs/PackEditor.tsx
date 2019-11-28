import React, { useState, useEffect } from 'react';
// import React, { useState } from 'react';
import { Paper, Grid, Typography, TextField, Button, Divider, Switch, FormGroup, FormControlLabel, LinearProgress } from '@material-ui/core';
import Axios from 'axios';
//import { Pack } from '../../../../backend/src/models/structure';
import { useParams } from 'react-router-dom';
import MasterPlayer from 'components/MasterPlayer';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as structure from '../../../../backend/src/models/structure';
import UploadDialog from 'components/UploadDialog';
//import * as schema from '../../../../backend/src/models/schema';
import { useHistory } from 'react-router-dom';

interface Props extends WithSnackbarProps {
  id: number | string;
}

const PackEditor: React.FC<Props> = (props) => {
  const [editing, setEditing] = useState();
  const [pack, setPack] = useState<Partial<structure.Pack>>();
  const [samples, setSamples] = useState<structure.Sample[]>([]);
  const [multitrack, setMultitrack] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false)
  const history = useHistory();

  const params = useParams();
  const { id } = props || params;
  const newPack = id === 'new';


  useEffect(() => {
    fetchPack();
  }, [id])

  const fetchPack = async (packId = id) => {
    if (newPack) {
      setSamples([]);
      setPack({
        name: '',
      })
      setEditing(true);
    } else if (Number(packId)) {
      try {
        const pack = (await Axios.get(`/api/v1/packs/${packId}`)).data[0];
        setPack(pack);
        const samples = (await Axios.get(`/api/v1/packs/${pack.id}/samples`)).data;
        setSamples(samples);
      } catch (error) {
        props.enqueueSnackbar(error.message, { variant: 'error' });
      }
    }

  }

  const uploadFiles = async (files: File[]) => {
    const createdSamples: structure.Sample[] = [];

    for (const file of files) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('packId', String(id));
        const res = await Axios.post(`/api/v1/samples`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (res.data) {
          createdSamples.push(res.data);
          setSamples(createdSamples)
        }
      } catch (error) {
        props.enqueueSnackbar(`Error uploading: ${error.message}`, { variant: 'error' });
      }
      setUploading(false);
    }

    props.enqueueSnackbar('Samples uploaded', { variant: 'success' });
  }

  const handleUpload = (files: File[]) => {
    setUploadDialog(false);
    uploadFiles(files);
  }


  const handleSave = async () => {
    try {
      const res = (await Axios.post(`/api/v1/packs`, pack)).data;
      props.enqueueSnackbar(newPack ? 'Pack created' : 'Pack updated', { variant: 'success' })
      setEditing(false);
      if (newPack) {
        history.push(`/packs/${res.id}`)
      } else {
        fetchPack();
      }
    } catch (error) {
      props.enqueueSnackbar(`Error creating pack: ${error.message}`, { variant: 'error' })
    }

  }

  if (!pack) return <Typography>Loading...</Typography>

  return (
    <Grid container spacing={3}>
      {uploading && <LinearProgress color="secondary" />}
      <UploadDialog open={uploadDialog} handleUpload={handleUpload} handleClose={() => { setUploadDialog(false) }} />
      <Grid item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Grid container spacing={6}>

            <Grid item xs={6}>
              {!editing && <Typography variant={'h6'}>{pack.name}</Typography>}
              {editing && <TextField value={pack.name} onChange={({ target }) => setPack({ ...pack, name: target.value })} label="Pack name" />}
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch checked={multitrack} onChange={() => setMultitrack(!multitrack)} value="multitrack" />
                  }
                  label="Multitrack"
                />

              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={3} alignContent={'center'}>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Button variant="contained" color={'secondary'}
                      onClick={() => { editing && fetchPack(); setEditing(!editing) }}>{editing ? 'Cancel' : 'Edit'}</Button>
                    {editing &&
                      <>
                        <Divider style={{ margin: '0 10px 0 10px' }} orientation={'vertical'} />
                        <Button onClick={async () => { await handleSave() }} variant="contained" color={'primary'}>
                          Save
                        </Button>
                      </>
                    }
                  </Grid>
                </Grid>
                {samples.length > 0 &&
                  <Grid item xs={12}>
                    <Button disabled color={'secondary'}>Download as zip</Button>
                  </Grid>}

                {!newPack &&
                  <Grid item xs={12}>
                    <Button color={'secondary'} onClick={() => { setUploadDialog(true) }} >Add samples</Button>
                  </Grid>
                }
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              {samples.length > 0 ? <MasterPlayer multitrack={multitrack} samples={samples} /> : <Typography variant={'subtitle2'}>No samples</Typography>}

            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default withSnackbar(PackEditor);