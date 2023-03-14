import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const events = [
    {
        title: "Big Meeting",
        allDay: true,
        start: new Date(2023, 2, 1),
        end: new Date(2023, 2, 6),
    },
    {
        title: "Vacation",
        start: new Date(2023, 2, 7),
        end: new Date(2023, 2, 10),
    },
    {
        title: "Conference",
        start: new Date(2023, 2, 20),
        end: new Date(2023, 2, 23),
    },
];

function Dashboard(){

  const localizer = momentLocalizer(moment)



return (
    <div>
        <h3>React Calendar</h3>
        <div className="container">
            <div className="col-md-12">
                {/* Calendar */}
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />                
            </div>
        </div>
    </div>
);
}

export default Dashboard;