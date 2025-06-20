'use client';
import React, { useState } from 'react';
import PocForm, { PocFormState } from '../components/PocForm';
import Loader from '../components/Loader';
import ReportDisplay from '../components/ReportDisplay';
import api from '../lib/axios';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (form: PocFormState) => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const response = await api.post('/poc', form);
      setReport(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <PocForm onSubmit={handleSubmit} loading={loading} />
      {loading && <Loader />}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      <ReportDisplay report={report} />
    </div>
  );
};

export default HomePage;
