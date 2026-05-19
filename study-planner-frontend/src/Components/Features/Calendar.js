import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Navbar from '../Navbar';
import BottomNavBar from '../BottomNavigationBar';
import './calendar.css';

function CalendarComponent() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [eventName, setEventName] = useState('');
    const [eventTime, setEventTime] = useState('');

    const onChange = (newDate) => {
        setDate(newDate);
    };

    const handleAddEvent = () => {
        if (eventName && eventTime) {
            const newEvent = {
                name: eventName,
                time: eventTime,
                date: date.toDateString(),
            };
            setEvents([...events, newEvent]);
            setEventName('');
            setEventTime('');
        } else {
            alert('Please enter both event name and time.');
        }
    };

    return (
        <div className="calendar-container">
            <Navbar title="Calendar" />
           
            <BottomNavBar />
        </div>
    );
}

export default CalendarComponent;