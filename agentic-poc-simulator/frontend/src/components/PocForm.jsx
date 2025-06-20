import React, { useState } from 'react';

const PocForm = ({ onSubmit, disabled }) => {
    const [formData, setFormData] = useState({
        description: '',
        techStack: '',
        budget: '',
        timeline: '',
        concerns: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Project Description"
                required
            />
            <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                required
            />
            <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Estimated Budget (e.g., $50,000)"
            />
            <input
                type="text"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="Estimated Timeline (e.g., 3 months)"
            />
            <textarea
                name="concerns"
                value={formData.concerns}
                onChange={handleChange}
                placeholder="Specific Concerns (e.g., scalability, security)"
            />
            <button type="submit" disabled={disabled}>
                {disabled ? 'Analyzing...' : 'Analyze PoC'}
            </button>
        </form>
    );
};

export default PocForm; 