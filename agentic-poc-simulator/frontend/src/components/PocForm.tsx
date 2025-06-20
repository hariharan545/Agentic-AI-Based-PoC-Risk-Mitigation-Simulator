import React, { useState } from 'react';

export type PocFormState = {
  projectName: string;
  description: string;
  budget: string;
  techStack: string;
  services: string;
  timeline: string;
};

type PocFormProps = {
  onSubmit: (form: PocFormState) => void;
  loading: boolean;
};

const PocForm: React.FC<PocFormProps> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState<PocFormState>({
    projectName: '',
    description: '',
    budget: '',
    techStack: '',
    services: '',
    timeline: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8 mt-10 flex flex-col gap-6 border border-gray-200 backdrop-blur"
    >
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Submit PoC Details</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input
            type="text"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="e.g. AI Risk Simulator"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="Describe your PoC strategy..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
          <input
            type="text"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="e.g. $10,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
          <input
            type="text"
            name="techStack"
            value={form.techStack}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="e.g. Node.js, React, MongoDB"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">External Services</label>
          <input
            type="text"
            name="services"
            value={form.services}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="e.g. Stripe, Auth0, AWS S3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
          <input
            type="text"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="e.g. 3 months"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 disabled:opacity-60"
      >
        {loading ? 'Submitting...' : 'Submit & Simulate'}
      </button>
    </form>
  );
};

export default PocForm; 