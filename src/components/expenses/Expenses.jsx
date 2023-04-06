import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import Modal from '../../shared/Modal/Modal'
import ModalButton from '../../shared/Modal/modal-button/ModalButton'
import ModalIcon from '../../shared/Modal/modal-button/ModalIcon'
import Export from '../../shared/table/Export'
import Table from '../../shared/table/Table'
import { SuccessAlert, ValidationAlert } from '../../utils/alerts'
import AddExpenses from './AddExpenses'
import FilterExpenses from './FilterExpenses'
import UpdateExpenses from './UpdateExpenses'
import ViewExpenses from './ViewExpenses'

function Expenses() {

    const [selectedValue, setSelectedValue] = useState(new Date(), []);
    const [expenses, setExpenses] = useState([])
    const [expenseView, setExpenseView] = useState({});
    const [updateExpense, setUpdateExpense] = useState({});
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFilter = () => {
        setLoading(true);
        console.log(selectedValue[0])

        const params = new URLSearchParams({
            rep_id: user.client_id,
            startDate: selectedValue[0] !== undefined ?  selectedValue[0].toISOString().slice(0, 10) : ' ',
            endDate: selectedValue[0] !== undefined ?  selectedValue[1].toISOString().slice(0, 10) : ' ',
        }).toString();

        axios
            .post(`${process.env.REACT_APP_API_URL}/total-expenses?${params}`)
            .then((response) => {
                if (response.data.status === false) {
                    ValidationAlert(response.data.status_message);
                } else {

                    // Alert Message success
                    SuccessAlert(response.data.status_message);
                    setExpenses(response.data.data)

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

    const navigate = useNavigate();

    // Dates
    const newDate = new Date();

    useEffect(() => {
        getExpenses();
    }, [getExpenses])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getExpenses() {
        const params = new URLSearchParams({
            rep_id: user.client_id,
            start_date: newDate.toDateString(),
        }).toString()
        axios
            .get(`${process.env.REACT_APP_API_URL}/fetch-expenses?${params}`)
            .then((response) => {
                setExpenses(response.data.data)
                console.log(response.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    const ViewExpensesById = (id) => {
        // Axios API for View Expenses
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-expense?expense_id=${id}`)
            .then((res) => {
                // console.log(res.data.data)
                setExpenseView(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
    }
    const deleteExpense = (id) => {
        //Axios API delete Expenses
        axios
            .get(`${process.env.REACT_APP_API_URL}/delete-expense?id=${id}`)
            .then((res) => {
                if (res.data.status === true) {
                    SuccessAlert(res.data.status_message)
                    navigate('/expenses');
                }
                console.log(res.data)
                setExpenses(expenses.filter(item => item.id !== id))
            }).catch((err) => {
                console.log(err)
            })

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
            Cell: ({ cell, row }) => {
                return (
                    <div>
                        {row.index + 1}
                    </div>
                );
            },
        },
        {
            Header: 'Receipt Name',
            accessor: 'activity_name',
            style: tableStyles.style,
            minWidth: 200,
        },
        {
            Header: 'Receipt Amount',
            accessor: 'amount',
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
            Header: 'Receipt Date',
            accessor: 'scheduled_date',
            style: tableStyles.style,
            minWidth: 200,
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: ({ cell }) => {
                return (
                    <div>
                        <span tabIndex="0" data-toggle="tooltip" title="View Expense">
                            <ModalIcon
                                target="viewEx"
                                label={<i className="fa fa-eye text-info me-2">
                                </i>
                                }
                                onClick={() => {
                                    ViewExpensesById(cell.row.original.id)
                                }}
                            />
                        </span>


                        <span tabIndex="0" data-toggle="tooltip" title="Edit Task">
                            <ModalIcon
                                target="editEx"
                                label={<i className="fa fa-edit text-success me-2">
                                </i>
                                }
                                onClick={() => {
                                    setUpdateExpense(cell.row.original)
                                }}
                            />
                        </span>


                        <span onClick={() => deleteExpense(cell.row.original.id)} style={{ cursor: 'pointer' }}>
                            <i className="fa fa-trash action text-danger"></i>
                        </span>
                    </div>
                );
            },
        }
    ]



    return (
        <>
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6">
                        {/* Start Add Member Button */}
                        <ModalButton
                            target="expense"
                            label={<span><i className="fa fa-plus-circle me-2">
                            </i>Add Expenses</span>
                            }
                        />
                        {/* End Add Member Button */}
                        <button className='btn btn-info text-white mb-5 me-0 ms-3' type="button" onClick={handleShow}>{<span><i className="fa fa-plus-circle me-2">
                        </i>Filter Expenses</span>}</button>
                    </div>
                    <div className="col-md-6">
                        {/* Export Data Button */}
                        <Export data={expenses} label="Expenses" disabled={expenses < 1}/>
                        {/* End Export Data Button */}
                    </div>
                </div>

                <div className="table-responsive">
                    <div className="row">
                        <div className="col-md-12">
                            <Table
                                columns={columns}
                                data={ expenses }
                                padeIndex={0}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Add Expenses */}
            <Modal className='modal-lg' id="expense" label='Add Expenses'>
                <AddExpenses />
            </Modal>

            {/* Modal View Expenses */}
            <Modal id="viewEx" label='View Expenses'>
                <ViewExpenses expenseView={expenseView} />
            </Modal>

            {/* Modal View Expenses */}
            <Modal id="editEx" label='View Expenses'>
                <UpdateExpenses updateExpense={updateExpense} />
            </Modal>

            {/* Filter Expenses */}
            <FilterExpenses
                filterExpenses={setExpenses}
                show={show}
                handleClose={handleClose}
                handleFilter={handleFilter}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                loading={loading} />

        </>
    )
}

export default Expenses