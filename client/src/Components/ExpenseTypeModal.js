import React, { useEffect, useState } from 'react';

import { Modal, ModalBody, ModalFooter, Table, Button, Form, FormGroup } from 'react-bootstrap'

import { getExpenses, postExpense, deleteExpense } from '../Helpers/API';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';

import '../Styles/CategoryBar.css';

const defaultExpense = {
  filter: "month",
  list: []
}

const ExpenseTypeModal = (props) => {

  const { expenseType, modal, toggleModal, resetModal } = props;
  const [ expenses, setExpense ] = useState(defaultExpense);
  const [ cost, setCost ] = useState('');

  useEffect(()=>{
    if(modal){
      getExpenses('month', expenseType.id)
        .then((res)=>{
          console.log(res.data.expenses)
          setExpense((prevState)=>({...prevState, list: res.data.expenses}));
        })
        .catch((err)=>{
          console.log(err)
        });
    }
  }, [modal, expenseType.id])
  
  const uploadExpense = () => {
    if(cost !== ''){
      postExpense(expenseType.id, cost)
      .then((res)=>{
        const newList = expenses.list;
        newList.push(res.data.expense);
        setExpense((prevState)=>({...prevState, list: newList}));
      })
      .catch((err)=>{
        console.log(err);
      });
    }
  }

  const delExp = (id) => {
    deleteExpense(id)
      .then(()=>{
        window.location.reload();
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  return(
    <Modal
      size="lg"
      show={modal}
      toggle={toggleModal}
      onHide={resetModal}
    >
      <ModalHeader toggle={toggleModal}>{expenseType.name} Expenses</ModalHeader>
      <ModalBody>
        <Table responsive="sm">
          <tr>
            <th>Cost</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
          {expenses && expenses.list
            ? expenses.list.map((exp)=>{
              return(
                <tr>
                  <td>
                    {exp.cost}
                  </td>
                  <td>
                    {new Date(exp.date).toString()}
                  </td>
                  <td>
                    <Button onClick={()=>delExp(exp.id)}>Delete</Button>
                  </td>
                </tr>
              )
            })
            : <p> - </p>
          }
        </Table>
        <Form className="formExpenses" onSubmit={(e)=>{
          e.preventDefault();
          uploadExpense()
        }}>
          <Button className="buttonExp" type="submit">Add new expense</Button>
          <FormGroup className="formGroupM">
            <label className="labelCost">Cost: </label>
            <input className="inputCost" type="number" value={cost} onChange={(event)=>setCost(event.target.value)} />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ExpenseTypeModal;