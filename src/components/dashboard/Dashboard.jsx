import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import Export from '../../shared/table/Export';
import Table from '../../shared/table/Table';

function Dashboard(){
  //Task State 
  const [tasks, setTasks] = useState([])
  const [value, onChange] = useState(new Date());

  // user state
  const { user } = useAuth();

  // use effect to fetch content on page mount
  useEffect(() => {
    const getActivity = () =>{

        // axios fetch all task
        axios
        .get(`${process.env.REACT_APP_API_URL}/fetch-activities`)
        .then((response) => {
            // console.log(response.data.activities)
            setTasks(response.data.activities)
        }).catch((err) =>{
            console.log(err)
        })
    }
    
  getActivity();
}, [])


const chooseStatusType = () =>{
  // alert('Choose Status')
 
}



// Table styles
const tableStyles = {
  style:{
      whiteSpace: 'unset',
      textTransform: 'capitalize',
  }
}

// Table
const columns = [
  {
      Header: '#',
      accessor: '#',
      Cell: ({row}) => {
          return (
            <div>
              {row.index+1}
            </div>
          );
        },
   },
   {
     Header: 'Activity Name',
     accessor: 'activity_name',
     style: tableStyles.style,
     minWidth: 200,
   },
   {
     Header: 'Ambassador ID',
     accessor: 'ambassador_id',
     style: tableStyles.style,
     minWidth: 200,
   },
   {
     Header: 'Location',
     accessor: 'location',
     style: tableStyles.style,
     minWidth: 200,
   },
   {
     Header: 'Product ID ',
     accessor: 'product_id',
     style: tableStyles.style,
     minWidth: 200,
   },
   {
      Header: "Status",
      accessor: "status",
      Cell: ({cell, row}) => {
        return (
          <div>
                <button 
                className='btn btn-sm btn-inverse-success'
                onClick={() => chooseStatusType()}
                >{cell.row.original.status}</button>
          </div>
        );
      },
  }
]


// is user doesnt exist it will redirect
if (!user) {
  return  window.location.href = '/auth/login';
}


return (
  <div>
    <div className="page-header">
      <h3 className="page-title">
        <span className="page-title-icon bg-gradient-primary text-white mr-2">
          <i className="mdi mdi-home"></i>
        </span> Dashboard </h3>
      <nav aria-label="breadcrumb">
        <ul className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
          </li>
        </ul>
      </nav>
    </div>
    <div className="row">
      <div className="col-md-8">
        <div className="row">
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-danger card-img-holder text-white">
              <div className="card-body">
                <img src={require("../../assets/images/dashboard/circle.png")} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Monthly Expenses <i className="mdi mdi-chart-line mdi-24px float-right"></i>
                </h4>
                <h2 className="mb-5">$ 15,0000</h2>
                <h6 className="card-text">Increased by 60%</h6>
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-info card-img-holder text-white">
              <div className="card-body">
                <img src={require("../../assets/images/dashboard/circle.png")} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Todays Revists <i className="mdi mdi-bookmark-outline mdi-24px float-right"></i>
                </h4>
                <h2 className="mb-5">20 / 45</h2>
                <h6 className="card-text">45 total patients</h6>
              </div>
            </div>
          </div>
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-success card-img-holder text-white">
              <div className="card-body">
                <img src={require("../../assets/images/dashboard/circle.png")} className="card-img-absolute" alt="circle" />
                <h4 className="font-weight-normal mb-3">Completed Task <i className="mdi mdi-diamond mdi-24px float-right"></i>
                </h4>
                <h2 className="mb-5">95,5741</h2>
                <h6 className="card-text">Your rate in completing task 5.5%</h6>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      {/* Calendar */}
      <div className="col-md-4">
        <Calendar onChange={onChange} value={value} />
        {/* <DatePicker inline selected={dateTime}  onChange={handleChange()}/> */}
      </div>
    </div>
    
    <div className="row">
      <div className="col-12 grid-margin mt-4">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
            <div className="row mb-3">
                <div className="col-md-6">
                  <h4 className="mt-3">Today's Tasks</h4>
                </div>
                <div className="col-md-6">
                    {/* Export Data Button */}
                    <Export data={tasks} label="Tasks" disabled={tasks.length < 1 ? true : false}/>
                    {/* End Export Data Button */}
                </div>
            </div>
              <Table
                  columns={columns} 
                  data={tasks} 
                  padeIndex={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    
  </div> 
);
}

export default Dashboard;