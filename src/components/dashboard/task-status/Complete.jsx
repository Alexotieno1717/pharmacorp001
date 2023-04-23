import axios from "axios";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { SuccessAlert, ValidationAlert } from "../../../utils/alerts";

function Complete(props) {
	const { user, handleComplete, taskSelected, loading, setLoading } = props;

	const [message, setMessage] = useState("");
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await handleComplete();

		if (response.data.status === false) {
			ValidationAlert(response.data.status_message);
			setLoading(false);
		} else {
			SuccessAlert(response.data.status_message);
			const params = new URLSearchParams({
				activity: taskSelected.activity_name,
				rep_id: user.client_id,
				ambassador_id: taskSelected.ambassador_id,
				location: taskSelected.location,
				notes: message,
				scheduled_date: taskSelected.scheduled_date,
				id: taskSelected.id,
				status: "2",
			});
			axios
				.post(`${process.env.REACT_APP_API_URL}/update-activity?${params}`)
				.then((response) => {
					if (response.data.status === false) {
						ValidationAlert(response.data.status_message);
					} else {
						// Alert Message success
						SuccessAlert(response.data.status_message);
					}
				});
			setLoading(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="">Feedback</label>
					<input
						type="text"
						className="form-control h-auto"
						placeholder="Enter your feedback..."
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="">Message</label>
					<textarea
						name="message"
						onChange={(event) => setMessage(event.target.value)}
						className="form-control h-auto"
						cols="30"
						rows="10"
						placeholder="Enter your message here..."
						required
					></textarea>
				</div>

				<div className="form-group">
					<label htmlFor="">Adoption Ladder</label>
					<input
						type="number"
						className="form-control h-auto"
						max="7"
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

export default Complete;
