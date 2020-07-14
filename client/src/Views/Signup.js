import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Card, Form, FormGroup, Button, Row, Spinner } from 'react-bootstrap'
import '../Styles/Signup.css';

import API, { setToken as st } from '../Helpers/API'
import { setToken, logged } from '../Helpers/Session';

const defaultUser = {
  name: '',
  email: '',
  password: '',
  persist: false,
}

const defaultState = {
  error: {},
  loading: false,
}

const Signup = () => {

  const [userCreds, setUserCreds] = useState(defaultUser);
  const [state, setState] = useState(defaultState);

  const onSignup = (event) => {
    event.preventDefault();
    const body = {
      name: userCreds.name,
      email: userCreds.email,
      password: userCreds.password,
    };

    setState((prevState)=>({
      ...prevState,
      loading: true,
    }));

    API.post('/api/auth/register', body)
      .then((res)=>{
        st(res.data.jwt);
        setToken(res.data.jwt, res.data.name, userCreds.persist);
        window.location.refres();
      })
      .catch((err)=>{
        let error = {};
        if(err.response){
          error = {
            message: err.response.data,
          }
        }
        setState({
          error,
          loading: false,
        });
      })

  }

  return (
    logged()
    ?
      <Redirect to="/"/>
    :
      <Container className="signupContainer">
        <Card  className="signupCard">
          {state.loading
            ? 
              <div className="signupCard" style={{justifyContent: "center"}} >
                <Spinner animation="border" role="status" style={{placeSelf: "center"}} >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            :
              <Form className="signupForm" onSubmit={onSignup}>
                <h3>Log in</h3>
                <FormGroup>
                  <Row style={{margin: "0"}}>
                    <label>Name</label>
                  </Row>
                  <Row style={{margin: "0"}}>
                    <input
                      type="text"
                      className="authInput"
                      value={userCreds.name}
                      onChange={(event)=>{
                        const value = event.target.value;
                        setUserCreds((prevState)=>({
                        ...prevState,
                        name: value,
                      }))}}
                    />
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row style={{margin: "0"}}>
                    <label>Email Address</label>
                  </Row>
                  <Row style={{margin: "0"}}>
                    <input
                      type="text"
                      className="authInput"
                      value={userCreds.email}
                      onChange={(event)=>{
                        const value = event.target.value;
                        setUserCreds((prevState)=>({
                        ...prevState,
                        email: value,
                      }))}}
                    />
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row style={{margin: "0"}}>
                    <label>Password</label>
                  </Row>
                  <Row style={{margin: "0"}}>
                  <input
                      type="password"
                      className="authInput"
                      value={userCreds.password}
                      onChange={(event)=>{
                        const value = event.target.value;
                        setUserCreds((prevState)=>({
                        ...prevState,
                        password: value,
                      }))}}
                    />
                  </Row>
                </FormGroup>
                <FormGroup className="checkInput">
                  <input 
                    type="checkbox"
                    value={userCreds.persist}
                    onClick={(event)=>{
                      const value = event.target.checked;
                      setUserCreds((prevState)=>({
                        ...prevState,
                        persist: value,
                      }))
                    }
                    }/>
                  <label>Remember me</label>
                </FormGroup>
                <Button type="submit" className="authButton">Signup</Button>
                {state.error.message
                  ?
                    <p className="subtext errorMessage">{state.error.message}</p>
                  :
                    <></>
                }
                <p className="subtext">
                  Already have an account?
                  <a href="/login"> Click here to log in!</a>
                </p>
              </Form>
          }
        </Card>
      </Container>
  );
};

export default Signup;