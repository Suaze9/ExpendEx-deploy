import React, { useEffect, useState } from 'react';

import './Styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { restoreSession, removeToken } from './Helpers/Session';
import { setToken } from './Helpers/API';
import NavBar from './Components/Navbar';
import Home from './Views/Home'
import Login from './Views/Login'
import Signup from './Views/Signup';
import Expenses from './Views/Expenses';


function App() {

  const [render, setRender] = useState(false);

  useEffect(()=>{
    const token = restoreSession();
    if(token){
      setToken(token);
    }else{
      removeToken();
    }
    setRender(true);
  }, [])

  return (
    render
    ?
      <Router basename="/">
        <Switch>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/signup">
            <Signup/>
          </Route>
          <Route path="/expenses">
            <NavBar className="navContainer">
              <Expenses/>
            </NavBar>
          </Route>
          <Route path="/">
            <NavBar className="navContainer">
              <Home/>
            </NavBar>
          </Route>
        </Switch>
     </Router>
    :
    <div/>
  );
}

export default App;
