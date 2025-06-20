"use client";
import React, { useState } from "react";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";

const defaultForm = {
  project: "",
  backend: "",
  frontend: "",
  externalServices: "",
  budget: "",
  timeline: "",
  notes: "",
};

export default function HomePage() {
  const [form, setForm] = useState(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      router.push("/dashboard");
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 pb-20">
      <section className="py-16 text-white text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Submit PoC Strategy</h1>
        <p className="text-xl md:text-2xl mb-8 font-medium drop-shadow">Enter your project details to simulate risk and get recommendations.</p>
      </section>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input type="text" name="project" value={form.project} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="e.g. Remote Health Tracker" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Backend Tech Stack</label>
            <input type="text" name="backend" value={form.backend} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="e.g. Node.js, Express" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frontend Tech Stack</label>
            <input type="text" name="frontend" value={form.frontend} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="e.g. React, Next.js" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">APIs/3rd-Party Services</label>
          <input type="text" name="externalServices" value={form.externalServices} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="e.g. Firebase, Stripe" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="e.g. 30000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
            <input type="text" name="timeline" value={form.timeline} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="e.g. 3 months" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="Integrates with wearable IoT devices" />
        </div>
        <button type="submit" className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200">Submit & Preview</button>
      </form>
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <Loader />
        </div>
      )}
      {submitted && !loading && (
        <div className="max-w-2xl mx-auto mt-10 bg-white/80 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-2 text-indigo-700">Form Data Preview</h2>
          <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-x-auto">{JSON.stringify(form, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
