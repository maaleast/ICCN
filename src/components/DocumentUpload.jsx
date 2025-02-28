// src/components/DocumentUpload.js
import React from 'react';

const DocumentUpload = ({ setActiveMenu }) => {
    const handleNext = () => {
        setActiveMenu('Activation');
    };

    return (
        <div>
            <h1>Document Upload</h1>
            {/* Document upload form */}
            <button type="button" onClick={handleNext}>Next</button>
        </div>
    );
};

export default DocumentUpload;
