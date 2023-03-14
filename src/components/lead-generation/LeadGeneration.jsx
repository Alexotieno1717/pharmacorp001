import React from 'react'

function LeadGeneration() {
  return (
    <div>
        <div className="col-md-12">
            
            <h6>Lead Generation</h6>
            
            <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th> # </th>
                            <th> Hospital Name </th>
                            <th> Location </th>
                            <th> Action </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td> St. Mary Hospital</td>
                            <td> Langata </td>
                            <td>
                                <i className='fa fa-eye'></i>
                                <i className='fa fa-edit m-3'></i>
                                <i className='fa fa-trash'></i>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td> Nairobi Hospital</td>
                            <td> Kenyatta </td>
                            <td>
                                <i className='fa fa-eye'></i>
                                <i className='fa fa-edit m-3'></i>
                                <i className='fa fa-trash'></i>
                            </td>
                        </tr>
                        
                        
                        </tbody>
                    </table>
            </div>
        </div>
  </div> 
  )
}

export default LeadGeneration