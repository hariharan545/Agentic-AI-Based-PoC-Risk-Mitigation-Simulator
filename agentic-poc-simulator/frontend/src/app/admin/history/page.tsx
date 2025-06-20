"use client";
const sample = [
  {
    project: "HealthSync",
    submittedAt: "2025-06-19",
    status: "Completed",
    reportLink: "/report/123"
  },
  {
    project: "EduBot",
    submittedAt: "2025-06-10",
    status: "Completed",
    reportLink: "/report/124"
  }
];
import Link from "next/link";
export default function AdminHistory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">Simulation History</h1>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-indigo-50">
              <th className="py-2 px-4 font-semibold">Project</th>
              <th className="py-2 px-4 font-semibold">Submitted At</th>
              <th className="py-2 px-4 font-semibold">Status</th>
              <th className="py-2 px-4 font-semibold">Report</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((row, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-2 px-4">{row.project}</td>
                <td className="py-2 px-4">{row.submittedAt}</td>
                <td className="py-2 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.status === "Completed" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{row.status}</span>
                </td>
                <td className="py-2 px-4">
                  <Link href={row.reportLink} className="text-indigo-600 underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 