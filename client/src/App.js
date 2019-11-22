import React, { Fragment } from 'react';
import './App.css';
import NavBar from '../src/components/layout/NavBar';
import Landing from '../src/components/layout/Landing';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Fragment className='App'>
        <NavBar />
        <Route />
      </Fragment>
    </Router>
  );
}

export default App;
