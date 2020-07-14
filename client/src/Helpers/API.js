const axios = require('axios');

const API = axios.create({
  timeout: 15000,
})

export const setToken = (jwt) => {
  API.defaults.headers.common['auth'] = jwt;
  return;
};

export const getTotal = (filter) => {

  const data = {filter}

  return API.post('/api/stats/total/full', data);

}

export const getTotalNested = (filter) => {

  const data = {filter}

  return API.post('/api/stats/total/nested', data);

}

export const getExpenses = (filter, type) => {
  
  const data = {filter}
  if(type){
    data.type = type;
  }
  
  return API.post('/api/expenses/date', data);
  
}

export const postExpense = (type, cost) => {

  if(!type || !cost){
    return null;
  }
  const data = {type, cost}

  return API.post('/api/expenses/', data);

}

export const postType = (category, name) => {

  if(!category || !name){
    return null;
  }
  const data = {category, name}

  return API.post('/api/expenseTypes/', data);

}

export const postCategory = (name) => {

  if(!name){
    return null;
  }
  const data = {name}

  return API.post('/api/categories/', data);

}

export const deleteExpense = (exp) => {

  if(!exp){
    return null;
  }

  return API.delete(`/api/expenses/p/${exp}`);

}

export const deleteType = (type) => {

  if(!type){
    return null;
  }

  return API.delete(`/api/expenseTypes/p/${type}`);

}

export const deleteCategory = (cat) => {

  if(!cat){
    return null;
  }

  return API.delete(`/api/categories/p/${cat}`);

}

export default API;