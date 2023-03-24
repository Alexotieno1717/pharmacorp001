import axios from "axios";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { Calendar } from "react-calendar";
import { SuccessAlert, ValidationAlert } from "../../utils/alerts";
import "./UpdateExpenses.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function FilterExpenses({ filterExpenses, loading, show, handleClose, handleFilter, selectedValue, setSelectedValue }) {
	//Range.
	const [status, setStatus] = useState("0");


	return (
		<div>
			{/* <form onSubmit={handleSubmit}>
                <Calendar selectRange onChange={setSelectedValue} value={selectedValue}/> */}
			{/* <select
                    className="form-control h-auto"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}>
                    <options value={'1'}>pending</options>
                    <options value={'2'}>completed</options>
                    <options value={'3'}>revisit</options>
                    <options value={'4'}>cancelled</options>
                </select> */}
			{/* <div className="form-group">
              <button 
                type="submit" 
                className='btn btn-info w-100'
                disabled={loading ? true: false}>
                {loading ? <Spinner color={'#fff'}/> : 'Filter Expenses'}</button>
              </div> */}

			{/* </form> */}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Filter Expenses</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Calendar
						selectRange
						onChange={setSelectedValue}
						value={selectedValue}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleFilter}>
						Filter
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default FilterExpenses;
