"use client";
const sample = {
  apiRiskSummary: [
    {
      service: "Stripe",
      issue: "Rate limit may be exceeded during traffic spikes",
      mitigation: "Implement exponential backoff or caching"
    },
    {
      service: "Firebase",
      issue: "Realtime DB has usage quota limits",
      mitigation: "Switch to Firestore with caching layer"
    }
  ],
  overallRiskLevel: "Medium"
};
export default function IntegrationReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 py-16">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-orange-800 mb-4">Integration Risk Report</h1>
        <div className="mb-4">
          {sample.apiRiskSummary.map((api, i) => (
            <div key={i} className="mb-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="font-semibold">Service: <span className="text-orange-700">{api.service}</span></div>
              <div>Issue: {api.issue}</div>
              <div>Mitigation: <span className="text-green-700">{api.mitigation}</span></div>
            </div>
          ))}
        </div>
        <div className="mb-2 font-semibold">Overall Risk Level: <span className="text-orange-600 font-bold">{sample.overallRiskLevel}</span></div>
        <div className="mt-6">
          <h2 className="text-lg font-bold text-orange-700 mb-1">Raw Output</h2>
          <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto">{JSON.stringify(sample, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
} 