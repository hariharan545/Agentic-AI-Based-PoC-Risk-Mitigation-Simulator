"use client";
const sample = {
  estimatedCost: {
    devTeam: "$15,000",
    infra: "$8,000",
    apiCosts: "$2,000"
  },
  total: "$25,000",
  timeline: "3 months",
  riskFlags: [
    "Backend development may exceed timeline by 2 weeks",
    "Hosting budget exceeds limit by 15%"
  ]
};
export default function BudgetReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 py-16">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-4">Budget & Timeline Risk Report</h1>
        <div className="mb-2 font-semibold">Estimated Cost Breakdown:</div>
        <ul className="list-disc list-inside text-sm mb-2">
          <li>Dev Team: <span className="font-bold">{sample.estimatedCost.devTeam}</span></li>
          <li>Infra: <span className="font-bold">{sample.estimatedCost.infra}</span></li>
          <li>API Costs: <span className="font-bold">{sample.estimatedCost.apiCosts}</span></li>
        </ul>
        <div className="mb-2"><span className="font-semibold">Total:</span> {sample.total}</div>
        <div className="mb-2"><span className="font-semibold">Timeline:</span> {sample.timeline}</div>
        <div className="mb-2 font-semibold">Risk Flags:</div>
        <ul className="list-disc list-inside text-sm text-red-500 mb-2">
          {sample.riskFlags.map((flag, i) => <li key={i}>{flag}</li>)}
        </ul>
        <div className="mt-6">
          <h2 className="text-lg font-bold text-green-700 mb-1">Raw Output</h2>
          <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto">{JSON.stringify(sample, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
} 