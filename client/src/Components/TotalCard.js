import React from 'react';
import { Card, Spinner } from 'react-bootstrap'
import '../Styles/Home.css';



import CustomChart from './CustomChart';

const TotalCard = (props) => {

  const { state } = props;

  return (
    <Card  className="totalCard">
      <h1 className="totalCardHeader">Month Summary</h1>
      {state.loading
        ?
        <Spinner animation="border" role="status" style={{placeSelf: "center"}} >
          <span className="sr-only">Loading...</span>
        </Spinner>
        :
        <>
          <CustomChart exps={state.data} />
          <h3 className="subtotal">Total Expense: ${state.data.total}</h3>
        </>
      }
    </Card>
  );
};

export default TotalCard;