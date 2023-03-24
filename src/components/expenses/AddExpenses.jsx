import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { SuccessAlert, ValidationAlert } from '../../utils/alerts';

function AddExpenses(){

    const [location, setLocation] = useState('')
    const [amount, setAmount] = useState('')
    const [photo, setPhoto] = useState('')
    const [loading, setLoading] = useState(false);


    async function onSubmitHandler(event) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("activity_id", "23");
        formData.append("location", location)
        formData.append("amount", amount);
        formData.append("photo", photo);

       
        await fetch(`${process.env.REACT_APP_API_URL}/add-expense`, {
            method: 'POST',
            body: formData,
        }).then(res=> res.json())
        .then(
            (data) =>{
                if (data.status === false) {
                    ValidationAlert(data.status_message)
                }
                // console.log(data)
                // turn off loading
                setLoading(false);
                //Alert Message success
                SuccessAlert(data.status_message)
                window.location.href = '/expenses';
            },
            // Catch errors
            (error) =>{
                // turn off loading
                setLoading(false);
                console.log(error)
            }
        )
      }

    return (
        <>
            <div className="container-fluid">
                <form onSubmit={(event) => onSubmitHandler(event)}>
                    <div className="row">
                        <div className="col-md-6">
                            Upload Receipt Image

                            <input type="file" accept="image/*" onChange={(event) =>{
                                console.log(event.target.files[0]);
                                setPhoto(event.target.files[0])
                            }} />
                        </div>
                        <div className="col-md-6">
                        <div className="form-group">
                                <label htmlFor="">User Name : Dr. Steve Nyamu</label>
                                <input type="hidden" className="form-control h-auto" placeholder="Task name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Amount:</label>
                                <input type="text" className="form-control h-auto" placeholder="Amount" onChange={(event) => setAmount(event.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Place </label>
                                <input type="text" className="form-control h-auto" placeholder="Location" onChange={(event) => setLocation(event.target.value)} required />
                            </div>
                            <div className="form-group">
                            <button 
                                type="submit" 
                                className='btn btn-info w-100'
                                disabled={loading ? true: false}>
                                {loading ? <Spinner color={'#fff'}/> : 'UPLOAD RECEIPT'}</button>
                            </div>
                        </div>
                        
                    </div>
                </form>
            </div>
            
        </>
    )
}

export default AddExpenses;