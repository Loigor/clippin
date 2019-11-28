import React, { useState } from 'react';
import { Card } from '@material-ui/core';
import { useDropzone } from 'react-dropzone'
import lightBlue from '@material-ui/core/colors/lightBlue';

interface Props {
  handleChange: (files: File[]) => void;
  children?: React.ReactNode;
  uploaded?: File[];
}

const styles = {
  card: {},
  dropzone: {
    border: `3px dashed ${lightBlue[500]}`,
    borderRadius: '3px',
    minHeight: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2em'
  }
}

const Dropzone: React.FC<Props> = (props) => {
  const [getFiles, setFiles] = useState();

  const getNotUploaded = () => {
    return getFiles.filter(file => (props.uploaded && props.uploaded.length > 0) ? props.uploaded.indexOf(file) === 0 : true);
  }

  const handleChange = async (files: File[]) => {
    setFiles(files);
    props.handleChange(files);
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleChange })

  return (
    <Card style={{ ...styles.card }}>
      <div {...getRootProps()} style={{ flexDirection: "column", ...styles.dropzone }}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>}
        <p>{getFiles && getNotUploaded().map(f => f.name).join(', ')}</p>
      </div>
      {/* {getFiles &&
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {getFiles.map((file, idx) => <div style={{ flex: 1 }} key={idx}>{file.name}</div>)}
        </div>} */}
    </Card>
  )
}

export default Dropzone;