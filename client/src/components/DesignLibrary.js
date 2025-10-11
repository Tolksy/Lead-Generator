import React from 'react';
import './DesignLibrary.css';

const DesignLibrary = ({ designs, onSelectDesign, onDeleteDesign }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDesignTypeLabel = (type) => {
    const labels = {
      'business-card': 'Business Card',
      'flyer': 'Flyer',
      'door-hanger': 'Door Hanger'
    };
    return labels[type] || type;
  };

  const getDesignTypeIcon = (type) => {
    const icons = {
      'business-card': '💳',
      'flyer': '📄',
      'door-hanger': '🚪'
    };
    return icons[type] || '📝';
  };

  const generateThumbnail = (design) => {
    // Create a small canvas for thumbnail
    const canvas = document.createElement('canvas');
    const dims = design.dimensions;
    const scale = 200 / Math.max(dims.displayWidth, dims.displayHeight);
    
    canvas.width = dims.displayWidth * scale;
    canvas.height = dims.displayHeight * scale;
    
    const ctx = canvas.getContext('2d');
    const elementScale = (dims.displayWidth * scale) / dims.width;
    
    design.elements.forEach(element => {
      ctx.save();
      
      if (element.opacity) {
        ctx.globalAlpha = element.opacity;
      }
      
      switch (element.type) {
        case 'rectangle':
          ctx.fillStyle = element.fill;
          ctx.fillRect(
            element.x * elementScale,
            element.y * elementScale,
            element.width * elementScale,
            element.height * elementScale
          );
          break;
          
        case 'circle':
          ctx.fillStyle = element.fill;
          ctx.beginPath();
          ctx.arc(
            element.x * elementScale,
            element.y * elementScale,
            element.radius * elementScale,
            0,
            2 * Math.PI
          );
          ctx.fill();
          break;
          
        case 'text':
          ctx.fillStyle = element.fill;
          const fontSize = (element.fontSize || 16) * elementScale;
          ctx.font = `${element.fontWeight || 'normal'} ${fontSize}px ${element.fontFamily || 'Arial'}`;
          if (element.textAlign === 'center') {
            ctx.textAlign = 'center';
          }
          ctx.fillText(element.text, element.x * elementScale, element.y * elementScale);
          break;
          
        default:
          break;
      }
      
      ctx.restore();
    });
    
    return canvas.toDataURL();
  };

  return (
    <div className="design-library">
      <div className="library-header">
        <h2>📚 My Design Library</h2>
        <p className="library-subtitle">
          {designs.length === 0 
            ? 'No designs yet. Create your first design!' 
            : `${designs.length} design${designs.length !== 1 ? 's' : ''} in your library`}
        </p>
      </div>

      {designs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>Start Creating Amazing Designs</h3>
          <p>Your saved designs will appear here. Get started by creating a new design!</p>
        </div>
      ) : (
        <div className="designs-grid">
          {designs.map(design => (
            <div key={design.id} className="design-card">
              <div className="design-thumbnail">
                <img 
                  src={generateThumbnail(design)} 
                  alt={`${design.type} design`}
                  onClick={() => onSelectDesign(design)}
                />
                <div className="design-overlay">
                  <button 
                    className="btn-edit"
                    onClick={() => onSelectDesign(design)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDesign(design.id);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
              
              <div className="design-info">
                <div className="design-type">
                  <span className="type-icon">{getDesignTypeIcon(design.type)}</span>
                  <span className="type-label">{getDesignTypeLabel(design.type)}</span>
                </div>
                
                {design.metadata && design.metadata.companyName && (
                  <div className="design-title">{design.metadata.companyName}</div>
                )}
                
                <div className="design-date">
                  Created: {formatDate(design.createdAt)}
                </div>
                
                {design.updatedAt !== design.createdAt && (
                  <div className="design-date updated">
                    Updated: {formatDate(design.updatedAt)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignLibrary;

