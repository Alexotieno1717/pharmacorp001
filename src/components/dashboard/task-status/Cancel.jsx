import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { SuccessAlert, ValidationAlert } from '../../../utils/alerts';

function Cancel(props) {

    const { user, taskSelected, loading, setLoading, cancelShow, handleCancelClose } = props;

    const [reason, setReason] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true);

        const params = new URLSearchParams({
            activity: taskSelected.activity_name,
            rep_id: user.client_id,
            ambassador_id: taskSelected.ambassador_id,
            location: taskSelected.location,
            notes: reason,
            scheduled_date: taskSelected.scheduled_date,
            id: taskSelected.id,
            status: "4",
        });

        axios.post(`${process.env.REACT_APP_API_URL}/update-activity?${params}`)
            .then((response) => {
                if (response.data.status === false) {
                    ValidationAlert(response.data.status_message);
                } else {
                    // Alert Message success
                    SuccessAlert(response.data.status_message);

                    // Closing modal trigger
                    handleCancelClose()
                }
                setLoading(false);
            }).catch((error) => {
                setLoading(false);

            })
    }

    return (
        <div>
            <Modal show={cancelShow} onHide={handleCancelClose}>
				<Modal.Header closeButton>
					<Modal.Title>Revists Task</Modal.Title>
				</Modal.Header>
				<Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="">Reason:</label>
                            <input
                                type="text"
                                className="form-control h-auto"
                                placeholder="Enter your Reason..."
                                onChange={(event) => setReason(event.target.value)}
                                required
                            />
                        </div>
                    </form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="dark" onClick={handleCancelClose} disabled={loading === true}>
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

export default Cancel;