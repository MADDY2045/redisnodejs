import React from 'react';
import './App.css';
import EventCreation from './components/NotificationPage';
import EmailCluster from './components/EmailCluster';
import { Route,Switch } from 'react-router-dom';
const App=()=>{
  return (
    <div className="App">
      <Switch>
        <Route exact path ='/' component={EmailCluster}/>
        <Route exact path ='/eventcreation' component={EventCreation}/>
        <Route exact path ='*' component={()=><h1>404 NOT FOUND</h1>}/>
      </Switch>

    </div>
  );
}

export default App;
