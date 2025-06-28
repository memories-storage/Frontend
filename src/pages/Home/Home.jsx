import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import './Home.css';

const Home = () => {
  const [counter, setCounter] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second to show dynamic updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Let's Code</h1>
          <p>Your platform for collaborative coding and project development</p>
          
          {/* Dynamic counter section */}
          <div className="dynamic-demo">
            <h3>Live Updates Demo</h3>
            <p>Current Time: {currentTime.toLocaleTimeString()}</p>
            <p>Counter: {counter}</p>
            <div className="counter-buttons">
              <Button 
                variant="primary" 
                size="medium"
                onClick={() => setCounter(counter + 1)}
              >
                Increment
              </Button>
              <Button 
                variant="secondary" 
                size="medium"
                onClick={() => setCounter(counter - 1)}
              >
                Decrement
              </Button>
              <Button 
                variant="outline" 
                size="medium"
                onClick={() => setCounter(0)}
              >
                Reset
              </Button>
            </div>
          </div>
          
          <div className="hero-actions">
            <Button variant="primary" size="large">
              Get Started
            </Button>
            <Button variant="outline" size="large">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <h2>Why Choose Let's Code?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Collaborative Development</h3>
              <p>Work together with team members in real-time</p>
            </div>
            <div className="feature-card">
              <h3>Project Management</h3>
              <p>Organize and track your coding projects efficiently</p>
            </div>
            <div className="feature-card">
              <h3>Code Review</h3>
              <p>Get feedback and improve your code quality</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 