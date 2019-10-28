import React, { useState, useEffect } from 'react';
import './App.css';
import { DropzoneArea } from 'material-ui-dropzone'
import axios from 'axios'
import { Paper, Chip } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AudioPlayer from 'components/AudioPlayer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      marginTop: theme.spacing(3),
      width: '100%',
      overflowX: 'auto',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
  }),
);


interface sample {
  id: number,
  filename: string,
  bpm: number,
  metadata: any,
  created_at: Date,
  file_uri: string,
  waveform: string
}




const App: React.FC = () => {

  const [getSamples, setSampels] = useState<sample[]>([]);
  const [getFiles, setFiles] = useState();
  //const [responses, setResponses] = useState<any | []>([]);
  const fetchSamples = async () => {
    const samples = (await axios.get('/api/v1/samples')).data;
    console.log("Samples. ", samples)
    setSampels(samples);
  }

  useEffect(() => {
    fetchSamples();
  }, [])

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/v1/samples', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    console.log("Upload response: ", res)
    //setResponses([...responses, res.data]);
  }


  const handleChange = async (files: any) => {
    setFiles({
      files: { ...getFiles, ...files.map(file => ({ ...file, uploading: false })) }
    });

    await uploadFile(files.pop());
    await fetchSamples();

  }

  const classes = useStyles();



  return (
    <div>
      <Paper>
        <DropzoneArea
          dropzoneText="Drag and drop an audio sample here or click"
          acceptedFiles={['audio/*']}
          maxFileSize={5000000 * 300} // 300m
          filesLimit={100}
          onChange={handleChange}
          showFileNamesInPreview={false}
          showPreviews={false}

        />
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell><b>Filename</b></TableCell>
              <TableCell><b>Waveform</b></TableCell>
              <TableCell>Player</TableCell>
              <TableCell align="right"><b>BPM</b></TableCell>
              <TableCell align="right"><b>Tags</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSamples.map(sample => (
              <TableRow key={sample.id}>
                <TableCell component="th" scope="row">
                  {sample.filename}
                </TableCell>
                <TableCell>
                  <img height={50} src={sample.waveform} />
                </TableCell>
                <TableCell style={{ backgroundImage: '' }}>
                  <AudioPlayer src={sample.file_uri} />
                </TableCell>
                <TableCell align="right">
                  {sample.bpm}
                </TableCell>
                <TableCell align="right">
                  <Chip variant="outlined" color="primary" size="small" label="Drum" />&nbsp;
                  <Chip variant="outlined" color="primary" size="small" label="Linn Drum" />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default App;
