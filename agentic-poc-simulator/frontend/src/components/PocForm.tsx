import React, { useState } from 'react';

type PocFormProps = {
  onSubmit: (form: PocFormState) => void;
  loading: boolean;
};

export type PocFormState = {
  projectName: string;
  description: string;
  budget: string;
  techStack: string;
};

const PocForm: React.FC<PocFormProps> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState<PocFormState>({
    projectName: '',
    description: '',
    budget: '',
    techStack: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Submit PoC Details</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Project Name</label>
        <input
          type="text"
          name="projectName"
          value={form.projectName}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Budget</label>
        <input
          type="text"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Tech Stack</label>
        <input
          type="text"
          name="techStack"
          value={form.techStack}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default PocForm; 