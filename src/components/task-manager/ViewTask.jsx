import React from 'react'

function Viewtask({taskView}) {

  // console.log(taskView)

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h6>Activity Name : {taskView?.activity_name}</h6>
            <p>Location : {taskView?.location} </p>
            <p>Notes : {taskView?.notes} </p>
            <p>Status : {taskView?.status} </p>
          </div>
          <div className="col-md-6">
            Map goes here
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7903434035857!2d36.787101!3d-1.3006549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109b8af13d0b%3A0xbdeb9a77aa4d971d!2sPrestige%20Plaza%20Shopping%20Mall!5e0!3m2!1sen!2ske!4v1679570038539!5m2!1sen!2ske" className='w-100' loading="lazy" referrerPolicy="no-referrer-when"></iframe>
          </div>
        </div>
      </div>
    </>
  )
}

export default Viewtask