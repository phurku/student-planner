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
            <div className="calendar-navigation">

                <span>{date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>

            </div>
            <Calendar
                onChange={onChange}
                value={date}
                view="month"
                nextLabel={null}
                prevLabel={null}
                next2Label={null}
                prev2Label={null}
            />
            <div className="selected-date">
                <p>Selected Date: {date.toDateString()}</p>
            </div>
            <div className="add-event">
                <input
                    type="text"
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
                <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                />
                <button onClick={handleAddEvent}>Add Event</button>
            </div>
            <div className="event-list">
                <h3>Events</h3>
                <ul>
                    {events.map((event, index) => (
                        <li key={index}>
                            <strong>{event.date}</strong> - {event.time} - {event.name}
                        </li>
                    ))}
                </ul>
            </div>
            <BottomNavBar />
        </div>
    );
}

export default CalendarComponent;