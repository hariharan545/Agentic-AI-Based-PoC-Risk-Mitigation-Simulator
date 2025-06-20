import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Analyzing... please wait.</p>
        </div>
    );
};

export default Loader; 