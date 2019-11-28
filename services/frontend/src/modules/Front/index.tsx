import React from 'react';
import { Grid } from '@material-ui/core';
import SearchField from 'components/SearchField';



const FrontSearch: React.FC = () => {
  // const [getFiles, setFiles] = useState();
  //const [playingId, setPlayingId] = useState<number>(0);
  //const [responses, setResponses] = useState<any | []>([]);



  // const handleChange = async (files: any) => {
  //   setFiles({
  //     files: { ...getFiles, ...files.map(file => ({ ...file, uploading: false })) }
  //   });

  //   await uploadFile(files.pop());
  //   await fetchSamples();

  // }



  // const classes = useStyles();


  //  window.addEventListener('keydown', this.handleKeyPress);

  const onSearchChange = (event) => {
    console.log('moi: ', event.target.value)

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
        <SearchField onChange={onSearchChange} />
      </Grid>
    </Grid>
  )
}

export default FrontSearch;