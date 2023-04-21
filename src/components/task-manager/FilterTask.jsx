import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Calendar } from "react-calendar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../../context/auth-context";
import axios from "axios";

function FilterTask({ filterTask, loading, status, setStatus, show, handleClose, handleFilter, selectedValue, setSelectedValue, setActivityType, setProductId }) {

	const [products, setProducts] = useState([])

	const options = ['1-on-1', 'RTD', 'CME']

	// User state
	const { user } = useAuth();

	const fetchProducts = () => {
		axios.get(`${process.env.REACT_APP_API_URL}/fetch-products`)
			.then((res) => {
				setProducts(res.data.data)
				// console.log(res.data)
			}).catch((err) => {
				console.log(err)
			})
	}

	useEffect(()=>{
		fetchProducts()
	},[])

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
							className="form-select h-auto"
							value={status}
							onChange={(event) => setStatus(event.target.value)}>
							<option value={'1'}>pending</option>
							<option value={'2'}>completed</option>
							<option value={'3'}>revisit</option>
							<option value={'4'}>cancelled</option>
						</select>
					</div>
					<div className="form-group">
						<label htmlFor="">Activity Type</label>
						<select
							className="form-select h-auto"
							placeholder='select'
							//value={activityType}
							onChange={(event) => setActivityType(event.target.value)} required>
							{options.map((value) => (
								<option value={value} key={value}>
									{value}
								</option>
							))}
						</select>
					</div>
					<div className="form-group">
						<label htmlFor="">Product</label>
						<select className="form-select h-auto" onChange={(event) => setProductId(event.target.value)} required>
							<option value="" disabled>Select Product</option>
							{products.map((product) => (
								<option key={product.id} value={product.id}>
									{product.name}
								</option>
							))}
						</select>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Close'}
					</Button>
					<Button variant="primary" onClick={handleFilter} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Filter'}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default FilterTask;
