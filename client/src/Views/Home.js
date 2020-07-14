import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap'

import '../Styles/Home.css'

import { getTotal } from '../Helpers/API'
import TotalCard from '../Components/TotalCard';
import CategoryBar from '../Components/CategoryBar';

const Home = () => {

  const [state, setState] = useState({
    data: {},
    error: false,
    loading: true,
  });

  useEffect(()=>{
    getTotal("month")
      .then((res)=>{
        setState({
          data: res.data,
          error: false,
          loading: false,
        });
        console.log(res.data);
      })
      .catch((err)=>{
        setState({
          data: {},
          error: true,
          loading: false,
        });
      });
  }, []);

  return (
    <Container className="bodyContainer">
      <h1>Home</h1>
      <TotalCard state={state}/>
      <CategoryBar/>
      <Button className="addNewButton" href='/expenses'>
        <h3>Manage Expenses</h3>
      </Button>
    </Container>
  );
};

export default Home;