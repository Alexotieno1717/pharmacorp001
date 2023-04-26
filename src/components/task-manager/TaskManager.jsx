import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Modal from '../../shared/Modal/Modal';
import AddTask from './AddTask';
import ModalIcon from '../../shared/Modal/modal-button/ModalIcon';
import ViewTask from './ViewTask';
import Table from '../../shared/table/Table';
import Export from '../../shared/table/Export';
import EditTask from './EditTask';
import { SuccessAlert, ValidationAlert } from '../../utils/alerts';
import FilterTask from './FilterTask';
import { useAuth } from '../../context/auth-context';
import DeleteTask from './DeleteTask';

function TaskManager() {
    //Task State 
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [taskView, setTaskView] = useState({});
    const [taskEdit, setTaskEdit] = useState({});
    const [taskDelete, setTaskDelete] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [selectedValue, setSelectedValue] = useState(new Date(), []);
    const [show, setShow] = useState(false);
    const [showDeleteTask, setShowDeleteTask] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showUpdatedTask, setShowUpdatedTask] = useState(false);
    const [productId, setProductId] = useState("");
    const [activityType, setActivityType] = useState('')
    const [searchInput, setSearchInput] = useState('')


    const { user } = useAuth()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDeleteClose = () => setShowDeleteTask(false)
    const handleShowClose = () => setShowDeleteTask(true)

    const handleTaskClose = () => setShowAddTask(false)
    const handleTaskShow = () => setShowAddTask(true)

    const handleUpdateClose = () => setShowUpdatedTask(false)
    const handleUpdateShow = () => setShowUpdatedTask(true)

    const resetFilter = () => setFilteredTasks([])

    const handleFilter = () => {
        setLoading(true);
        console.log(selectedValue[0])

        const params = new URLSearchParams({
            rep_id: user.client_id,
            startDate: selectedValue[0] !== undefined ? selectedValue[0].toISOString().slice(0, 10) : ' ',
            endDate: selectedValue[0] !== undefined ? selectedValue[1].toISOString().slice(0, 10) : ' ',
            task_status: status,
            product_id: productId,
            activity_type: activityType
        }).toString();

        axios
            .get(`${process.env.REACT_APP_API_URL}/filter-task-status?${params}`)
            .then((response) => {
                if (response.data.status === false) {
                    ValidationAlert(response.data.status_message);
                } else {

                    // Alert Message success
                    SuccessAlert(response.data.status_message);
                    setFilteredTasks(response.data.data.activities)

                }
                // turn off loadingoptions[0]
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
        const getActivity = () => {
            // set loading to true
            setLoading(true);

            // axios fetch all task
            axios
                .get(`${process.env.REACT_APP_API_URL}/fetch-activities?rep_id=${user.client_id}`)
                .then((response) => {
                    // console.log(response.data.activities)
                    setTasks(response.data.activities)
                    // set loading to false
                    setLoading(false);
                }).catch((err) => {
                    console.log(err)
                    // set loading to false
                    setLoading(false);
                })
        }

        getActivity();
        viewTask();
    }, [])

    const viewTask = (id) => {
        // Axios API view task
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-activity?activity_id=${id}`)
            .then((res) => {
                // console.log(res.data)
                setTaskView(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    const deleteTask = (id) => {
        // Axios delete tutorial
        axios
            .post(`${process.env.REACT_APP_API_URL}/delete-activity?activity_id=${id}`)
            .then((res) => {
                if (res.data.status === false) {
                    ValidationAlert(res.data.status_message)
                } else {

                    SuccessAlert(res.data.status_message)
                    console.log(res.data)
                    setTasks(tasks.filter(item => item.id !== id))
                }
            }).catch((err) => {
                console.log(err)
            })


    }

    const filterDeleteTask = (task) => setTasks(tasks.filter(item => item.id !== task.id))

    const updateTasks = (task) => {
        setTasks([task, ...tasks])
    }

    const editTask = (updatedTask) =>{
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    }

    // is user doesn't exist it will redirect
    if (!user) {
        return window.location.href = '/auth/login';
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
            Cell: ({ cell, row }) => {
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
                            <span 
                                onClick={handleUpdateShow}
                            >
                                {
                                    <span
                                        onClick={() => {
                                            setTaskEdit(cell.row.original)
                                        }}
                                    >
                                        <i className="fa fa-edit text-success me-2" />
                                    </span>
                                }
                            </span>
                            {/* <ModalIcon
                                target="edit"
                                label={<i className="fa fa-edit text-success me-2">
                                </i>
                                }
                                onClick={() => {
                                    setTaskEdit(cell.row.original)
                                }}
                            /> */}
                        </span>


                        <span onClick={() => {
                            setTaskDelete(cell.row.original)
                            handleShowClose()
                        }} style={{ cursor: 'pointer' }}>
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
                    <div className="col-12 col-md-10 mb-3">
                        <div className="d-flex d-md-none justify-content-between">
                            {/* Start Create Task Button */}
                            <button 
                                className='btn btn-info text-white mb-md-5 me-0 ms-md-3 mb-3 mb-md-0' 
                                type="button"
                                onClick={handleTaskShow}
                            >{
                                <span><i className="fa fa-plus-circle me-2">
                                </i>Create Task</span>
                            }</button>
                            
                            {/* End Create Task Button */}
                            <button className='btn btn-info text-white mb-md-5 me-0 ms-md-3 mb-3 mb-md-0' type="button" onClick={handleShow}>{<span><i className="fa fa-plus-circle me-2">
                            </i>Filter Tasks</span>}</button>
                            <button className={`${filteredTasks.length < 1 ? 'd-none' : ''}  btn btn-outline-primary text-primary mb-0 me-0 ms-3`} type="button" onClick={resetFilter}>{<span><i className="fa fa-plus-circle text-primary me-2">
                            </i>Reset Filter</span>}</button>
                        </div>
                        {/* Start Create Task Button */}
                        <div className="d-none d-md-block">
                            <button 
                                className='btn btn-info text-white me-0 ms-md-3 mb-3 mb-md-0' 
                                type="button" 
                                onClick={handleTaskShow}
                            >
                                {
                                    <span>
                                        <i className="fa fa-plus-circle me-2" />
                                        Create Task
                                    </span>
                                }
                            </button>
                            
                            {/* End Create Task Button */}
                            <button className='btn btn-info text-white me-0 ms-md-3 mb-3 mb-md-0' type="button" onClick={handleShow}>{<span><i className="fa fa-plus-circle me-2">
                            </i>Filter Tasks</span>}</button>
                            <button className={`${filteredTasks.length < 1 ? 'd-none' : ''}  btn btn-outline-primary text-primary mb-5 me-0 ms-3`} type="button" onClick={resetFilter}>{<span><i className="fa fa-plus-circle text-primary me-2">
                            </i>Reset Filter</span>}</button>
                            <form className="form d-inline-block mt-md-3">
                                <div className=" ms-4 input-group">
                                    <input type="text" className="form-control form-control-md" id="searchTask" placeholder="Search a task......." onChange={(event) => setSearchInput(event.target.value)} />
                                    {/* <span className="input-group-text" id="searchTask">&#x1F50D;</span> */}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-12 col-md-2 mb-3 mb-md-0">
                        {/* Export Data Button */}
                        <Export data={filteredTasks.length > 0 ? filteredTasks : tasks} label="Tasks" disabled={tasks.length < 1 ? true : false} />
                        {/* End Export Data Button */}
                    </div>
                </div>

                <div className="table-responsive">
                    <div className="row">
                        <div className="col-md-12">
                            <Table
                                columns={columns}
                                data={filteredTasks.length > 0 ? filteredTasks : tasks.filter((row) =>
                                    row.activity_name.toLowerCase().includes(searchInput) || row.activity_type.toLowerCase().includes(searchInput)  || row.location.toLowerCase().includes(searchInput) || row.product_id.toLowerCase().includes(searchInput)
                                )}
                                padeIndex={0}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AddTask 
                showAddTask={showAddTask}
                handleTaskClose={handleTaskClose}
                onAddTask={updateTasks}
            />

            {/* View Modal */}
            <Modal id="view" label='View a Task'>
                <ViewTask taskView={taskView} />
            </Modal>

            {/* Edit Modal */}
            <EditTask 
                showUpdatedTask={showUpdatedTask}
                handleUpdateClose={handleUpdateClose}
                taskEdit={taskEdit}
                editTask={editTask}
            />

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
                setStatus={setStatus}
                setProductId={setProductId}
                setActivityType={setActivityType} />
            {/* Delete Task */}
            <DeleteTask
                task={taskDelete}
                show={showDeleteTask}
                handleClose={handleDeleteClose}
                loading={loading}
                setLoading={setLoading}
                filterTask={filterDeleteTask} />
        </>
    )
}

export default TaskManager