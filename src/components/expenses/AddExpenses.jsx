import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { SuccessAlert, ValidationAlert } from '../../utils/alerts';
import { useAuth } from "../../context/auth-context";
import axios from "axios";

function AddExpenses() {

    const [location, setLocation] = useState('')
    const [amount, setAmount] = useState('')
    const [photo, setPhoto] = useState('')
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([])
    const [getActivityId, setGetActivityId] = useState('')

    // State to check Max size of photo uploaded
    const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

    // Fetching user from Context
    const { user } = useAuth();


    async function onSubmitHandler(event) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("activity_id", getActivityId);
        formData.append("location", location)
        formData.append("amount", amount);
        formData.append("photo", photo);


        await fetch(`${process.env.REACT_APP_API_URL_PROXY}/api-proxy/add-expense`, {
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
                        // turn off loading
                        setLoading(false);

                        setTimeout(() => {
                            window.location.href = '/expenses';

                        }, 3000)

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

    const handleFileUpload = (event) => {
        const uploadFile = event.target.files[0]
        if (uploadFile && uploadFile.size <= MAX_FILE_SIZE) {
            console.log(uploadFile)
            setPhoto(uploadFile)
        } else {
            alert(`File size should be less than ${MAX_FILE_SIZE / 1024} KB`);
            event.target.value = null;
            setPhoto('');
        }
    }

    useEffect(() => {
        const getAllActivity = () => {
            axios.get(`${process.env.REACT_APP_API_URL}/fetch-activities?rep_id=${user.client_id}`)
                .then((res) => {
                    setActivities(res.data.activities)
                }).catch((err) => {
                    console.log(err)
                })
        }

        getAllActivity();
    }, [user.client_id])


    return (
        <>
            <div className="container-fluid">
                <form onSubmit={(event) => onSubmitHandler(event)}>
                    <div className="row">
                        <div className="col-md-12 mt-3">
                            <div className="form-group">
                                <label for="formFile" class="form-label">Upload Receipt Image</label>
                                <input type="file" accept="image/*" className='form-control mt-3' onChange={handleFileUpload} placeholder='Choose image' required />
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
                                <label htmlFor="">Activity Type:</label>
                                <select className="form-select h-auto" onChange={(event) => setGetActivityId(event.target.value)} required>
                                    <option value="" disabled>Select Activity type.....</option>
                                    {activities.map((activity) => (
                                        <option key={activity.id} value={activity.id}>
                                            {activity.activity_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Amount:</label>
                                <input type="text" className="form-control h-auto" placeholder="Amount" onChange={(event) => setAmount(event.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Place </label>
                                <input type="text" className="form-control h-auto" placeholder="Location" onChange={(event) => setLocation(event.target.value)} required />
                            </div>
                            <div className="form-group">
                                <button
                                    type="submit"
                                    className='btn btn-info w-100'
                                    disabled={loading}>
                                    {loading ? <Spinner color={'#fff'} /> : 'UPLOAD RECEIPT'}</button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>

        </>
    )
}

export default AddExpenses;