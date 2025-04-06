import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTasks, faChartBar, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [seconds, setSeconds] = useState(() => {
        const savedSeconds = localStorage.getItem('seconds');
        return savedSeconds ? JSON.parse(savedSeconds) : 0;
    });
    const [isActive, setIsActive] = useState(() => {
        const savedIsActive = localStorage.getItem('isActive');
        return savedIsActive ? JSON.parse(savedIsActive) : false;
    });

    const navigate = useNavigate();

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    useEffect(() => {
        localStorage.setItem('seconds', JSON.stringify(seconds));
        localStorage.setItem('isActive', JSON.stringify(isActive));
    }, [seconds, isActive]);

    const toggle = () => {
        setIsActive(!isActive);
    };

    const reset = () => {
        setSeconds(0);
        setIsActive(false);
    };

    const formatTime = (seconds) => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    return (
        <div className="home">
            <Navbar title="Home" />
            <div className="content">
                <h2 className="title">MOTIVATION OF THE DAY</h2>
                <div className="motivation">
                    <p>"The only way to achieve the impossible is to believe it is possible."</p>
                </div>
                <div className="study-tracker">
                    <h2 className="title">STUDY TRACKER</h2>
                    <div className="tracker-container">
                        <div className="tracker-details">
                            <div className="form-group">
                                <label htmlFor="purpose">Purpose:</label>
                                <input type="text" id="purpose" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="project-name">Project Name:</label>
                                <input type="text" id="project-name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject:</label>
                                <input type="text" id="subject" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="goal">Goal:</label>
                                <input type="text" id="goal" />
                            </div>
                        </div>
                        <div className="timer">
                            <h3>Timer</h3>
                            <p>{formatTime(seconds)}</p>
                            <button onClick={toggle}>{isActive ? 'Pause' : 'Start'}</button>
                            <button onClick={reset}>Reset</button>
                        </div>
                    </div>
                </div>
                <div className="additional-cards">
                    <div className="card">
                        <button onClick={() => navigate('/calendar')}>
                            <FontAwesomeIcon icon={faCalendarAlt} className="card-icon" />
                        </button>
                        <h3 className='h'>Calendar</h3>
                    </div>
                    <div className="card">
                        <button onClick={() => navigate('/add-task')}>
                            <FontAwesomeIcon icon={faTasks} className="card-icon" />
                        </button>
                        <h3>Add Task</h3>
                    </div>
                    <div className="card">
                        <button onClick={() => navigate('/statistics')}>
                            <FontAwesomeIcon icon={faChartBar} className="card-icon" />
                        </button>
                        <h3>Statistics</h3>
                    </div>
                    <div className="card">
                        <button>
                            <FontAwesomeIcon icon={faClipboardList} className="card-icon" />
                        </button>
                        <h3>Planner</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;