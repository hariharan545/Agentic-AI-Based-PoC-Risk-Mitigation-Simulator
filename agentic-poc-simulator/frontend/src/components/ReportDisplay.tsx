import React from 'react';

// Mocked agent sections for demonstration
const agentSections = [
  {
    key: 'techStack',
    title: 'Tech Stack Feasibility',
    icon: '🧩',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    key: 'integration',
    title: 'Integration Risk',
    icon: '🔗',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    key: 'budget',
    title: 'Budget & Timeline',
    icon: '💸',
    color: 'from-green-400 to-teal-500',
  },
  {
    key: 'checklist',
    title: 'Pre-Launch Checklist',
    icon: '✅',
    color: 'from-purple-400 to-pink-500',
  },
  {
    key: 'lean',
    title: 'Lean Roadmap',
    icon: '🚀',
    color: 'from-gray-700 to-gray-900',
  },
];

type ReportDisplayProps = {
  report: any;
};

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  if (!report) return null;

  // For demo, assume report is an object with keys matching agentSections
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {agentSections.map((section) => (
        <div
          key={section.key}
          className={`rounded-2xl shadow-lg p-6 bg-gradient-to-br ${section.color} text-white flex flex-col min-h-[200px]`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{section.icon}</span>
            <h3 className="text-xl font-bold">{section.title}</h3>
          </div>
          <div className="flex-1">
            {/* Render section details or fallback */}
            <pre className="bg-white/20 rounded-lg p-3 text-sm mt-2 overflow-x-auto">
              {JSON.stringify(report[section.key] || 'No data', null, 2)}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportDisplay; 