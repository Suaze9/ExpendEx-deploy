import React from 'react';
import { Container, Button } from 'react-bootstrap'

import '../Styles/Home.css'

import CategoryBarModify from '../Components/CategoryBarModify';

const Expenses = () => {

  return (
    <Container className="bodyContainer">
      <h1>Expenses</h1>
      <CategoryBarModify/>
    </Container>
  );
};

export default Expenses;