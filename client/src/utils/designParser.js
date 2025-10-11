// Design dimensions in pixels (at 300 DPI for print quality)
const DIMENSIONS = {
  'business-card': { width: 1050, height: 600, displayWidth: 700, displayHeight: 400 },
  'flyer': { width: 2550, height: 3300, displayWidth: 612, displayHeight: 792 },
  'door-hanger': { width: 1275, height: 3300, displayWidth: 425, displayHeight: 1100 }
};

export const parsePrompt = (prompt, designType) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract colors
  const colors = extractColors(prompt);
  
  // Extract text content
  const textContent = extractTextContent(prompt);
  
  // Extract business/company name
  const companyName = extractCompanyName(prompt);
  
  // Extract contact info
  const contactInfo = extractContactInfo(prompt);
  
  return {
    designType,
    colors,
    textContent,
    companyName,
    contactInfo,
    rawPrompt: prompt
  };
};

const extractColors = (prompt) => {
  const colorMap = {
    'red': '#FF0000',
    'blue': '#0066CC',
    'green': '#00AA00',
    'yellow': '#FFD700',
    'orange': '#FF8800',
    'purple': '#8B00FF',
    'pink': '#FF69B4',
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'grey': '#808080',
    'brown': '#8B4513',
    'navy': '#000080',
    'teal': '#008080',
    'gold': '#FFD700',
    'silver': '#C0C0C0'
  };
  
  const lowerPrompt = prompt.toLowerCase();
  const foundColors = [];
  
  for (const [name, hex] of Object.entries(colorMap)) {
    if (lowerPrompt.includes(name)) {
      foundColors.push(hex);
    }
  }
  
  // Default colors if none found
  if (foundColors.length === 0) {
    foundColors.push('#667eea', '#FFFFFF');
  }
  
  return foundColors.slice(0, 3); // Max 3 colors
};

const extractCompanyName = (prompt) => {
  // Look for patterns like "called X", "name X", "X company", etc.
  const patterns = [
    /(?:called|named)\s+["']([^"']+)["']/i,
    /(?:company|business|store|service)\s+["']([^"']+)["']/i,
    /for\s+["']([^"']+)["']/i
  ];
  
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match) return match[1];
  }
  
  return 'Your Business';
};

const extractTextContent = (prompt) => {
  // Extract quoted text
  const quotes = prompt.match(/["']([^"']+)["']/g) || [];
  return quotes.map(q => q.replace(/["']/g, ''));
};

const extractContactInfo = (prompt) => {
  const info = {};
  
  // Phone number
  const phoneMatch = prompt.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) info.phone = phoneMatch[0];
  
  // Email
  const emailMatch = prompt.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) info.email = emailMatch[0];
  
  // Website
  const websiteMatch = prompt.match(/(?:www\.)?[\w-]+\.(?:com|net|org|io|co)/i);
  if (websiteMatch) info.website = websiteMatch[0];
  
  // Address (simplified)
  const addressMatch = prompt.match(/\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)[\w\s,]*/i);
  if (addressMatch) info.address = addressMatch[0];
  
  return info;
};

export const generateDesign = (parsedData, designType) => {
  const dims = DIMENSIONS[designType];
  const { colors, companyName, contactInfo, textContent } = parsedData;
  
  const primaryColor = colors[0] || '#667eea';
  const secondaryColor = colors[1] || '#FFFFFF';
  const accentColor = colors[2] || primaryColor;
  
  let elements = [];
  
  switch (designType) {
    case 'business-card':
      elements = generateBusinessCard(companyName, contactInfo, primaryColor, secondaryColor, accentColor, dims);
      break;
    case 'flyer':
      elements = generateFlyer(companyName, contactInfo, textContent, primaryColor, secondaryColor, accentColor, dims);
      break;
    case 'door-hanger':
      elements = generateDoorHanger(companyName, contactInfo, textContent, primaryColor, secondaryColor, accentColor, dims);
      break;
    default:
      elements = [];
  }
  
  return {
    type: designType,
    dimensions: dims,
    colors: { primaryColor, secondaryColor, accentColor },
    elements,
    metadata: parsedData
  };
};

const generateBusinessCard = (companyName, contactInfo, primary, secondary, accent, dims) => {
  return [
    {
      id: 'bg',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: dims.width,
      height: dims.height,
      fill: primary,
      locked: true
    },
    {
      id: 'accent-shape',
      type: 'circle',
      x: dims.width * 0.75,
      y: dims.height * 0.5,
      radius: dims.width * 0.35,
      fill: accent,
      opacity: 0.2,
      locked: false
    },
    {
      id: 'company-name',
      type: 'text',
      text: companyName,
      x: 40,
      y: 60,
      fontSize: 48,
      fontWeight: 'bold',
      fill: secondary,
      fontFamily: 'Arial'
    },
    {
      id: 'name',
      type: 'text',
      text: contactInfo.name || 'Your Name',
      x: 40,
      y: 250,
      fontSize: 32,
      fontWeight: 'normal',
      fill: secondary,
      fontFamily: 'Arial'
    },
    {
      id: 'title',
      type: 'text',
      text: contactInfo.title || 'Your Title',
      x: 40,
      y: 300,
      fontSize: 20,
      fontWeight: 'normal',
      fill: secondary,
      opacity: 0.9,
      fontFamily: 'Arial'
    },
    {
      id: 'phone',
      type: 'text',
      text: contactInfo.phone || '(555) 123-4567',
      x: 40,
      y: 400,
      fontSize: 18,
      fill: secondary,
      fontFamily: 'Arial'
    },
    {
      id: 'email',
      type: 'text',
      text: contactInfo.email || 'email@example.com',
      x: 40,
      y: 440,
      fontSize: 18,
      fill: secondary,
      fontFamily: 'Arial'
    },
    {
      id: 'website',
      type: 'text',
      text: contactInfo.website || 'www.example.com',
      x: 40,
      y: 480,
      fontSize: 18,
      fill: secondary,
      fontFamily: 'Arial'
    }
  ];
};

const generateFlyer = (companyName, contactInfo, textContent, primary, secondary, accent, dims) => {
  const title = textContent.length > 0 ? textContent[0] : 'Special Promotion';
  
  return [
    {
      id: 'bg',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: dims.width,
      height: dims.height,
      fill: secondary,
      locked: true
    },
    {
      id: 'header-bar',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: dims.width,
      height: dims.height * 0.25,
      fill: primary,
      locked: false
    },
    {
      id: 'accent-shape',
      type: 'circle',
      x: dims.width * 0.85,
      y: dims.height * 0.15,
      radius: dims.width * 0.25,
      fill: accent,
      opacity: 0.3,
      locked: false
    },
    {
      id: 'title',
      type: 'text',
      text: title,
      x: 100,
      y: 200,
      fontSize: 120,
      fontWeight: 'bold',
      fill: secondary,
      fontFamily: 'Arial',
      maxWidth: dims.width - 200
    },
    {
      id: 'company-name',
      type: 'text',
      text: companyName,
      x: 100,
      y: dims.height * 0.5,
      fontSize: 72,
      fontWeight: 'bold',
      fill: primary,
      fontFamily: 'Arial'
    },
    {
      id: 'details',
      type: 'text',
      text: textContent.slice(1).join('\n') || 'Visit us today!',
      x: 100,
      y: dims.height * 0.6,
      fontSize: 48,
      fill: '#333333',
      fontFamily: 'Arial',
      maxWidth: dims.width - 200
    },
    {
      id: 'contact',
      type: 'text',
      text: [contactInfo.phone, contactInfo.address].filter(Boolean).join(' • ') || 'Contact us for more info',
      x: 100,
      y: dims.height * 0.85,
      fontSize: 36,
      fill: '#666666',
      fontFamily: 'Arial'
    }
  ];
};

const generateDoorHanger = (companyName, contactInfo, textContent, primary, secondary, accent, dims) => {
  return [
    {
      id: 'bg',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: dims.width,
      height: dims.height,
      fill: secondary,
      locked: true
    },
    {
      id: 'header',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: dims.width,
      height: dims.height * 0.15,
      fill: primary,
      locked: false
    },
    {
      id: 'company-name',
      type: 'text',
      text: companyName,
      x: dims.width * 0.5,
      y: 100,
      fontSize: 72,
      fontWeight: 'bold',
      fill: secondary,
      fontFamily: 'Arial',
      textAlign: 'center'
    },
    {
      id: 'main-content',
      type: 'text',
      text: textContent[0] || 'Professional Services',
      x: dims.width * 0.5,
      y: dims.height * 0.35,
      fontSize: 56,
      fontWeight: 'bold',
      fill: primary,
      fontFamily: 'Arial',
      textAlign: 'center',
      maxWidth: dims.width - 100
    },
    {
      id: 'services',
      type: 'text',
      text: textContent.slice(1).join('\n') || '• Service 1\n• Service 2\n• Service 3',
      x: dims.width * 0.5,
      y: dims.height * 0.55,
      fontSize: 42,
      fill: '#333333',
      fontFamily: 'Arial',
      textAlign: 'center',
      maxWidth: dims.width - 100
    },
    {
      id: 'phone',
      type: 'text',
      text: contactInfo.phone || '(555) 123-4567',
      x: dims.width * 0.5,
      y: dims.height * 0.85,
      fontSize: 52,
      fontWeight: 'bold',
      fill: primary,
      fontFamily: 'Arial',
      textAlign: 'center'
    },
    {
      id: 'accent-circle',
      type: 'circle',
      x: dims.width * 0.15,
      y: dims.height * 0.7,
      radius: 120,
      fill: accent,
      opacity: 0.2,
      locked: false
    }
  ];
};

