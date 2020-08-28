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
        <Switch>
          <Route path='/segment'>
            <SegmentDashBoard />
          </Route>
          <Route path='/'>
            <Campaign />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
