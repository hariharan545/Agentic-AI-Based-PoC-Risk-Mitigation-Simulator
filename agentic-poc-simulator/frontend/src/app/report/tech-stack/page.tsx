"use client";
const sample = {
  compatibility: "Good",
  scalability: 8,
  riskScore: "20%",
  warnings: [
    "React 18 not fully optimized with current backend config",
    "Consider updating Axios for better long-term support"
  ]
};
export default function TechStackReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-16">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">Tech Stack Feasibility Report</h1>
        <div className="mb-2"><span className="font-semibold">Compatibility:</span> {sample.compatibility}</div>
        <div className="mb-2"><span className="font-semibold">Scalability:</span> {sample.scalability}/10</div>
        <div className="mb-2"><span className="font-semibold">Risk Score:</span> <span className="text-red-600 font-bold">{sample.riskScore}</span></div>
        <div className="mb-2 font-semibold">Warnings:</div>
        <ul className="list-disc list-inside text-sm text-red-500 mb-2">
          {sample.warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
        <div className="mt-6">
          <h2 className="text-lg font-bold text-indigo-700 mb-1">Raw Output</h2>
          <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto">{JSON.stringify(sample, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
} 