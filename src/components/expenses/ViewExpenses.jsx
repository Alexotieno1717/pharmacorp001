import React from 'react'

function ViewExpenses({expenseView}) {
    const img = `${process.env.REACT_APP_API_URL_PROXY}/image-api-proxy/${expenseView?.expense?.file_path}`
  return (
    <div className='container m-2'>
        <div className="row">
            <div className="col-md-4">
                <img className='w-100' src={img} alt="" />
            </div>
            <div className="col-md-8">
                <p>Receipt Name: {expenseView?.activity?.activity_name}</p>
                <p>Receipt Amount: {expenseView?.expense?.amount}</p>
                <p>Location: {expenseView?.expense?.location}</p>
            </div>
        </div>

{/* http://161.35.6.91/pharmacorp/backend/web/uploads/63e762e9aa8cb.jpeg */}
    </div>
  )
}

export default ViewExpenses