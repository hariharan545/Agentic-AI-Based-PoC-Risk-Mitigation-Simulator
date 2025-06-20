import React from 'react';

type ReportDisplayProps = {
  report: any;
};

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  if (!report) return null;
  return (
    <div style={{ marginTop: 24 }}>
      <h2>PoC Report</h2>
      <pre style={{ background: '#f4f4f4', padding: 16, borderRadius: 8 }}>
        {JSON.stringify(report, null, 2)}
      </pre>
    </div>
  );
};

export default ReportDisplay; 