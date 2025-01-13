import React from 'react';
import '../styles/home.css';

const Features = () => {
    const features = [
        { title: 'Seamless Communication', description: 'Chat with teachers and students easily.' },
        { title: 'Track Your Progress', description: 'View lessons, subjects, and personalized learning paths.' },
        { title: 'Professional Dashboard', description: 'Manage classrooms and assignments with ease.' },
    ];

    return (
        <section className="features">
            <h2>Why Choose Eduverse?</h2>
            <div className="feature-grid">
                {features.map((feature, index) => (
                    <div className="feature-item" key={index}>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
