import React from 'react';

//import Scss
import './App.css';
import './assets/scss/themes.scss';

//imoprt Route
import Route from './Routes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <Route />
    </React.Fragment>
  );
}

export default App;
