import React, { useState, useEffect } from 'react';
import './App.css';
import DesignGenerator from './components/DesignGenerator';
import DesignEditor from './components/DesignEditor';
import DesignLibrary from './components/DesignLibrary';
import axios from 'axios';

function App() {
  const [view, setView] = useState('home');
  const [currentDesign, setCurrentDesign] = useState(null);
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      const response = await axios.get('/api/designs');
      setDesigns(response.data);
    } catch (error) {
      console.error('Error loading designs:', error);
    }
  };

  const handleDesignGenerated = (design) => {
    setCurrentDesign(design);
    setView('editor');
  };

  const handleDesignSaved = async (design) => {
    try {
      if (design.id) {
        await axios.put(`/api/designs/${design.id}`, design);
      } else {
        await axios.post('/api/designs', design);
      }
      await loadDesigns();
      alert('Design saved successfully!');
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Failed to save design');
    }
  };

  const handleDesignSelected = (design) => {
    setCurrentDesign(design);
    setView('editor');
  };

  const handleDeleteDesign = async (id) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await axios.delete(`/api/designs/${id}`);
        await loadDesigns();
        alert('Design deleted successfully!');
      } catch (error) {
        console.error('Error deleting design:', error);
        alert('Failed to delete design');
      }
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎨 Graphic Design Studio</h1>
        <nav className="nav-menu">
          <button 
            className={view === 'home' ? 'active' : ''} 
            onClick={() => setView('home')}
          >
            New Design
          </button>
          <button 
            className={view === 'library' ? 'active' : ''} 
            onClick={() => setView('library')}
          >
            My Designs
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'home' && (
          <DesignGenerator onDesignGenerated={handleDesignGenerated} />
        )}

        {view === 'editor' && currentDesign && (
          <DesignEditor 
            design={currentDesign} 
            onSave={handleDesignSaved}
            onBack={() => setView('home')}
          />
        )}

        {view === 'library' && (
          <DesignLibrary 
            designs={designs}
            onSelectDesign={handleDesignSelected}
            onDeleteDesign={handleDeleteDesign}
          />
        )}
      </main>
    </div>
  );
}

export default App;

