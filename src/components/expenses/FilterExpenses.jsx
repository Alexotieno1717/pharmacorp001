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
						className="mx-auto"
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="dark" onClick={handleClose} disabled={loading===true}>
						 {loading === true ? <Spinner color={'#fff'} /> : 'Close'}
					</Button>
					<Button variant="info" onClick={handleFilter} disabled={loading===true}>
						 {loading === true ? <Spinner color={'#fff'}/> : 'Filter'}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default FilterExpenses;
