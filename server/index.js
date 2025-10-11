const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure designs directory exists
const designsDir = path.join(__dirname, 'designs');
if (!fs.existsSync(designsDir)) {
  fs.mkdirSync(designsDir, { recursive: true });
}

// Routes

// Get all designs
app.get('/api/designs', (req, res) => {
  try {
    const designFiles = fs.readdirSync(designsDir)
      .filter(file => file.endsWith('.json'));
    
    const designs = designFiles.map(file => {
      const filePath = path.join(designsDir, file);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    });

    res.json(designs);
  } catch (error) {
    console.error('Error reading designs:', error);
    res.status(500).json({ error: 'Failed to read designs' });
  }
});

// Get a specific design
app.get('/api/designs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(designsDir, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Design not found' });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading design:', error);
    res.status(500).json({ error: 'Failed to read design' });
  }
});

// Save a new design
app.post('/api/designs', (req, res) => {
  try {
    const design = req.body;
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    
    const designData = {
      ...design,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const filePath = path.join(designsDir, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(designData, null, 2));

    res.json(designData);
  } catch (error) {
    console.error('Error saving design:', error);
    res.status(500).json({ error: 'Failed to save design' });
  }
});

// Update an existing design
app.put('/api/designs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const filePath = path.join(designsDir, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Design not found' });
    }

    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updatedData = {
      ...existingData,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    res.json(updatedData);
  } catch (error) {
    console.error('Error updating design:', error);
    res.status(500).json({ error: 'Failed to update design' });
  }
});

// Delete a design
app.delete('/api/designs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(designsDir, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Design not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Error deleting design:', error);
    res.status(500).json({ error: 'Failed to delete design' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

