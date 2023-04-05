import axios from 'axios';
import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import OTPInput from '../../shared/form/OTPInput.jsx';
import { ErrorAlert, SuccessAlert, ValidationAlert } from '../../utils/alerts';

function OTP() {

    // location
    const location = useLocation()

    // get data from url
    const data = (location.state ? location.state : null)

    // user context
    const { setUser } = useAuth()

    // otp input
    const [otp, setOtp] = useState('')

    //loading state
    const [loading, setLoading] = useState(false);

    // if there's no client navigate back to log in
    if (!data) {
        return <Navigate to={'/auth/login'} replace />;
    }

    // onsubmit function
    const onSubmitHandler = (event) =>{
        event.preventDefault();

        // Set loading state to true
        setLoading(true);

        const number = data.data.msisdn.replace('+', '')

        const params = new URLSearchParams({
            totp: otp,
            phone: number
        }).toString()

        axios
        .get(`${process.env.REACT_APP_API_URL}/verify-otp?${params}`)
        .then((response) => {
            if(response.data.status === false) {
                // turn off loading
                setLoading(false);
                
                // set validation alert
                ValidationAlert(response.data.status_message)

            } else {
                // turn off loading
                setLoading(false);

                // show success alert
                SuccessAlert();

                const userToSave = {
                    client_id: data.data.id,
                    names: data.data.names,
                    email: data.data.email,
                    msisdn: data.data.msisdn,
                    username: data.data.username,
                }
                // set user
                setUser(userToSave)
    
                // save on localstorage
                localStorage.setItem('user', JSON.stringify(userToSave))

                // direct to dashboard
                window.location.href = '/';

            }
        })
        // catch errors
        .catch((err) => {
            // turn off loading
            setLoading(false);
            ErrorAlert(err)
        });

    }


  return (
    <div className='bg-white'>
        <section className="row">
            <div className="col-12 col-md-6 vh-100 d-flex flex-column align-items-center justify-content-center">
                <img src={ require("../../assets/images/otp.jpg") } className='w-100' alt="otp" />
            </div>

            {/* Form Start */}
            <div className="col-12 col-md-6 vh-100 d-flex flex-column align-items-center justify-content-center">
                <h4>One Time Password</h4>
                <p className="mb-5">Enter The OTP You Have Received On Your Phone</p>
                <h4>{data.data.msisdn}</h4>
                <form className="form-auth" onSubmit={(event) => onSubmitHandler(event)}>
                {/* otp input */}
                <div className="mb-3">
                    <OTPInput
                        autoFocus
                        length={4}
                        onChangeOTP={(otp) => setOtp(otp)}
                        className="otpContainer"
                        inputClassName="otpInput"
                        placeholder="."/>
                </div>
                {/* submit button */}
                <button disabled={loading ? true: false} type="submit" className="btn btn-info w-100">{loading ? <Spinner color={'#fff'}/> : 'Submit'}</button>
                {/* link to sign in */}
                <div className="mt-5 text-center">
                    <Link to="/" className="text-info text-decoration-none">Have An Account? Click Here To Sign In</Link>
                </div>
                </form>
            </div>
            {/* Form End */}
        </section>
    </div>
  )
}

export default OTP