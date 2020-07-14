import React, { useState, useEffect } from 'react';
import { Accordion, Card, Spinner } from 'react-bootstrap';
import { getTotalNested } from '../Helpers/API';

import '../Styles/CategoryBar.css';

const CategoryBar = () => {

  const [state, setState] = useState({
    data: {},
    error: false,
    loading: true,
  });

  useEffect(()=>{
    getTotalNested("month")
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

  const accordions = ()=>{
    if(state.error){
      return(
      <Card>
        Error loading data...
      </Card>)
    }else{
      return(
        <Accordion>
          <Card className="categoryContainerHeader">
            <Accordion.Toggle as={Card.Header} eventKey="0" >
              Categories
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Accordion>
                <div className="categoryContainer">
                {
                  state.data.categories.map((cat, index)=>(
                    <Card key={cat.id}>
                      <Accordion.Toggle className="categoryHeader" as={Card.Header} eventKey={index + 2000}>
                        <p className="compName" >{cat.name}</p>
                        <p className="compCost" >{`Total Expense: ${cat.total}`}</p>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={index + 2000}>
                        <div className="typeContainer">
                          {cat.types.map((type, index)=>(
                            <Card className="deepChild" key={type.id}>
                              <p className="compName" >{type.name}</p>
                              <p className="compCost" >{`Expense: ${type.total}`}</p>
                            </Card>
                          ))}
                        </div>
                      </Accordion.Collapse>
                    </Card>
                  ))
                }
                </div>
              </Accordion>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )
    }
  }

  return(
    <Card  className="expenseCard">
      <h1 className="expenseCardHeader">Expenses</h1>
      {state.loading
        ? 
        <Spinner animation="border" role="status" style={{placeSelf: "center"}} >
          <span className="sr-only">Loading...</span>
        </Spinner>
        :
        <>
          {accordions()}
        </>
      }
    </Card>
  );

};

export default CategoryBar;