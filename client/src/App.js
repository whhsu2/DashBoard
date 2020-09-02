import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Header from './components/Header'
import Campaign from './components/Campaign'
import SegmentDashBoard from './components/Segment_DashBoard'

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path='/segment/:id' component={SegmentDashBoard} />
          <Route path='/' component={Campaign} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
