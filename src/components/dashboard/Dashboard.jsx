import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/auth-context';
import Modal from '../../shared/Modal/Modal';
import ModalIcon from '../../shared/Modal/modal-button/ModalIcon';
import Export from '../../shared/table/Export';
import Table from '../../shared/table/Table';
import { useGeolocated } from 'react-geolocated';
import Complete from './task-status/Complete';
import Revisits from "./task-status/Revisits";
import Cancel from "./task-status/Cancel";

function Dashboard() {

  const { coords, getPosition, isGeolocationAvailable, isGeolocationEnabled, positionError } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    suppressLocationOnMount: true,
  })

  //Range.
  const [selectedValue, setSelectedValue] = useState(new Date(), []);

  //Task State 
  const [tasks, setTasks] = useState([])
  //const [value, onChange] = useState(new Date());
  const [taskSelected, setTaskSelected] = useState();
  const [totalExpenses, setTotalExpenses] = useState('');
  const [loading, setLoading] = useState(false)

  // user state
  const { user } = useAuth();

  // use effect to fetch content on page mount
  useEffect(() => {
    const getActivity = () => {
      // axios fetch all task
      axios
        .get(`${process.env.REACT_APP_API_URL}/fetch-activities`)
        .then((response) => {
          setTasks(response.data.activities)
        }).catch((err) => {
          console.log(err)
        })
    }

    getActivity();
    getTotalExpenses();
  }, [])

  // Getting total Expenses
  const getTotalExpenses = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/total-expenses?rep_id=${user.client_id}`)
      .then((response) => {
        // console.log(response.data)
        setTotalExpenses(response.data.total_expenses)
      }).catch((err) => {
        console.log(err)
      })
  }


  const chooseStatusType = (data) => {
    setTaskSelected(data)
    getPosition()
  }

  const handleComplete = async () => {

    let response;

    getPosition()

    setLoading(true)
    if (isGeolocationEnabled && isGeolocationAvailable) {

      response = await axios.get(`${process.env.REACT_APP_API_URL}/verify-locale?rep_id=${user.client_id}&activity_id=${taskSelected.id}&lat=${coords.latitude}&long=${coords.longitude}`)
    } else {
      getPosition()
      setLoading(false)

    }
    return response
  }

  const getButtonColor = (status) =>{
    switch (status) {
      case 'completed':
        return "btn-success";

      case 'cancelled':
        return "btn-danger";

      case 'revisit':
        return "btn-info";

      default:
          return "btn-dark";
    }
  }


  // Table styles
  const tableStyles = {
    style: {
      whiteSpace: 'unset',
      textTransform: 'capitalize',
    }
  }

  // Table
  const columns = [
    {
      Header: '#',
      accessor: '#',
      Cell: ({ row }) => {
        return (
          <div>
            {row.index + 1}
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
      Header: 'HCP Name',
      accessor: 'ambassador_name',
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
      Cell: ({ cell, row }) => {
        return <div>
          <div className="dropdown">
            {/* eslint-disable-next-line no-restricted-globals */}
            <a className={`btn btn-sm dropdown-toggle ${getButtonColor(cell.row.original.status)}`}
               href="#" role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"

            >
              {cell.row.original.status}
            </a>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className='dropdown-item'
                onClick={() => chooseStatusType(row.original)}>
                <ModalIcon
                  target="revisits"
                  label={<span className="text-dark">
                    Revisits
                  </span>
                  }
                />
              </li>
              <li className='dropdown-item'
                onClick={() => chooseStatusType(row.original)}>
                <ModalIcon
                  target="complete"
                  label={<span className="text-dark">
                    Complete
                  </span>
                  }
                />
              </li>
              <li className='dropdown-item'
                onClick={() => chooseStatusType(row.original)}>
                <ModalIcon
                  target="cancel"
                  label={<span className="text-dark">
                    Cancel
                  </span>
                  }
                />
              </li>
            </ul>
          </div>
        </div>;
      },
    }
  ]


  // is user doesn't exist it will redirect
  if (!user) {
    return window.location.href = '/auth/login';
  }


  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home" />
          </span> Dashboard </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span />Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle" />
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
                  <h4 className="font-weight-normal mb-3">Monthly Expenses <i className="mdi mdi-chart-line mdi-24px float-right" />
                  </h4>
                  <h2 className="mb-5">{totalExpenses}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-info card-img-holder text-white">
                <div className="card-body">
                  <img src={require("../../assets/images/dashboard/circle.png")} className="card-img-absolute" alt="circle" />
                  <h4 className="font-weight-normal mb-3">Today's Revisits <i className="mdi mdi-bookmark-outline mdi-24px float-right" />
                  </h4>
                  <h2 className="mb-5">20 / 45</h2>
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
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* Calendar */}
        <div className="col-md-4">
          <Calendar selectRange onChange={setSelectedValue} value={selectedValue} />
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
                    <Export data={tasks} label="Tasks" disabled={tasks.length < 1} />
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


      {/* Modals for status */}
      <Modal id="complete" label='Complete Task Review'>
        <Complete handleComplete={handleComplete} taskSelected={taskSelected} loading={loading} setLoading={setLoading} user={user} />
      </Modal>
      <Modal id="revisits" label='Revisits Task Review'>
        <Revisits handleComplete={handleComplete} taskSelected={taskSelected} loading={loading} setLoading={setLoading} user={user} />
      </Modal>
      <Modal id="cancel" label='Cancel Task Review'>
        <Cancel handleComplete={handleComplete} taskSelected={taskSelected} loading={loading} setLoading={setLoading} user={user} />
      </Modal>



    </div>
  );
}

export default Dashboard;