import React from 'react'

function Viewtask({taskView}) {

  // console.log(taskView)

  return (
    <>
      <div className="container">
        <h6>Activity Name : {taskView?.activity_name}</h6>
        <p>Location : {taskView?.location} </p>
        <p>Notes : {taskView?.notes} </p>
        <p>Status : {taskView?.status} </p>
      </div>
    </>
  )
}

export default Viewtask