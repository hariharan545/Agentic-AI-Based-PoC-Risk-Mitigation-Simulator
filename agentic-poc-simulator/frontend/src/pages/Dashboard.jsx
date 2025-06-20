import React, { useState } from 'react';
import PocForm from '../components/PocForm';
import ReportDisplay from '../components/ReportDisplay';
import Loader from '../components/Loader';
import api from '../api/axios';

function Dashboard() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError('');
        setReport(null);
        try {
            const response = await api.post('/poc/submit', formData);
            setReport(response.data.data);
        } catch (err) {
            setError('Failed to get report. Please try again.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>PoC Risk Mitigation Simulator</h1>
            <PocForm onSubmit={handleSubmit} disabled={loading} />
            {loading && <Loader />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {report && <ReportDisplay report={report} />}
        </div>
    );
};

export default Dashboard; 