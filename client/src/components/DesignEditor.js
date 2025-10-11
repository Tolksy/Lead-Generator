import React, { useState, useRef, useEffect } from 'react';
import './DesignEditor.css';

const DesignEditor = ({ design, onSave, onBack }) => {
  const [currentDesign, setCurrentDesign] = useState(design);
  const [selectedElement, setSelectedElement] = useState(null);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    renderDesign();
  }, [currentDesign, selectedElement]);

  const renderDesign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { dimensions, elements } = currentDesign;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale factor for display
    const scale = dimensions.displayWidth / dimensions.width;
    
    // Render each element
    elements.forEach(element => {
      ctx.save();
      
      if (element.opacity) {
        ctx.globalAlpha = element.opacity;
      }
      
      switch (element.type) {
        case 'rectangle':
          ctx.fillStyle = element.fill;
          ctx.fillRect(
            element.x * scale,
            element.y * scale,
            element.width * scale,
            element.height * scale
          );
          break;
          
        case 'circle':
          ctx.fillStyle = element.fill;
          ctx.beginPath();
          ctx.arc(
            element.x * scale,
            element.y * scale,
            element.radius * scale,
            0,
            2 * Math.PI
          );
          ctx.fill();
          break;
          
        case 'text':
          ctx.fillStyle = element.fill;
          const fontSize = (element.fontSize || 16) * scale;
          const fontWeight = element.fontWeight || 'normal';
          const fontFamily = element.fontFamily || 'Arial';
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          
          if (element.textAlign === 'center') {
            ctx.textAlign = 'center';
          } else {
            ctx.textAlign = 'left';
          }
          
          ctx.fillText(element.text, element.x * scale, element.y * scale);
          break;
          
        default:
          break;
      }
      
      // Highlight selected element
      if (selectedElement && selectedElement.id === element.id) {
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        
        if (element.type === 'rectangle') {
          ctx.strokeRect(
            element.x * scale,
            element.y * scale,
            element.width * scale,
            element.height * scale
          );
        } else if (element.type === 'circle') {
          ctx.beginPath();
          ctx.arc(
            element.x * scale,
            element.y * scale,
            element.radius * scale,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        } else if (element.type === 'text') {
          const metrics = ctx.measureText(element.text);
          const height = fontSize;
          ctx.strokeRect(
            element.x * scale - 5,
            element.y * scale - height,
            metrics.width + 10,
            height + 10
          );
        }
        
        ctx.setLineDash([]);
      }
      
      ctx.restore();
    });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const { dimensions, elements } = currentDesign;
    const scale = dimensions.displayWidth / dimensions.width;
    
    // Find clicked element (reverse order to get top element)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (element.locked) continue;
      
      const ex = element.x * scale;
      const ey = element.y * scale;
      
      let hit = false;
      
      if (element.type === 'rectangle') {
        hit = x >= ex && x <= ex + (element.width * scale) &&
              y >= ey && y <= ey + (element.height * scale);
      } else if (element.type === 'circle') {
        const dx = x - ex;
        const dy = y - ey;
        hit = Math.sqrt(dx * dx + dy * dy) <= element.radius * scale;
      } else if (element.type === 'text') {
        const ctx = canvas.getContext('2d');
        const fontSize = (element.fontSize || 16) * scale;
        ctx.font = `${element.fontWeight || 'normal'} ${fontSize}px ${element.fontFamily || 'Arial'}`;
        const metrics = ctx.measureText(element.text);
        hit = x >= ex - 5 && x <= ex + metrics.width + 5 &&
              y >= ey - fontSize && y <= ey + 10;
      }
      
      if (hit) {
        setSelectedElement(element);
        return;
      }
    }
    
    setSelectedElement(null);
  };

  const updateElement = (id, updates) => {
    const newElements = currentDesign.elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    
    setCurrentDesign({
      ...currentDesign,
      elements: newElements
    });
    
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  };

  const handleExport = async () => {
    const canvas = canvasRef.current;
    
    // Create high-res canvas for export
    const exportCanvas = document.createElement('canvas');
    const { dimensions } = currentDesign;
    exportCanvas.width = dimensions.width;
    exportCanvas.height = dimensions.height;
    
    const ctx = exportCanvas.getContext('2d');
    
    // Render at full resolution
    currentDesign.elements.forEach(element => {
      ctx.save();
      
      if (element.opacity) {
        ctx.globalAlpha = element.opacity;
      }
      
      switch (element.type) {
        case 'rectangle':
          ctx.fillStyle = element.fill;
          ctx.fillRect(element.x, element.y, element.width, element.height);
          break;
          
        case 'circle':
          ctx.fillStyle = element.fill;
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
          ctx.fill();
          break;
          
        case 'text':
          ctx.fillStyle = element.fill;
          const fontSize = element.fontSize || 16;
          ctx.font = `${element.fontWeight || 'normal'} ${fontSize}px ${element.fontFamily || 'Arial'}`;
          if (element.textAlign === 'center') {
            ctx.textAlign = 'center';
          }
          ctx.fillText(element.text, element.x, element.y);
          break;
          
        default:
          break;
      }
      
      ctx.restore();
    });
    
    // Download
    exportCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDesign.type}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="design-editor">
      <div className="editor-sidebar">
        <h3>Design Elements</h3>
        <div className="elements-list">
          {currentDesign.elements.map(element => (
            <div
              key={element.id}
              className={`element-item ${selectedElement?.id === element.id ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
              onClick={() => !element.locked && setSelectedElement(element)}
            >
              <span className="element-icon">
                {element.type === 'text' ? '📝' : element.type === 'rectangle' ? '⬜' : '⭕'}
              </span>
              <span className="element-name">
                {element.type === 'text' ? element.text.substring(0, 20) : element.id}
              </span>
              {element.locked && <span className="lock-icon">🔒</span>}
            </div>
          ))}
        </div>

        {selectedElement && (
          <div className="properties-panel">
            <h3>Properties</h3>
            
            {selectedElement.type === 'text' && (
              <>
                <div className="property-group">
                  <label>Text</label>
                  <textarea
                    value={selectedElement.text}
                    onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="property-group">
                  <label>Font Size</label>
                  <input
                    type="number"
                    value={selectedElement.fontSize}
                    onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                    min="10"
                    max="200"
                  />
                </div>
                
                <div className="property-group">
                  <label>Font Weight</label>
                  <select
                    value={selectedElement.fontWeight || 'normal'}
                    onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="property-group">
              <label>Color</label>
              <input
                type="color"
                value={selectedElement.fill}
                onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
              />
            </div>
            
            {selectedElement.opacity !== undefined && (
              <div className="property-group">
                <label>Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedElement.opacity}
                  onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="editor-main">
        <div className="editor-toolbar">
          <button onClick={onBack} className="btn-back">← Back</button>
          <div className="toolbar-right">
            <button onClick={() => onSave(currentDesign)} className="btn-save">💾 Save</button>
            <button onClick={handleExport} className="btn-export">📥 Export for VistaPrint</button>
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={currentDesign.dimensions.displayWidth}
            height={currentDesign.dimensions.displayHeight}
            onClick={handleCanvasClick}
            className="design-canvas"
          />
          <div className="canvas-info">
            {currentDesign.type.replace('-', ' ').toUpperCase()} • Click elements to edit
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignEditor;

