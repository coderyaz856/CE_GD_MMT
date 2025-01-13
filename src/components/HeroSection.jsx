import React from 'react';
import '../styles/hero.css';

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Welcome to Eduverse</h1>
                <p>Your platform for modern education and collaboration</p>
                <div className="hero-buttons">
                    <button className="btn-primary">Get Started</button>
                    <button className="btn-secondary">Learn More</button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
