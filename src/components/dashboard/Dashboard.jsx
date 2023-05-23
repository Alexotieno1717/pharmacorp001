import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/auth-context';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import './Dashboard.scss';
import { COMPLETED, REVISIT } from '../../constants';
import TableBig from './TableBig';
import TableSmall from './TableSmall';


function Dashboard() {

  //Task State 
  const [totalExpenses, setTotalExpenses] = useState('');
  const [revisitsStatus, setRevisitsStatus] = useState({})
  const [completeStatus, setCompleteStatus] = useState({})

  // user state
  const { user } = useAuth();

  const currentDay = new Date().toISOString().slice(0, 10)
  // use effect to fetch content on page mount
  useEffect(() => {

    let isMounted = true;
    const intervalId = setInterval(() => {
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
      start_date: currentDay,
      task_status: REVISIT
    }).toString()
    axios.get(`${process.env.REACT_APP_API_URL}/filter-task-status?${params}`)
      .then((res) => {
        if(res.data.status === true) {
          // console.log('getting revisits', res.data)
          setRevisitsStatus(res.data.data)

        }
      }).catch((err) => {
        console.log(err);
      })
  }
  const getCompletedTasks = () => {
    // Axios Fetch total Complete Task

    const params = new URLSearchParams({
      rep_id: user.client_id,
      start_date: currentDay,
      task_status: COMPLETED
    }).toString()
    axios.get(`${process.env.REACT_APP_API_URL}/filter-task-status?${params}`)
      .then((res) => {
        // console.log('getting completed tasks', res.data)
        if(res.data.status === true) {
          // console.log('getting revisits', res.data)        
          setCompleteStatus(res.data.data)
        }

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
        if(response.data.status === true) {
          setTotalExpenses(response.data.total_expenses)

        }
      }).catch((err) => {
        console.log(err)
      })
  }

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
        <div className="tableBigScreen">
          <TableBig />
        </div>
        <div className="tableSmallScreen">
          <TableSmall />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;