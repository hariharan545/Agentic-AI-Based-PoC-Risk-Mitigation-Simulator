"use client";
const sample = {
  suggestion: {
    stack: "Firebase + React + no-code DB",
    savings: "30%",
    pros: ["Faster launch", "Lower cost"],
    cons: ["Limited customization", "Scalability concerns"]
  }
};
export default function LeanOptionsReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-green-100 py-16">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Lean Alternative Suggestions</h1>
        <div className="mb-2"><span className="font-semibold">Stack:</span> {sample.suggestion.stack}</div>
        <div className="mb-2"><span className="font-semibold">Estimated Savings:</span> <span className="text-green-600 font-bold">{sample.suggestion.savings}</span></div>
        <div className="mb-2 font-semibold">Pros:</div>
        <ul className="list-disc list-inside text-sm text-green-700 mb-2">
          {sample.suggestion.pros.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
        <div className="mb-2 font-semibold">Cons:</div>
        <ul className="list-disc list-inside text-sm text-red-700 mb-2">
          {sample.suggestion.cons.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-700 mb-1">Raw Output</h2>
          <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto">{JSON.stringify(sample, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
} 