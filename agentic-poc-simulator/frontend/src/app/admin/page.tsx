"use client";
import React, { useState } from "react";

const mockHistory = [
  { id: 1, project: "AI Risk Simulator", date: "2024-06-01", status: "Completed" },
  { id: 2, project: "Fintech PoC", date: "2024-05-28", status: "Completed" },
  { id: 3, project: "HealthTech MVP", date: "2024-05-20", status: "Failed" },
];

export default function AdminPage() {
  const [enableStressTest, setEnableStressTest] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(70);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 pb-20">
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-indigo-900 drop-shadow-lg">Admin Panel</h1>
        <p className="text-lg md:text-xl mb-6 font-medium text-indigo-700 drop-shadow">Simulation history and configuration</p>
      </section>
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Simulation History Table */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-800">Simulation History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="py-2 px-4 font-semibold">Project</th>
                  <th className="py-2 px-4 font-semibold">Date</th>
                  <th className="py-2 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((row) => (
                  <tr key={row.id} className="border-b last:border-none">
                    <td className="py-2 px-4">{row.project}</td>
                    <td className="py-2 px-4">{row.date}</td>
                    <td className="py-2 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.status === "Completed" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Configuration Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-800">Configuration</h2>
          <div className="flex items-center justify-between">
            <span className="font-medium text-indigo-700">Enable Stress Test</span>
            <button
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${enableStressTest ? "bg-indigo-500" : "bg-gray-300"}`}
              onClick={() => setEnableStressTest((v) => !v)}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${enableStressTest ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>
          <div>
            <label className="block font-medium text-indigo-700 mb-2">Risk Threshold: <span className="font-bold">{riskThreshold}%</span></label>
            <input
              type="range"
              min={0}
              max={100}
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 