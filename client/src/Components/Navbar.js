import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Navbar as NV, Nav } from 'react-bootstrap';

import '../Styles/NavBar.css';

import { logged, removeToken } from '../Helpers/Session';

const NavBar = (props) => {

  const {children} = props;

  return (
    logged()
      ?
        <div className="navContainer">
          <NV collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top" className="navBar">
            <NV.Brand href="/">ExpenDex</NV.Brand>
            <NV.Toggle aria-controls="responsive-navbar-nav" />
            <NV.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/expenses">Manage Expenses</Nav.Link>    
              </Nav>
              <Nav>
                <Nav.Link href="/login" onClick={removeToken}>Log-out</Nav.Link>
              </Nav>
            </NV.Collapse>
          </NV>
          <div className="childContent">{children}</div>
        </div>
      :
        <Redirect to="/login"/>
  );
};

export default withRouter(NavBar);
