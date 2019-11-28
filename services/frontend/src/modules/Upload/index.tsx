import React, { useState } from 'react';
import { Grid, LinearProgress } from '@material-ui/core';
import Dropzone from 'components/Dropzone';
import Axios from 'axios';
import MasterPlayer from 'components/MasterPlayer';
import * as schema from '../../../../backend/src/models/schema';
import { withSnackbar, WithSnackbarProps } from 'notistack';

const UploadPage: React.FC<WithSnackbarProps> = (props) => {
  const [samples, setSamples] = useState<schema.sample[]>([]);
  const [uploading, setUploading] = useState(false)
  const uploadFiles = async (files: File[]) => {
    let uploaded: schema.sample[] = [];
    for (const file of files) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await Axios.post('/api/v1/samples', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (res.data) {
          uploaded.push(res.data);
          setSamples(uploaded)
        }
      } catch (error) {
        props.enqueueSnackbar(error.message, { variant: 'error' })
      }

      setUploading(false);
    }
  }

  return (
    <Grid container
      spacing={0}
      direction="row"
      alignItems="center"
      justify="center"
      style={{ minHeight: '20vh' }}
    >
      <Grid item xs={6}>
        <Dropzone handleChange={uploadFiles} />
        {uploading && <LinearProgress color="secondary" />}
      </Grid>
      {samples && <Grid item xs={12}>
        <MasterPlayer samples={samples} />
      </Grid>}
    </Grid>
  )
}


export default withSnackbar(UploadPage);