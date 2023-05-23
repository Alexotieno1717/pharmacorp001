import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth-context';
import ColumnFilter from '../../shared/table/ColumnFilter';
import Table from '../../shared/table/Table';
import Complete from './task-status/Complete';
import Revisits from './task-status/Revisits';
import Cancel from './task-status/Cancel';
import { useGeolocated } from 'react-geolocated';
import Export from '../../shared/table/Export';
export default function TableSmall() {

    const { coords, getPosition, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
          enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
        suppressLocationOnMount: true,
      })
    
      //Task State 
      const [tasks, setTasks] = useState([])
      const [taskSelected, setTaskSelected] = useState();
      const [loading, setLoading] = useState(false);
      const [searchInput, setSearchInput] = useState('')
      const [show, setShow] = useState(false);
      const [cancelShow, setCancelShow] = useState(false);
      const [completeShow, setCompleteShow] = useState(false);
    
      // Revists modal trigger
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
    
      // Cancel modal trigger
      const handleCancelClose = () => setCancelShow(false);
      const handleCancelShow = () => setCancelShow(true);
    
      // Cancel modal trigger
      const handleCompleteClose = () => setCompleteShow(false);
      const handleCompleteShow = () => setCompleteShow(true);
    
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
              if(response.data.status === false) {
                  // ValidationAlert(response.data.status_message)
              } else {
                setTasks(response.data.activities)
    
              }
            }).catch((err) => {
              console.log(err)
            })
        }
    
        let isMounted = true;
        const intervalId = setInterval(() => {
          getActivity();
    
        }, 5000)
        return () => {
          clearInterval(intervalId)
          isMounted = false
        }
      }, [])
    
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
          case 'disapproved':
            return "btn-secondary";
    
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
                <span 
                  onClick={handleShow}
                >
                    {
                        <span>
                          Revisits
                        </span>
                    }
                </span>
              </li>
              <li className='dropdown-item'
                onClick={() => chooseStatusType(row.original)}>
                <span 
                  onClick={handleCompleteShow}
                >
                    {
                        <span>
                          Complete
                        </span>
                    }
                </span>
              </li>
              <li className='dropdown-item'
                onClick={() => chooseStatusTypeWithoutPosition(row.original)}>
                <span 
                  onClick={handleCancelShow}
                >
                    {
                        <span>
                          Cancel
                        </span>
                    }
                </span>
              </li>
            </ul>
          </div>
        </div>;
      },
    }
  ]

  return (
    <div>
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
                        {/* <label htmlFor="">Filter Activities By Status</label> */}
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

                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                  <Table
                    columns={columns}
                    data={tasks?.filter((row) =>
                      row.status.includes(searchInput)
                    )}
                    padeIndex={0}
                  />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      {/* Modals for status */}
      <Complete handleComplete={handleComplete} taskSelected={taskSelected} loading={loading} setLoading={setLoading} user={user} completeShow={completeShow} handleCompleteClose={handleCompleteClose} />
      {/* modal revists */}
      <Revisits handleComplete={handleComplete} taskSelected={taskSelected} loading={loading} setLoading={setLoading} user={user} show={show} handleClose={handleClose} />
      {/* Cancel */}
      <Cancel handleComplete={handleComplete} taskSelected={taskSelected} loading={loading} setLoading={setLoading} user={user} cancelShow={cancelShow} handleCancelClose={handleCancelClose} />

    </div>
  )
}