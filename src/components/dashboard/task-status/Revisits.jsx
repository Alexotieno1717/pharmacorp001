import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { SuccessAlert, ValidationAlert } from '../../../utils/alerts';
import { REVISIT } from '../../../constants';

function Revisits(props) {

    const { user, taskSelected, loading, setLoading, show, handleClose } = props;
    
    const [reason, setReason] = useState("");
    const [rescheduledDate, setRescheduledDate] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault()

        setLoading(true)

        const params = new URLSearchParams({
            activity: taskSelected.activity_name,
            rep_id: user.client_id,
            ambassador_id: taskSelected.ambassador_id,
            location: taskSelected.location,
            notes: reason,
            scheduled_date: rescheduledDate,
            id: taskSelected.id,
            status: REVISIT,
        })

        axios.post(`${process.env.REACT_APP_API_URL}/update-activity?${params}`)
        .then((response) => {
            if (response.data.status === false) {
                ValidationAlert(response.data.status_message);
            } else {
                // Alert Message success
                SuccessAlert(response.data.status_message);

                // Closing the Modal after submitting
                handleClose()
            }
            setLoading(false);

        }).catch((error) => {
            setLoading(false);

        })
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Revists Task</Modal.Title>
				</Modal.Header>
				<Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="">Reason:</label>
                            <input
                                type="text"
                                className="form-control h-auto"
                                placeholder="Enter your Reason..."
                                onChange={(event)=> setReason(event.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="">Reschedule Date:</label>
                            <input type="date" className='form-control h-auto' onChange={(event) => setRescheduledDate(event.target.value)} required/>
                        </div>
                    </form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="dark" onClick={handleClose} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Close'}
					</Button>
					<Button variant="info" onClick={handleSubmit} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Submit'}  
					</Button>
				</Modal.Footer>
			</Modal>
        </div>
    );
}

export default Revisits;