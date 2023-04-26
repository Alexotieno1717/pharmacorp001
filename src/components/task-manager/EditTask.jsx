import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/auth-context'
import { SuccessAlert, ValidationAlert } from '../../utils/alerts'

function EditTask({ taskEdit, editTask, showUpdatedTask, handleUpdateClose }) {

  const { user } = useAuth()

  const [activity, setActivity] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false);

  const statusNumber = () => {
    if (taskEdit.status === 'revisit') {
      return '3'
    } else if (taskEdit.status === 'pending') {
      return '1'
    } else if (taskEdit.status === 'cancelled') {
      return '4'
    } else if (taskEdit.status === 'completed') {
      return '2'
    } else {
      return '1'
    }
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    //set loading to true
    setLoading(true);

    // Axios Edit task
    const params = new URLSearchParams({
      id: taskEdit?.id,
      activity: activity,
      rep_id: user.client_id,
      ambassador_id: 19,
      location: location,
      notes: notes,
      scheduled_date: date,
      status: statusNumber()
    })

    axios
      .post(`${process.env.REACT_APP_API_URL}/update-activity?${params}`)
      .then((response) => {
        if (response.data.status === false) {
          ValidationAlert(response.data.status_message)
          // turn off loading
          setLoading(false);
        } else {
          // turn off loading
          setLoading(false);

          // Passing the updated task from state
          const getEditedTask = response.data.activity;
          editTask(getEditedTask)

          // Success Alert
          SuccessAlert(response.data.status_message)

          // Close the modal
          handleUpdateClose()

        }
      }).catch((err) => {
        console.log(err)
        // turn off loading
        setLoading(false);
      })
  }

  useEffect(() => {
    setActivity(taskEdit.activity_name)
    setLocation(taskEdit.location)
    setNotes(taskEdit.notes)
    setDate(taskEdit.scheduled_date)
  }, [taskEdit])

  return (
    <div>

      <Modal show={showUpdatedTask} onHide={handleUpdateClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Task</Modal.Title>
				</Modal.Header>
				<Modal.Body>
          <form className='form'>
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
          </form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="dark" onClick={handleUpdateClose} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Close'}
					</Button>
					<Button variant="info" onClick={onSubmitHandler} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Update Task'}  
					</Button>
				</Modal.Footer>
			</Modal>
    </div>
  )
}

export default EditTask