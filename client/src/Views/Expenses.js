import React from 'react';
import { Container, Button } from 'react-bootstrap'

import '../Styles/Home.css'

import CategoryBarModify from '../Components/CategoryBarModify';

const Expenses = () => {

  return (
    <Container className="bodyContainer">
      <h1>Expenses</h1>
      <CategoryBarModify/>
      <Button className="addNewButton" href='/expenses'>
        <h3>Add new Expense</h3>
      </Button>
    </Container>
  );
};

export default Expenses;