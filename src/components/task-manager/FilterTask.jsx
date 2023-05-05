import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Calendar } from "react-calendar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

function FilterTask({ filterTask, loading, status, setStatus, show, handleClose, handleFilter, selectedValue, setSelectedValue, setActivityType, setProductId }) {

	const [products, setProducts] = useState([])

	const options = ['1-on-1', 'RTD', 'CME']

	const fetchProducts = () => {
		axios.get(`${process.env.REACT_APP_API_URL}/fetch-products`)
			.then((res) => {
				if(res.data.status === false) {
		
				} else {
		
				setProducts(res.data.products)
				}
				// console.log(res.data)
			}).catch((err) => {
				console.log(err)
			})
	}

	useEffect(() => {
		fetchProducts()
	}, [])

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
							//value={status}
							onChange={(event) => setStatus(event.target.value)}>
							<option disabled>Select Status</option>
							<option defaultChecked>All</option>
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
							<option disabled>Select Activity Type</option>
							<option defaultChecked>All</option>
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
							<option disabled>Select Product</option>
							<option defaultChecked>All</option>
							{products.map((product) => (
								<option key={product.id} value={product.id}>
									{product.name}
								</option>
							))}
						</select>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="dark" onClick={handleClose} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Close'}
					</Button>
					<Button variant="info" onClick={handleFilter} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Filter'}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default FilterTask;
