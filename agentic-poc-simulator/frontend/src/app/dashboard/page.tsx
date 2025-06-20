"use client";
import Link from "next/link";

const dashboardData = [
  {
    title: "Tech Stack Risk",
    value: "20%",
    description: "Compatibility: Good, Scalability: 8/10",
    icon: "🧩",
    color: "from-blue-500 to-indigo-500",
    link: "/report/tech-stack"
  },
  {
    title: "Integration Risk",
    value: "Medium",
    description: "2 API issues detected",
    icon: "🔌",
    color: "from-yellow-400 to-orange-500",
    link: "/report/integration"
  },
  {
    title: "Budget/Timeline Risk",
    value: "$25,000",
    description: "Timeline: 3 months, 2 risk flags",
    icon: "💸",
    color: "from-green-400 to-teal-500",
    link: "/report/budget"
  },
  {
    title: "Pre-Launch Checklist",
    value: "4 Tasks",
    description: "2 High, 2 Medium priority",
    icon: "✅",
    color: "from-purple-400 to-pink-500",
    link: "/report/checklist"
  },
  {
    title: "Lean Roadmap",
    value: "30% Savings",
    description: "Firebase + React + no-code DB",
    icon: "🚀",
    color: "from-gray-700 to-gray-900",
    link: "/report/lean-options"
  }
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-100 to-purple-100 pb-20">
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-indigo-900 drop-shadow-lg">Project Dashboard</h1>
        <p className="text-lg md:text-xl mb-6 font-medium text-indigo-700 drop-shadow">Overview of your PoC risk analysis and recommendations</p>
      </section>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardData.map((card, i) => (
          <div key={i} className={`rounded-2xl shadow-lg p-6 bg-gradient-to-br ${card.color} text-white flex flex-col min-h-[180px] relative overflow-hidden`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-xl font-bold">{card.title}</h3>
            </div>
            <div className="text-4xl font-extrabold mb-2">{card.value}</div>
            <div className="mb-4 text-sm opacity-90">{card.description}</div>
            <Link href={card.link} className="mt-auto inline-block px-4 py-2 bg-white/80 text-indigo-700 font-bold rounded-lg shadow hover:bg-white transition">View Report</Link>
          </div>
        ))}
      </div>
    </div>
  );
} 