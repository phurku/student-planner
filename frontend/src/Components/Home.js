import React from 'react';
import Navbar from './Navbar';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faCalendarAlt, faClipboardList, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const cards = [
        { icon: faTasks, title: 'Add Task', route: '/add-task' },
        { icon: faCalendarAlt, title: 'Schedule', route: '/schedule' },
        { icon: faClipboardList, title: 'Planner', route: '/planner' },
        { icon: faChartBar, title: 'Statistics', route: '/statistics' },
    ];

    return (
        <div className="home">
            <Navbar title="Study Mate" />
            <div className="content">
                {/* Motivation Section */}
                <div className="motivation">
                    <p>"The only way to achieve the impossible is to believe it is possible."</p>
                </div>

                {/* Cards Section */}
                <div className="additional-cards">
                    {cards.map((card, index) => (
                        <div className="card" key={index}>
                            <button onClick={() => navigate(card.route)}>
                                <FontAwesomeIcon icon={card.icon} className="card-icon" />
                            </button>
                            <h3>{card.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;