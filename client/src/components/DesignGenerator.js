import React, { useState } from 'react';
import './DesignGenerator.css';
import { parsePrompt, generateDesign } from '../utils/designParser';

const DesignGenerator = ({ onDesignGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [designType, setDesignType] = useState('business-card');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('Please enter a design prompt');
      return;
    }

    setLoading(true);
    
    // Simulate processing time for AI generation
    setTimeout(() => {
      const parsedData = parsePrompt(prompt, designType);
      const design = generateDesign(parsedData, designType);
      
      setLoading(false);
      onDesignGenerated(design);
    }, 1000);
  };

  const examplePrompts = {
    'business-card': 'Create a modern business card for a tech startup called "InnovateTech". Use blue and white colors. Include the name "John Smith", title "CEO & Founder", phone "(555) 123-4567", email "john@innovatetech.com", and website "www.innovatetech.com". Add a clean, professional logo placeholder.',
    'flyer': 'Design a promotional flyer for a grand opening sale. Title: "Grand Opening - 50% OFF Everything!" Include store name "Fashion Hub", date "October 15, 2025", address "123 Main St, Downtown", and phone "(555) 987-6543". Use bold red and yellow colors with an energetic design.',
    'door-hanger': 'Create a door hanger for a lawn care service called "Green Paradise Lawns". Include services: Mowing, Trimming, Fertilizing. Add phone "(555) 456-7890" and tagline "Your Lawn, Our Passion". Use green and white colors with a nature-inspired design.'
  };

  return (
    <div className="design-generator">
      <div className="generator-card">
        <h2>🚀 Create Your Design</h2>
        <p className="subtitle">
          Paste your AI-generated prompt from Gemini or describe your design below
        </p>

        <div className="form-group">
          <label>Design Type</label>
          <select 
            value={designType} 
            onChange={(e) => setDesignType(e.target.value)}
            className="design-type-select"
          >
            <option value="business-card">Business Card (3.5" × 2")</option>
            <option value="flyer">Flyer (8.5" × 11")</option>
            <option value="door-hanger">Door Hanger (4.25" × 11")</option>
          </select>
        </div>

        <div className="form-group">
          <label>Design Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your design prompt here or describe what you want..."
            rows={8}
            className="prompt-textarea"
          />
        </div>

        <div className="example-prompt">
          <button 
            className="example-btn"
            onClick={() => setPrompt(examplePrompts[designType])}
          >
            📝 Use Example Prompt
          </button>
        </div>

        <button 
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Generating Design...
            </>
          ) : (
            <>✨ Generate Design</>
          )}
        </button>

        <div className="info-box">
          <h3>💡 How It Works</h3>
          <ol>
            <li>Go to Google Gemini and describe your design needs</li>
            <li>Copy the generated prompt and paste it here</li>
            <li>Click "Generate Design" to create your design</li>
            <li>Edit and customize in the visual editor</li>
            <li>Export for VistaPrint or save to your library</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DesignGenerator;

