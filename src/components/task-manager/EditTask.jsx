import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { SuccessAlert, ValidationAlert } from '../../utils/alerts'

function EditTask({taskEdit}) {
    const [activity, setActivity] = useState('')
    const [location, setLocation] = useState('')
    const [notes, setNotes] = useState('')
    const [date, setDate] = useState('')
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = (event) =>{
        event.preventDefault();
        //set loading to true
        setLoading(true);

        // Axios Edit task
        const params = new URLSearchParams({
            id: taskEdit?.id,
            activity: activity,
            rep_id : 18,
            ambassador_id : 19,
            location : location,
            notes : notes,
            scheduled_date: date
        })
        console.log(params);
        axios
        .post(`${process.env.REACT_APP_API_URL}/update-activity?${params}`)
        .then((response) =>{
          if (response.data.status === false) {
            ValidationAlert(response.data.status_message)
          }
            // turn off loading
            setLoading(false);
            SuccessAlert(response.data.status_message)
            window.location.href = '/task-manager';
        }).catch((err) => {
            console.log(err)
            // turn off loading
            setLoading(false);
        })
    }

    useEffect(()=> {
      setActivity(taskEdit.activity_name)
      setLocation(taskEdit.location)
      setNotes(taskEdit.notes)
      setDate(taskEdit.scheduled_date)
    },[taskEdit])

  return (
    <div>
        <form onSubmit={(event) => onSubmitHandler(event)}>
              <div className="form-group">
                  <label htmlFor="">ID: {taskEdit.id}</label> 
                  <br />
                  <label htmlFor="">Activity Name</label>
                  <input 
                    type="text" 
                    className="form-control h-auto" 
                    placeholder="Activity name" 
                    value={activity}
                    onChange={(event) => setActivity(event.target.value)} />
              </div>
              <div className="form-group">
                  <label htmlFor="">Location</label>
                  <input 
                  type="text" 
                  className="form-control h-auto" 
                  value={location}
                  placeholder="Location" onChange={(event) => setLocation(event.target.value)} />
              </div>
              
              <div className="form-group">
                  <label htmlFor="">Objective</label>
                  <textarea 
                    className="form-control" 
                    id="objective" rows="4"  
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}>
                  </textarea>
              </div>
              <div className="form-group">
                  <label htmlFor="">Rescheduled date</label>
                  <input 
                  type="date" 
                  className="form-control h-auto" 
                  value={date}
                  onChange={(event) => setDate(event.target.value)} />
              </div>
          
            
              <div className="form-group">
              <button 
                type="submit" 
                className='btn btn-info w-100'
                disabled={loading ? true: false}>
                {loading ? <Spinner color={'#fff'}/> : 'Update Task'}</button>
              </div>
          </form>
    </div>
  )
}

export default EditTask