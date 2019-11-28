import React from 'react';
import { Paper, TextField } from '@material-ui/core';
//import { TextFieldProps } from '@material-ui/core/TextField';

const SearchField = (props) =>
  <Paper style={{ padding: 10 }}>
    <TextField {...props} style={{ width: '100%' }} id="search" label="Search" />
  </Paper>

export default SearchField;