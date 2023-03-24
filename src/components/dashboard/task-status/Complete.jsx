import React from 'react'
import { SuccessAlert, ValidationAlert } from '../../../utils/alerts';

function Complete(props) {
  const {handleComplete} = props

  const handleSubmit = async (event) => {
    event.preventDefault()
    const response = await handleComplete();

    if(response.data.status === false) {
      ValidationAlert(response.data.status_message)
    } else {
      SuccessAlert(response.data.status_message)
    }
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
              <div className="form-group">
                  <label htmlFor="">Feedback</label>
                  <input type="text" className="form-control h-auto" placeholder="Enter your feedback..." required />
              </div>

              <div className="form-group">
                  <label htmlFor="">Message</label>
                  <textarea name="message" className="form-control h-auto" cols="30" rows="10" placeholder="Enter your message here..." required></textarea>
              </div>

              <div className="form-group">
                  <label htmlFor="">Adoption Ladder</label>
                  <input type="number" className="form-control h-auto" max='7' required />
              </div>

              <div className="form-group">
              <button 
                type="submit" 
                className='btn btn-info w-100'>
                Submit</button>
              </div>
          </form>
    </div>
  )
}

export default Complete