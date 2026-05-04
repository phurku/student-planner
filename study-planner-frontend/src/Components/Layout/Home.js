import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faCalendarAlt, faClipboardList, faChartBar, faBell, faCheckCircle, faBolt, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import motivationImage from '../../assets/image';

const TIPS = [
  'Break big tasks into smaller 25-minute focus blocks.',
  'Review your schedule every morning to stay on track.',
  'Log completed tasks — momentum builds motivation.',
  'Use Statistics weekly to spot patterns in your study time.',
];

function Home() {
    const navigate = useNavigate();
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTipIndex(prev => (prev + 1) % TIPS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const features = [
        {
            icon: faTasks,
            title: 'Add Task',
            route: '/add-task',
            detail: 'Create, name, and prioritise any study task in seconds.',
            color: '#2f80a3',
        },
        {
            icon: faCalendarAlt,
            title: 'Schedule',
            route: '/planner',
            detail: 'Block out focused study sessions on your personal calendar.',
            color: '#1f5f78',
        },
        {
            icon: faClipboardList,
            title: 'Planner',
            route: '/planner',
            detail: 'See all your pending and completed tasks in one clean view.',
            color: '#266c89',
        },
        {
            icon: faChartBar,
            title: 'Statistics',
            route: '/statistics',
            detail: 'Visualise your progress with weekly charts and summaries.',
            color: '#205a73',
        },
    ];

    const steps = [
        { icon: faBolt,        num: '01', label: 'Sign up & set your goals' },
        { icon: faTasks,       num: '02', label: 'Add your study tasks' },
        { icon: faCalendarAlt, num: '03', label: 'Schedule your sessions' },
        { icon: faCheckCircle, num: '04', label: 'Track progress & celebrate' },
    ];

    const stats = [
        { value: '4', label: 'Core Features' },
        { value: '∞', label: 'Tasks You Can Add' },
        { value: '7', label: 'Days of Scheduling' },
        { value: '100%', label: 'Free to Use' },
    ];

    return (
        <>
            <Navbar isHomePage={true} />
            <div className="home">

                {/* ── Hero ── */}
                <section className="h-hero">
                    <div className="h-hero-text">
                        <span className="h-badge">
                            <FontAwesomeIcon icon={faStar} className="h-badge-icon" />
                            Your Study Dashboard
                        </span>
                        <h1 className="h-hero-title">
                            Study Smarter,<br />Not Harder.
                        </h1>
                        <p className="h-hero-sub">
                            Study Mate keeps your tasks, schedule, and progress in one place so you can focus on what actually matters.
                        </p>
                        <div className="h-hero-btns">
                            <button className="h-btn-primary" onClick={() => navigate('/add-task')}>
                                Get Started Free
                            </button>
                            <button className="h-btn-ghost" onClick={() => navigate('/planner')}>
                                Open Planner
                            </button>
                        </div>
                    </div>
                    <div className="h-hero-visual">
                        <img src={motivationImage} alt="Study visual" className="h-hero-img" />
                        <div className="h-tip-card">
                            <FontAwesomeIcon icon={faBell} className="h-tip-icon" />
                            <p key={tipIndex} className="h-tip-text">{TIPS[tipIndex]}</p>
                        </div>
                    </div>
                </section>

                {/* ── Stats Banner ── */}
                <section className="h-stats-bar">
                    {stats.map((s, i) => (
                        <div className="h-stat" key={i}>
                            <span className="h-stat-value">{s.value}</span>
                            <span className="h-stat-label">{s.label}</span>
                        </div>
                    ))}
                </section>

                {/* ── Features ── */}
                <section className="h-section">
                    <div className="h-section-header">
                        <h2>Everything you need</h2>
                        <p>Four powerful tools, one place.</p>
                    </div>
                    <div className="h-features">
                        {features.map((f, i) => (
                            <button
                                key={i}
                                className="h-feature-card"
                                onClick={() => navigate(f.route)}
                                style={{ '--card-accent': f.color, animationDelay: `${i * 0.1}s` }}
                                aria-label={`Go to ${f.title}`}
                            >
                                <div className="h-feature-icon-wrap">
                                    <FontAwesomeIcon icon={f.icon} />
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.detail}</p>
                                <span className="h-feature-arrow">→</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── How it works ── */}
                <section className="h-section h-how">
                    <div className="h-section-header">
                        <h2>How it works</h2>
                        <p>Up and running in four easy steps.</p>
                    </div>
                    <div className="h-steps">
                        {steps.map((s, i) => (
                            <div className="h-step" key={i}>
                                <div className="h-step-num">{s.num}</div>
                                <div className="h-step-icon">
                                    <FontAwesomeIcon icon={s.icon} />
                                </div>
                                <p>{s.label}</p>
                                {i < steps.length - 1 && <div className="h-step-line" aria-hidden="true" />}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA Banner ── */}
                <section className="h-cta">
                    <h2>Ready to take control of your studies?</h2>
                    <p>Join to plan better with Study Mate.</p>
                    <button className="h-btn-primary" onClick={() => navigate('/add-task')}>
                        Start Adding Tasks
                    </button>
                </section>

            </div>
        </>
    );
}

export default Home;
