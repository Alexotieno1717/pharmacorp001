import React, { useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap';
import { SuccessAlert, ValidationAlert } from '../../utils/alerts';
import './UpdateExpenses.scss';

function UpdateExpenses({ updateExpense, showExpenseEdit, handleExpenseEditClose, onEditExpense }) {
    const [location, setLocation] = useState('')
    const [amount, setAmount] = useState('')
    const [photo, setPhoto] = useState('')
    const [loading, setLoading] = useState(false);
    const img = `${process.env.REACT_APP_API_URL_PROXY}/image-api-proxy/${updateExpense?.file_path}`



    const onSubmitHandler = async (event) => {
        event.preventDefault();
        //set loading to true
        setLoading(true);

        // API Edit Expenses
        const formData = new FormData();
        formData.append("id", updateExpense?.id)
        formData.append("location", location)
        formData.append("amount", amount);
        formData.append("photo", photo);

        await fetch(`${process.env.REACT_APP_API_URL}/update-expense?`, {
            method: 'POST',
            body: formData,
        }).then(res => res.json())
            .then(
                (data) => {
                    if (data.status === false) {
                        ValidationAlert(data.status_message)
                        // turn off loading
                        setLoading(false);
                    } else {
                        //Alert Message success
                        SuccessAlert(data.status_message)

                        const newExpense = data.expense;
                        onEditExpense(newExpense);
                        console.log("getting state expenses", newExpense)

                        // console.log("getting formData", formData)


                        //close modal
                        handleExpenseEditClose();

                        // turn off loading
                        setLoading(false);

                    }
                },
                // Catch errors
                (error) => {
                    // turn off loading
                    setLoading(false);
                    console.log(error)
                }
            )
    }


    return (
        <div>

            <Modal show={showExpenseEdit} onHide={handleExpenseEditClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Task</Modal.Title>
				</Modal.Header>
				<Modal.Body>
                    <form className='form'>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                Uploaded Receipt Image
                                <img className='w-100 pt-3' src={img} alt="" />
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="receipt-image" className='form-label'>Receipt Image</label>
                                    <div className="dropzone">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className='form-control upload-input'
                                            onChange={(event) => {
                                                setPhoto(event.target.files[0])
                                            }} />
                                    </div>
                                </div>
                                {photo &&
                                    <div
                                        style={{
                                            backgroundImage: `url(${URL.createObjectURL(photo)})`,
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            width: "100px",
                                            height: "80px",
                                            padding: "10px",
                                            marginRight: "15px",
                                            marginBottom: "15px",
                                            borderRadius: "4px",
                                        }}
                                    >
                                    </div>}
                                <div className="form-group">
                                    <label htmlFor="">Amount:</label>
                                    <input
                                        type="text"
                                        className="form-control h-auto"
                                        placeholder="Amount"
                                        defaultValue={updateExpense.amount}
                                        onChange={(event) => setAmount(event.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Place </label>
                                    <input
                                        type="text"
                                        className="form-control h-auto"
                                        placeholder="Location"
                                        defaultValue={updateExpense.location}
                                        onChange={(event) => setLocation(event.target.value)} />
                                </div>
                                {/* <div className="form-group">
                                    <button
                                        type="submit"
                                        className='btn btn-info w-100'
                                        disabled={loading ? true : false}>
                                        {loading ? <Spinner color={'#fff'} /> : 'UPDATE RECEIPT'}</button>
                                </div> */}
                            </div>

                        </div>
                    </form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="dark" onClick={handleExpenseEditClose} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Close'}
					</Button>
					<Button variant="info" onClick={onSubmitHandler} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'UPDATE RECEIPT'}  
					</Button>
				</Modal.Footer>
			</Modal>
        </div>
    )
}

export default UpdateExpenses