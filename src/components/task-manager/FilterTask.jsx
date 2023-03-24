import React from "react";
import { Spinner } from "react-bootstrap";
import { Calendar } from "react-calendar";
import { SuccessAlert, ValidationAlert } from "../../utils/alerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function FilterTask({ filterTask, loading, status, setStatus, show, handleClose, handleFilter, selectedValue, setSelectedValue }) {


	return (
		<div>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Filter Task</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Calendar
						selectRange
						onChange={setSelectedValue}
						value={selectedValue}
						className="mx-auto mb-4"
					/>
					<div className="form-group">
						<label htmlFor="">Select Status</label>
						<select
							className="form-control h-auto"
							value={status}
							onChange={(event) => setStatus(event.target.value)}>
							<option value={'1'}>pending</option>
							<option value={'2'}>completed</option>
							<option value={'3'}>revisit</option>
							<option value={'4'}>cancelled</option>
						</select>

					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						 {loading === true ? <Spinner color={'#fff'}/> : 'Close'}
					</Button>
					<Button variant="primary" onClick={handleFilter}>
						 {loading === true ? <Spinner color={'#fff'}/> : 'Filter'}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default FilterTask;
