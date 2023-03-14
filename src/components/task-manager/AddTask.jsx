import axios from 'axios'
import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { SuccessAlert, ValidationAlert } from '../../utils/alerts';


function AddTask() {

  const options = ['1-on-1', 'RTD', 'CME']

  const [activity, setActivity] = useState('')
  const [activityType, setActivityType] = useState(options[0])
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false);


  function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);

    const params = new URLSearchParams({
      activity : activity,
      activity_type: activityType,
      rep_id : 18,
      ambassador_id : 19,
      location : location,
      notes : notes,
      scheduled_date: date,
    }).toString()

    axios
    .post(`${process.env.REACT_APP_API_URL}/add-activity?${params}`)
    .then((response) =>{
      if (response.data === false) {
        ValidationAlert(response.data.status_message)
      }
      // turn off loading
      setLoading(false);

      //Alert Message success
      SuccessAlert(response.data.status_message)
       
      // Navigate to Task Manager Table
      window.location.href = '/task-manager';
    }).catch((err) =>{
      // turn off loading
      setLoading(false);
      console.log(err)
    })
  }

  

  return (
    <>
      <div className="container">
        <div className="row">
        {/* <div className="col-md-3"></div> */}
        <div className="col-md-12">
        <form onSubmit={(event) => onSubmitHandler(event)}>
              <div className="form-group">
                  <label htmlFor="">Task Name</label>
                  <input type="text" className="form-control h-auto" placeholder="Task name" onChange={(event) =>  setActivity(event.target.value)} required />
              </div>
              <div className="form-group">
                  <label htmlFor="">Activity Type</label>
                  <select 
                  className="form-control h-auto" 
                  placeholder='select' 
                  value={activityType}
                  onChange={(event) =>  setActivityType(event.target.value)} required>
                    {options.map((value) =>(
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ))}
                  </select>
              </div>
              <div className="form-group">
                  <label htmlFor="">Location</label>
                  <input type="text" className="form-control h-auto" placeholder="Location" onChange={(event) =>  setLocation(event.target.value)} required />
              </div>
              <div className="form-group">
                  <label htmlFor="">Date for the Task</label>
                  <input type="date" className="form-control h-auto" onChange={(event) =>  setDate(event.target.value)} required />
              </div>
              <div className="form-group">
                  <label htmlFor="">Objective</label>
                  <textarea className="form-control" id="objective" rows="4"  onChange={(event) =>  setNotes(event.target.value)} required></textarea>
              </div>
              <div className="form-group">
              <button 
                type="submit" 
                className='btn btn-info w-100'
                disabled={loading ? true: false}>
                {loading ? <Spinner color={'#fff'}/> : 'Create Task'}</button>
              </div>
          </form>
        </div>
        {/* <div className="col-md-3"></div> */}
        </div>
      </div>
    </>
  )
}

export default AddTask