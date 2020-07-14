import React, { useState, useEffect } from 'react';
import { Accordion, Card, Spinner, Button } from 'react-bootstrap';
import { getTotalNested, postType, postCategory, deleteCategory, deleteType } from '../Helpers/API';

import '../Styles/CategoryBar.css';
import ExpenseTypeModal from './ExpenseTypeModal';

const CategoryBarModify = () => {

  const [state, setState] = useState({
    data: {},
    error: false,
    loading: true,
  });

  const [ modalType, setModalType ] = useState({
    isOpen: false,
    type: {},
  });

  const [input, setInput] = useState('')

  const toggleType = () => setModalType((prevState)=>({
    ...prevState,
    isOpen: !prevState.isOpen,
  }));
  const resetType = ()=>{
    toggleType();
    console.log("reset");
  }
  const openType = (type)=>{
    setModalType(()=>({
      type,
      isOpen: true,
    }))
  }

  useEffect(()=>{
    getTotalNested("month")
      .then((res)=>{
        setState({
          data: res.data,
          error: false,
          loading: false,
        });
      })
      .catch((err)=>{
        setState({
          data: {},
          error: true,
          loading: false,
        });
      });
  }, []);

  const newCategory = () =>{
    postCategory(input)
      .then((res)=>{
        const catList = state.data.categories;
        catList.push({...res.data.category, types: []});
        setState((prevState)=>({
          ...prevState,
          data: {
            ...prevState.data,
            categories: catList,
          }
        }))
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const newType = (cat, index, name) =>{
    postType(cat, name)
      .then((res)=>{
        const catList = state.data.categories;
        const categ = catList[index];
        categ.types.push({...res.data.expenseType, expenses: []})
        catList[index] = categ;
        setState((prevState)=>({
          ...prevState,
          data: {
            ...prevState.data,
            categories: catList,
          }
        }))
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const deleteCat = (id) => {
    deleteCategory(id)
      .then((res)=>{
        window.location.reload();
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  const delType = (id) => {
    deleteType(id)
      .then((res)=>{
        window.location.reload();
      })
      .catch((err)=>{
        console.log(err)
      })
  }

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
                        <Button className="compCost" onClick={()=>{deleteCat(cat.id)}}>Delete</Button>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={index + 2000}>
                        <div className="typeContainer">
                          {cat.types.map((type, ins)=>(
                            <Card className="deepChild" key={type.id} onClick={()=>openType(type)}>
                              <p className="compName" >{type.name}</p>
                              <Button className="compCost"  onClick={()=>delType(type.id)}>Delete</Button>
                              {/* state.data.categories[index].types[ins] */}
                            </Card>
                          ))}
                            <Card className="deepChildCenter" key={`${cat.id}new`}>
                              <input className="compInput" type={"text"} ref={(input)=>{
                                state.data.categories[index].input = input;
                              }}></input>
                              <Button className="compCenter" onClick={()=>{newType(cat.id, index, state.data.categories[index].input.value)}}>New Expense Type</Button>
                            </Card>
                        </div>
                      </Accordion.Collapse>
                    </Card>
                  ))
                }
                <Card className="deepChildCenter" key={`newCategory`}>
                  <input className="compInput" type={"text"} value={input} onChange={(e)=>{
                    setInput(e.target.value);
                  }}/>
                  <Button className="compCenter" onClick={newCategory} >New Category</Button>
                </Card>
                </div>
              </Accordion>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )
    }
  }

  return(
    <>
      <ExpenseTypeModal
        expenseType={modalType.type}
        modal={modalType.isOpen}
        toggleModal={toggleType}
        resetModal={resetType}
      />
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
    </>
  );

};

export default CategoryBarModify;