import React, {useEffect, useState} from 'react'
import { Spinner } from 'react-bootstrap';
import {ErrorAlert, SuccessAlert, ValidationAlert} from '../../utils/alerts';
import {useAuth} from "../../context/auth-context";
import axios from "axios";

function AddExpenses(){

    const [location, setLocation] = useState('')
    const [amount, setAmount] = useState('')
    const [photo, setPhoto] = useState('')
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([])
    const [getActivityId, setGetActivityId] = useState('')

    // State to check Max size of photo uploaded
    const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

    // Fetching user from Context
    const { user } = useAuth();


    async function onSubmitHandler(event) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("activity_id", getActivityId);
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

      const handleFileUpload = (event) =>{
        const uploadFile = event.target.files[0]
        if (uploadFile && uploadFile.size <= MAX_FILE_SIZE){
            setPhoto(uploadFile)
        }else{
            alert(`File size should be less than ${MAX_FILE_SIZE / 1024} KB`);
            event.target.value = null;
            setPhoto('');
        }
      }

      useEffect(() =>{
          const getAllActivity = () => {
              axios.get(`${process.env.REACT_APP_API_URL}/fetch-activities?rep_id=${user.client_id}`)
                  .then((res) => {
                      console.log(res.data.activities)
                      setActivities(res.data.activities)
                  }).catch((err) =>{
                      console.log(err)
              })
          }

          getAllActivity();
      }, [user.client_id])


    return (
        <>
            <div className="container-fluid">
                <form onSubmit={(event) => onSubmitHandler(event)}>
                    <div className="row">
                        <div className="col-md-6">
                            Upload Receipt Image

                            <input type="file" accept="image/*" className='form-control mt-3' onChange={handleFileUpload} required />

                            {photo && <p className='mt-4'>File name: {photo.name}</p>}
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="form-group">
                                <label htmlFor="">User Name : {user.names}</label>
                                <input type="hidden" className="form-control h-auto" placeholder="Task name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Activity Type:</label>
                                <select className="form-control h-auto" onChange={(event) => setGetActivityId(event.target.value)} required>
                                    <option value="">Select Activity type.....</option>
                                    {activities.map((activity) => (
                                        <option key={activity.id} value={activity.id}>
                                            {activity.activity_name}
                                        </option>
                                    ))}
                                </select>
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
                                disabled={loading}>
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