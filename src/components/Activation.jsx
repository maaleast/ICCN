// src/components/Activation.js
import React from 'react';

const Activation = ({ setActiveMenu }) => {
    const handleNext = () => {
        setActiveMenu('Dashboard');
    };

    return (
        <div>
            <h1>Activation</h1>
            {/* Activation details */}
            <button type="button" onClick={handleNext}>Back to Dashboard</button>
        </div>
    );
};

export default Activation;
