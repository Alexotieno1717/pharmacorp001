import React, { useEffect, useState } from 'react';
import './App.scss';
import AppRoutes from './AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import { AuthContext } from './context/auth-context';
import Spinner from './shared/Spinner';


const App = () => {

  // set user
  const [ user, setUser ] = useState(null)

  const setCurrentUser = (data)=> {
    setUser(data)
  }

  // spinner
  const [ spinner, setSpinner ] = useState(true); 
  
  useEffect(() => {
    // check for user in local storage
    const userFromJson = JSON.parse(localStorage.getItem('user'))

    // set user if exists in local storage
    if(userFromJson) {
      // set user
      setUser(userFromJson)
    }
    
    // preloading
    setTimeout(()=> setSpinner(false), 2000);
     
  },[])

  // preloading
  if(spinner) {
    return <Spinner />
  }
 


  return (
    <AuthContext.Provider value={{ user, setUser: setCurrentUser }}>
        {/* React Toastify */}
        <ToastContainer limit={1}/>
        <AppRoutes/>
    </AuthContext.Provider>
  );
}

export default App;
