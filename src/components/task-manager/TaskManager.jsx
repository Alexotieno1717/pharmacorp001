import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Modal from '../../shared/Modal/Modal';
import ModalButton from '../../shared/Modal/modal-button/ModalButton';
import AddTask from './AddTask';
import ModalIcon from '../../shared/Modal/modal-button/ModalIcon';
import ViewTask from './ViewTask';
import Table from '../../shared/table/Table';
import Export from '../../shared/table/Export';
import EditTask from './EditTask';
import { SuccessAlert, ValidationAlert } from '../../utils/alerts';
import FilterTask from './FilterTask';
import { useAuth } from '../../context/auth-context';

function TaskManager() {
    //Task State 
    const [tasks, setTasks] = useState([])
    const [taskView, setTaskView] = useState({})
    const [taskEdit, setTaskEdit] = useState({})
    const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("1");
    const [selectedValue, setSelectedValue] = useState(new Date(), []);
    const [show, setShow] = useState(false);


    const { user } = useAuth()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFilter = () => {
		setLoading(true);
        console.log(selectedValue[0])

		const params = new URLSearchParams({
			rep_id: user.client_id,
			startDate: selectedValue[0] !== undefined ? selectedValue[0].toISOString().slice(0, 10) : ' ',
			endDate: selectedValue[0] !== undefined ?  selectedValue[1].toISOString().slice(0, 10) : ' ',
            task_status: status
		}).toString();

		axios
			.get(`${process.env.REACT_APP_API_URL}/filter-task-status?${params}`)
			.then((response) => {
				if (response.data.status === false) {
					ValidationAlert(response.data.status_message);
				} else {

                    // Alert Message success
                    SuccessAlert(response.data.status_message);
                    setTasks(response.data.data)

                }
				// turn off loading
				setLoading(false);

                // close modal
                setShow(false)
			})
			.catch((err) => {
				// turn off loading
				setLoading(false);

                // close modal
                setShow(false)
				console.log(err);
			});
    }
    


    // const [pageCount, setPageCount] = useState(0);

    // use effect to fetch content on page mount
    useEffect(() => {
        const getActivity = () =>{
            // set loading to true
            setLoading(true);

            // axios fetch all task
            axios
            .get(`${process.env.REACT_APP_API_URL}/fetch-activities`)
            .then((response) => {
                // console.log(response.data.activities)
                setTasks(response.data.activities)
                // set loading to false
                setLoading(false);
            }).catch((err) =>{
                console.log(err)
                // set loading to false
                setLoading(false);
            })
        }
        
      getActivity();
      viewTask(); 
    }, [])

    const viewTask = (id) =>{
        // Axios API view task
        axios
        .get(`${process.env.REACT_APP_API_URL}/get-activity?activity_id=${id}`)
        .then((res) => {
            // console.log(res.data)
            setTaskView(res.data.data)
        }).catch((err) =>{
            console.log(err)
        })
    }

    const deleteTask = (id) =>{
        // Axios delete tutorial
        axios
        .post(`${process.env.REACT_APP_API_URL}/delete-activity?activity_id=${id}`)
        .then((res) => {
            if (res.data.status === false) {
                ValidationAlert(res.data.status_message)
            }
                SuccessAlert(res.data.status_message)
                console.log(res.data)
            setTasks(tasks.filter(item => item.id !== id))
        }).catch((err) =>{
            console.log(err)
        })
    
        
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
            Header: 'Activity Type',
            accessor: 'activity_type',
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
            Header: "Actions",
            accessor: "actions",
            Cell: ({cell, row}) => {
              return (
                <div>
                    <span tabIndex="0" data-toggle="tooltip" title="View Task">
                        <ModalIcon 
                            target="view"
                            label={<i className="fa fa-eye text-info me-2">
                                </i>
                            }
                            onClick={() => {
                                viewTask(cell.row.original.id)
                            }}
                        />
                    </span>
                    

                    <span tabIndex="0" data-toggle="tooltip" title="Edit Task">
                        <ModalIcon 
                            target="edit"
                            label={<i className="fa fa-edit text-success me-2">
                                </i>
                            }
                            onClick={() => {
                                setTaskEdit(cell.row.original)
                            }} 
                        />
                    </span>

        
                  <span onClick={() => deleteTask(cell.row.original.id)} style={{cursor: 'pointer'}}>
                    <i className="fa fa-trash action text-danger"></i>
                  </span>
                </div>
              );
            },
        }
    ]

    

  return (
    <>
        <div className="col-md-12 ">
            <div className="row">
                <div className="col-md-6">
                    {/* Start Add Member Button */}
                    <ModalButton 
                        target="task"
                        label={<span><i className="fa fa-plus-circle me-2">
                            </i>Create Task</span>
                        }
                    />
                    {/* End Add Member Button */}
                        <button className='btn btn-info text-white mb-5 me-0 ms-3' type="button" onClick={handleShow}>{<span><i className="fa fa-plus-circle me-2">
                        </i>Filter Tasks</span>}</button>
                </div>
                <div className="col-md-6">
                    {/* Export Data Button */}
                    <Export data={tasks} label="Tasks" disabled={tasks.length < 1 ? true : false}/>
                    {/* End Export Data Button */}
                </div>
           </div>
            
            <div className="table-responsive">
                <div className="row">
                    <div className="col-md-12">
                        <Table
                            columns={columns} 
                            data={tasks} 
                            padeIndex={0}
                        />
                    </div>
                </div>
            </div>
        </div>
        <Modal id="task" label='Create a Task'>
            <AddTask />
        </Modal>  
        <Modal id="view" label='View a Task'>
            <ViewTask taskView={taskView} />
        </Modal> 
        <Modal id="edit" label='Edit a Task'>
            <EditTask taskEdit={taskEdit} />
        </Modal>
        {/* Filter Task */}
        <FilterTask
            filterTask={setTasks}
            show={show} 
            handleClose={handleClose}
            handleFilter={handleFilter}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            loading={loading}
            status={status}
            setStatus={setStatus}/> 
    </> 
  )
}

export default TaskManager