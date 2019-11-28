import React from 'react';
import './App.css';
import { Search as SearchIcon, SearchOutlined, PlaylistPlay, PlaylistPlayOutlined, PlaylistAdd, PlaylistAddCheckOutlined, CloudUpload, CloudUploadOutlined } from '@material-ui/icons'
import Upload from 'modules/Upload'
import MiniDrawer from 'components/Drawer';
import Front from 'modules/Front'
import Search from 'modules/Search'
import Packs from 'modules/Packs'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import { SnackbarProvider } from 'notistack';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: deepOrange[700],
      light: deepOrange[200],
      dark: deepOrange[900],
      contrastText: '#fff',
    },
    secondary: pink,
    error: red,
    tonalOffset: 0.8
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Roboto',
      'Arial',
    ].join(','),
  },
});



//export const PlayerContext = React.createContext<number[]>([]);
const menuItems = [
  { name: 'Search', path: '/search', icon: <SearchIcon />, iconActive: <SearchOutlined /> },
  { name: 'Upload', path: '/upload', icon: <CloudUpload />, iconActive: <CloudUploadOutlined /> },
  { name: 'Packs', path: '/packs', icon: <PlaylistPlay />, iconActive: <PlaylistPlayOutlined /> },
  { name: 'New pack', path: '/packs/new', icon: <PlaylistAdd />, iconActive: <PlaylistAddCheckOutlined /> },
]

const App: React.FC = () => {

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <div>
            <MiniDrawer menuItems={menuItems}>
              <Switch>
                <Route exact path="/" component={Front} />
                <Route path="/upload" component={Upload} />
                <Route path="/search" component={Search} />
                <Route path="/packs" component={Packs} />
              </Switch>
            </MiniDrawer>
          </div >
        </Router>
      </SnackbarProvider>

    </ThemeProvider>
  );
}

export default App;
