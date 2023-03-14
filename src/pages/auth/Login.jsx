import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/auth-context';
import { SuccessAlert, ValidationAlert } from '../../utils/alerts';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  // user state
  const { user } = useAuth()

  // if user exist redirect to homepage
  if (user) {
    return <Navigate to={'/dashboard'} replace />
  }

  // onsubmit function
  const onSubmitHandler = (event) =>{
    event.preventDefault()
    // turn on loading
    setLoading(true);

    const params = new URLSearchParams({
      phone: email,
      password: password
    }).toString()
    
    axios
    .get(`${process.env.REACT_APP_API_URL}/login?${params}`)
    .then((res)=>{

      if (res.data.status === false) {
        // turn off loading
        setLoading(false);

        // set validation alert
        ValidationAlert(res.data.status_message)
      }else{
        // turn off loading
        setLoading(false);

        console.log(res.data)

        SuccessAlert(res.data.status_message)

        // direct to otp while transmitting data
        navigate('/otp',{ state : res.data } );
      }

    }).catch((err) => {
        // turn off loading
        setLoading(false);
        // setError(err);
        console.log(err)
    })
  }


    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                    <h2 className='text-center'>Pharmacorp</h2>
                </div>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Form className="pt-3" onSubmit={(event) => onSubmitHandler(event)}>
                  <Form.Group className="d-flex search-field mb-2">
                    <Form.Control type="email" placeholder="Email Address" size="lg" className="h-auto"
                    onChange={(event) =>  setEmail(event.target.value)}  />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="Password" size="lg" className="h-auto" 
                    onChange={(event) =>  setPassword(event.target.value)} />
                  </Form.Group>
                  <div className="mt-3">
                  <button 
                        type="submit" 
                        className='btn btn-info w-100'
                        disabled={loading ? true: false}>
                        {loading ? <Spinner color={'#fff'}/> : 'LOGIN'}</button>
                  </div>    
                  <div className="text-center mt-4 font-weight-light">
                    Don't have an account? <Link to="/auth/sign-up" className="text-info">Create</Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
}


export default Login
