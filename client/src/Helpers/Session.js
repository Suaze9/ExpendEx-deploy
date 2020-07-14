
export const setToken = (token, name, budget, persist)=>{
  if(persist){
    localStorage.setItem('persist', 'true');
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('budget', budget);
  }else{
    localStorage.setItem('persist', 'false');
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('budget', budget);
  }
  sessionStorage.setItem('logged', 'true');
}

export const removeToken = () =>{ 
  const persist = localStorage.getItem('persist')
  if(persist && persist === 'true'){
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('budget');
    localStorage.setItem('persist', 'false');
  }else{
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('budget');
  }
  sessionStorage.setItem('logged', 'false');
}

export const getToken = () =>{
  let token = null;
  const persist = localStorage.getItem('persist')
  if(persist && persist === 'true'){
    token = localStorage.getItem('token');
  }else{
    token = sessionStorage.getItem('token');
  }
  return token;
}


export const restoreSession = () =>{
  let token = null;
  const persist = localStorage.getItem('persist')
  if(persist && persist === 'true'){
    token = localStorage.getItem('token');
  }else{
    token = sessionStorage.getItem('token');
  }
  return token;
}

export const logged = () =>{
  const logged = sessionStorage.getItem('logged');
  return logged && logged === 'true';  
}

export const getName = () => {
  let name = '';
  if(logged()){
    const persist = localStorage.getItem('persist')
    if(persist && persist === 'true'){
      name = localStorage.getItem('name') ? localStorage.getItem('name') : '';
    }else{
      name = sessionStorage.getItem('name') ? sessionStorage.getItem('name') : '';
    }
  }
  return name;
}

export const getBudget = () => {
  let budget = '';
  if(logged()){
    const persist = localStorage.getItem('persist')
    if(persist && persist === 'true'){
      budget = localStorage.getItem('budget') ? localStorage.getItem('budget') : '';
    }else{
      budget = sessionStorage.getItem('budget') ? sessionStorage.getItem('budget') : '';
    }
  }
  return budget;
}