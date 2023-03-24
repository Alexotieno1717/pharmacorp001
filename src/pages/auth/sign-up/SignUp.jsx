import axios from 'axios';
import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { SuccessAlert } from '../../../utils/alerts';

function SignUp() {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userName, SetUserName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    // on submit function
    const onSubmitHandler =(event)=>{
        event.preventDefault();
        setLoading(true);
        setError(null);

        const params = new URLSearchParams ({
            first_name: firstName,
            last_name: lastName,
            username: userName,
            email: email,
            phone: phoneNumber,
            password: password,
        }).toString()

        axios
        .post(`${process.env.REACT_APP_API_URL}/sign-up?${params}`)
        .then((res)=>{
            // turn off loading
            setLoading(false);

            setError(res.data.status_message)

            console.log(res.data)
            console.log(`${process.env.REACT_APP_API_URL}/sign-up?${params}`)
            SuccessAlert(res.data.status_message)

            // direct to login
            navigate('/auth/login');
        }).catch((err) => {
            // turn off loading
            setLoading(false);
            setError(err);
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
                    <h2 className="text-center">Rep Connect</h2>
                </div>
                <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
                <form className="pt-3" onSubmit={(event) => onSubmitHandler(event)}>
                  <div className="form-group">
                    <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    id="first_name" placeholder="First Name" 
                    onChange={(event) =>  setFirstName(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    id="last_name" placeholder="Last Name" 
                    onChange={(event) =>  setLastName(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    id="username" placeholder="Username" 
                    onChange={(event) =>  SetUserName(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <input type="email" className="form-control form-control-sm" id="email" placeholder="Email" onChange={(event) =>  setEmail(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control form-control-sm" id="phone" placeholder="phone Number" onChange={(event) =>  setPhoneNumber(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-sm" id="password" placeholder="Password" onChange={(event) =>  setPassword(event.target.value)} />
                  </div>
                  <div className="mb-4">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" />
                        <i className="input-helper"></i>
                        I agree to all Terms & Conditions
                      </label>
                    </div>
                  </div>
                  <button 
                        type="submit" 
                        className='btn btn-info w-100'
                        disabled={loading ? true: false}>
                        {loading ? <Spinner color={'#fff'}/> : 'Create Account'}</button>
                  <div className="text-center mt-4 font-weight-light">
                    Already have an account? <Link to="/auth/login" className="text-info">Login</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default SignUp