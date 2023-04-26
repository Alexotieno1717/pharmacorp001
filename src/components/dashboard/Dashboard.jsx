import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
import ColumnFilter from "../../shared/table/ColumnFilter";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import './Dashboard.scss';
import { ValidationAlert } from '../../utils/alerts';


function Dashboard() {

  const { coords, getPosition, isGeolocationAvailable, isGeolocationEnabled, positionError } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    suppressLocationOnMount: true,
  })

  //Task State 
  const [tasks, setTasks] = useState([])
  const [taskSelected, setTaskSelected] = useState();
  const [totalExpenses, setTotalExpenses] = useState('');
  const [loading, setLoading] = useState(false);
  const [revisitsStatus, setRevisitsStatus] = useState({})
  const [completeStatus, setCompleteStatus] = useState({})
  const [searchInput, setSearchInput] = useState('')

  // Dates
  const newDate = new Date();

  // user state
  const { user } = useAuth();

  const currentDay = new Date().toISOString().slice(0, 10)
  // use effect to fetch content on page mount
  useEffect(() => {
    const getActivity = () => {
      // axios fetch all task
      axios
        .get(`${process.env.REACT_APP_API_URL}/fetch-activities?rep_id=${user.client_id}&start_date=${currentDay}`)
        .then((response) => {
          console.log(response.data.activities)
          if (response.data.status === false) {
            // ValidationAlert(response.data.status_message)
          }else{
            setTasks(response.data.activities)
          }
          
        }).catch((err) => {
          console.log(err)
        })
    }

    let isMounted = true;
    const intervalId = setInterval(() => {
      getActivity();
      getTotalExpenses();
      getRevisitTasks()
      getCompletedTasks()

    }, 5000)
    return () => {
      clearInterval(intervalId)
      isMounted = false
    }
  }, [])

  const getRevisitTasks = () => {
    // Axios Fetch total Revisits

    const params = new URLSearchParams({
      rep_id: user.client_id,
      start_date: newDate,
      task_status: 3
    }).toString()
    axios.get(`${process.env.REACT_APP_API_URL}/filter-task-status?${params}`)
      .then((res) => {
        // console.log('getting revisits', res.data)
        setRevisitsStatus(res.data.data)
      }).catch((err) => {
        console.log(err);
      })
  }
  const getCompletedTasks = () => {
    // Axios Fetch total Complete Task

    const params = new URLSearchParams({
      rep_id: user.client_id,
      start_date: newDate,
      task_status: 2
    }).toString()
    axios.get(`${process.env.REACT_APP_API_URL}/filter-task-status?${params}`)
      .then((res) => {
        // console.log('getting completed tasks', res.data)
        setCompleteStatus(res.data.data)
      }).catch((err) => {
        console.log(err);
      })
  }

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

  // Choose status type without position
  const chooseStatusTypeWithoutPosition = (data) => {
    setTaskSelected(data)
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

  const getButtonColor = (status) => {
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
      Filter: ColumnFilter,
    },
    {
      Header: 'Activity Name',
      accessor: 'activity_name',
      style: tableStyles.style,
      minWidth: 200,
      Filter: ColumnFilter,
    },
    {
      Header: 'HCP Name',
      accessor: 'ambassador_name',
      style: tableStyles.style,
      minWidth: 200,
      Filter: ColumnFilter,
    },
    {
      Header: 'Location',
      accessor: 'location',
      style: tableStyles.style,
      minWidth: 200,
      Filter: ColumnFilter,
    },
    {
      Header: 'Product ID ',
      accessor: 'product_id',
      style: tableStyles.style,
      minWidth: 200,
      Filter: ColumnFilter,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell, row }) => {
        return <div>
          <div className="dropdown">
            {/* eslint-disable-next-line no-restricted-globals */}
            <a className={`btn btn-sm btn-dropdown dropdown-toggle ${getButtonColor(cell.row.original.status)}`}
              href="sss" role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"

            >
              {cell.row.original.status}
              <i className="fas fa-caret-down icon-caret d-none"></i>
            </a>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li className='dropdown-item'
                onClick={() => chooseStatusTypeWithoutPosition(row.original)}>
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
                onClick={() => chooseStatusTypeWithoutPosition(row.original)}>
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
      <div className="page-header page-header-custom">
        <h3 className="page-title">
          Dashboard
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span />Overview <i className="mdi mdi-alert-circle-outline icon-sm text-info align-middle" />
            </li>
          </ul>
        </nav>
      </div>

      {/* Stats Bar */}
      <div className="col-md-12 mb-3">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="card-statistic">
              <div className="icon-stat d-flex">
                <button className='btn btn-icon btn-inverse-info btn-sm btn-rounded'>
                  <i className="mdi mdi-chart-line mdi-24px float-right" />
                </button>
                <div className="content">
                  <h2>{totalExpenses > 1 ? totalExpenses : '0'}</h2>
                  <h4 className='text-muted'>Daily Expenses</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <div className="card-statistic">
              <div className="icon-stat d-flex">
                <button className='btn btn-icon btn-inverse-success btn-sm btn-rounded'>
                  <i className="mdi mdi-bookmark-outline mdi-24px float-right" />
                </button>
                <div className="content">
                  <h2>{revisitsStatus?.total_activities || '0'}</h2>
                  <h4 className='text-muted'>Today's Revisits</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4  mb-md-0">
            <div className="card-statistic">
              <div className="icon-stat d-flex">
                <button className='btn btn-icon btn-inverse-danger btn-sm btn-rounded'>
                  <i className="mdi mdi-diamond mdi-24px float-right"></i>
                </button>
                <div className="content">
                  <h2>{completeStatus?.total_activities || '0'}</h2>
                  <h4 className='text-muted'>Completed Task</h4>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* End Stat bar*/}

      <div className="row">
        <div className="col-12 grid-margin mt-2 mt-md-4">
          <div className="card card-custom">
            <div className="card-body">
              <div className="table-responsive d-grid align-items-start">
                <div className="row mb-3">
                  <div className="d-flex justify-content-between">
                    <div className=" d-flex align-items-start">
                      <h4>Today's Tasks</h4>
                    </div>
                    <div className="d-flex align-items-center justify-content-md-center">
                      <div className="form-group">
                        <label htmlFor="">Filter Activities By Status</label>
                        <select className="form-select h-auto"
                          onChange={(event) => setSearchInput(event.target.value)}>
                          <option value={""} className='cursor-pointer'>All</option>
                          <option value={"pending"} className='cursor-pointer'>Pending</option>
                          <option value={"completed"} className='cursor-pointer'>Complete</option>
                          <option value={"revisit"} className='cursor-pointer'>Revisits</option>
                          <option value={"cancelled"} className='cursor-pointer'>Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="d-none d-md-flex align-items-center justify-content-md-end">
                      {/* Export Data Button */}
                      <Export data={tasks} label="Tasks" disabled={tasks !== undefined ? tasks.length < 1 : false} />
                      {/* End Export Data Button */}
                    </div>

                  </div>
                  <div className="d-flex d-md-none align-items-center justify-content-end">
                    {/* Export Data Button */}
                    <Export data={tasks} label="Tasks" disabled={tasks !== undefined ? tasks.length < 1 : false} />
                    {/* End Export Data Button */}
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-6 flex flex-column mx-auto">
                  {searchInput && (
                    <div className='flex flex-column mx-auto'>
                      {/* <DateRangePicker
                            ranges={[selectionRange]}
                            minDate={new Date()}
                            onChange={handleSelect}
                        /> */}
                    </div>
                  )}
                </div>

                <Table
                  columns={columns}
                  data={tasks.filter((row) =>
                    row.status.includes(searchInput)
                  )}
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