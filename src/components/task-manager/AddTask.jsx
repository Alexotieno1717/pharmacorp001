import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/auth-context';
import { SuccessAlert, ValidationAlert } from '../../utils/alerts';
import '../expenses/UpdateExpenses.scss';


function AddTask({showAddTask, handleTaskClose, onAddTask}) {

  const options = ['1-on-1', 'RTD', 'CME'];
  

  const [activity, setActivity] = useState('')
  const [activityType, setActivityType] = useState(options[0])
  const [productId, setProductId] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState('')
  const [hcpId, setHcpId] = useState('')
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);

  // user state
  const { user } = useAuth();

  const fetchProducts = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/fetch-products`)
      .then((res) => {
        // console.log(res.data.products)
        if(res.data.status === false) {

        } else {
          setProducts(res.data.products)
        }
      }).catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    // Getting the HCP Name
    const fetchClients = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/fetch-clients`)
        .then((res) => {
          setClients(res.data.data)
          // console.log(res.data.data)
        }).catch((err) => {
          console.log(err)
        })
    }

    fetchProducts()
    //fetchClients();

  }, [])

  useEffect(() => {

    const delayFetchingClients = setTimeout(() => {
      setLoading(true)
      axios.get(`${process.env.REACT_APP_API_URL}/fetch-clients?location=${location}`)
        .then((res) => {
          if(res.data.status === true) {
            setClients(res.data.data)
      
          } else {
            ValidationAlert(res.data.status_message)
            setClients([])
          }
          setLoading(false)
        }).catch((err) => {
          console.log(err)
        })
    },1000)
    
    return () => clearTimeout(delayFetchingClients)
  },[location])

  function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);

    const params = new URLSearchParams({
      activity: activity,
      activity_type: activityType,
      rep_id: user?.client_id,
      ambassador_id: hcpId,
      location: location,
      notes: notes,
      scheduled_date: date,
      product_id: productId
    }).toString()

    axios
      .post(`${process.env.REACT_APP_API_URL}/add-activity?${params}`)
      .then((response) => {
        if (response.data.status === false) {
          ValidationAlert(response.data.status_message)

          // turn off loading
          setLoading(false);
          
        } else {

          //Alert Message success
          SuccessAlert(response.data.status_message)

          const newTask = response.data.activity
          
          onAddTask(newTask)

          // turn off loading
          setLoading(false);

          handleTaskClose()
          
        }
      }).catch((err) => {
        console.log(err)
        // turn off loading
        console.log(err)
      })
  }

  return (
    <div>
      <Modal show={showAddTask} onHide={handleTaskClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Task</Modal.Title>
				</Modal.Header>
				<Modal.Body>
          <form className='form'>
                <div className="form-group">
                  <label htmlFor="">Task Name</label>
                  <input type="text" className="form-control h-auto" placeholder="Task name" onChange={(event) => setActivity(event.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="">Activity Type</label>
                  <select
                    className="form-select h-auto"
                    placeholder='select'
                    value={activityType}
                    onChange={(event) => setActivityType(event.target.value)} required>
                    {options.map((value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="">Location</label>
                  <input type="text" className="form-control h-auto" placeholder="Location" disabled={loading} onChange={(event) => setLocation(event.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="">HCP Name</label>
                  <select className="form-select h-auto" onChange={(event) => setHcpId(event.target.value)} required>
                    <option value="">Select Health Care Provider Name.....</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
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
                <div className="form-group">
                  <label htmlFor="">Date for the Task</label>
                  <input type="date" className="form-control h-auto" 
                  onChange={(event) => setDate(event.target.value)} 
                  min={new Date()}
                  required />
                </div>
                <div className="form-group">
                  <label htmlFor="">Objective</label>
                  <textarea className="form-control" id="objective" rows="4" onChange={(event) => setNotes(event.target.value)} required></textarea>
                </div>
          </form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="dark" onClick={handleTaskClose} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Close'}
					</Button>
					<Button variant="info" onClick={onSubmitHandler} disabled={loading === true}>
						{loading === true ? <Spinner color={'#fff'} /> : 'Create Task'}  
					</Button>
				</Modal.Footer>
			</Modal>
    </div>
  )
}

export default AddTask