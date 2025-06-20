"use client";
const sample = {
  tasks: [
    { task: "API endpoint testing", priority: "High" },
    { task: "UI responsiveness test", priority: "Medium" },
    { task: "Authentication input sanitization", priority: "High" },
    { task: "Load testing with 1K users", priority: "Medium" }
  ]
};
export default function ChecklistReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 py-16">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-pink-800 mb-4">Pre-Launch Checklist</h1>
        <ul className="mb-4">
          {sample.tasks.map((t, i) => (
            <li key={i} className="mb-2 p-3 bg-pink-50 rounded-lg border border-pink-200 flex justify-between items-center">
              <span>{t.task}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.priority === 'High' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{t.priority}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <h2 className="text-lg font-bold text-pink-700 mb-1">Raw Output</h2>
          <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto">{JSON.stringify(sample, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
} 