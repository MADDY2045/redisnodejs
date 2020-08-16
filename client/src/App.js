import React from 'react';
import './App.css';
import EventCreation from './components/NotificationPage';
import { Route,Switch } from 'react-router-dom';
const App=()=>{
  return (
    <div className="App">
      <Switch>
        <Route exact path ='/' component={EventCreation}/>
        <Route exact path ='*' component={()=><h1>404 NOT FOUND</h1>}/>
      </Switch>

    </div>
  );
}

export default App;
