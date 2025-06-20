import React from 'react';

const ReportDisplay = ({ report }) => {
    if (!report) return null;

    return (
        <div style={{ textAlign: 'left', marginTop: '20px', whiteSpace: 'pre-wrap' }}>
            <h2>Analysis Report</h2>
            {Object.entries(report).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '15px' }}>
                    <h3 style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</h3>
                    <p>{value}</p>
                </div>
            ))}
        </div>
    );
};

export default ReportDisplay; 