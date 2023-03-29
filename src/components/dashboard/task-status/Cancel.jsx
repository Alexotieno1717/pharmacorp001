import axios from 'axios';
import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { SuccessAlert, ValidationAlert } from '../../../utils/alerts';

function Cancel(props) {

    const { user, taskSelected, loading, setLoading } = props;

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
                }
                setLoading(false);
            }).catch((error) => {
                setLoading(false);

            })
    }

    return (
        <div>
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

                <div className="form-group">
                    <button
                        type="submit"
                        className="btn btn-info w-100"
                        disabled={loading === true}
                    >
                        {loading === true ? <Spinner color={"#fff"} /> : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Cancel;