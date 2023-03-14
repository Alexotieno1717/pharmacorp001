import React, { useState } from 'react'
import Calendar from 'react-calendar';
import '../components/calendar/Calendar.scss';



const SettingsPanel = () =>{


  const [value, onChange] = useState(new Date());

  function closeRightSidebar() {
    document.querySelector('.right-sidebar').classList.remove('open');
  }

return (
    <div>
      {/* <div id="settings-trigger"><i className="mdi mdi-settings"></i></div> */}
      <div id="right-sidebar" className="settings-panel right-sidebar">
        <i className="settings-close mdi mdi-close"  onClick={closeRightSidebar}></i>
        <div className="bg-gradient-info p-4" id="uncontrolled-tab-example">
          <h5 className='text-white'>Callendar Shedule</h5>
        </div>
        <div className="col-md-12 mt-3">
          <Calendar onChange={onChange} value={value} />
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
