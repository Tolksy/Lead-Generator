# Backend Operations Guide for Claude

## System Overview

You are the backend for this graphic design system. The user will give you prompts from Google Gemini (or write their own), and you generate HTML files with Canvas code that render the designs.

## How This System Works

1. **User gives you a design prompt** (from Gemini or manually written)
2. **You create a new HTML file** in the `designs/` folder with Canvas code
3. **You update `index.html`** to add the new design to the gallery
4. **User opens index.html** in browser to see all designs with live previews
5. **User clicks a design** to open it and export as PNG

## File Structure

```
Graphic-Design-Software/
├── index.html              ← Gallery page showing all designs with previews
├── designs/                ← Folder containing all design HTML files
│   ├── business-card-example.html
│   ├── contractor-card.html
│   └── [new designs you create].html
├── BACKEND_README.md       ← This file (your instruction manual)
└── README.md               ← User-facing documentation
```

## Your Job When User Requests a Design

### Step 1: Parse the Prompt
Extract:
- **Design type** (business card 3.5"×2" = 1050×600px, flyer 8.5"×11" = 2550×3300px, door hanger 4.25"×11" = 1275×3300px)
- **Colors** (background, text, accent)
- **Text content** (company name, tagline, name, title, phone, email, website, address, etc.)
- **Style keywords** (modern, professional, bold, minimalist, etc.)

### Step 2: Create the Design HTML File

**Template structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Design Name]</title>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; flex-direction: column; gap: 20px; }
        canvas { border: 2px solid #ccc; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        button { padding: 15px 30px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: bold; }
        button:hover { background: #5568d3; }
    </style>
</head>
<body>
    <canvas id="card" width="[WIDTH]" height="[HEIGHT]"></canvas>
    <button onclick="exportCard()">📥 Download PNG</button>
    
    <script>
        const canvas = document.getElementById('card');
        const ctx = canvas.getContext('2d');
        
        // YOUR DESIGN CODE HERE
        // Use ctx.fillStyle, ctx.fillRect, ctx.fillText, ctx.arc, etc.
        
        function exportCard() {
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '[filename].png';
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    </script>
</body>
</html>
```

**Save as:** `designs/[descriptive-name].html`

### Step 3: Update index.html

Add a new card to the designs gallery:

```html
<div class="design-card">
    <div class="design-preview">
        <iframe src="designs/[your-new-file].html"></iframe>
    </div>
    <div class="design-info">
        <div class="design-name">[Display Name]</div>
        <a href="designs/[your-new-file].html" target="_blank" class="design-link">Open & Export</a>
    </div>
</div>
```

Insert this inside the `<div class="designs">` section.

## Design Dimensions (300 DPI for print)

| Type | Physical Size | Canvas Dimensions |
|------|--------------|-------------------|
| Business Card | 3.5" × 2" | 1050 × 600 |
| Flyer | 8.5" × 11" | 2550 × 3300 |
| Door Hanger | 4.25" × 11" | 1275 × 3300 |
| Postcard | 6" × 4" | 1800 × 1200 |

## Canvas Drawing Basics

```javascript
// Fill rectangle
ctx.fillStyle = '#FF0000';
ctx.fillRect(x, y, width, height);

// Draw text
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 48px Arial';
ctx.fillText('Text Here', x, y);

// Draw circle
ctx.fillStyle = '#0000FF';
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();

// Set opacity
ctx.globalAlpha = 0.5; // 50% transparent

// Gradients
const gradient = ctx.createLinearGradient(0, 0, width, 0);
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');
ctx.fillStyle = gradient;
```

## Color Extraction Guide

Common color keywords → Hex codes:
- red → #FF0000 or #DC3545
- blue → #0066CC or #667eea
- green → #00AA00 or #28a745
- yellow → #FFD700
- orange → #FF6B35 or #FF8800
- purple → #8B00FF or #764ba2
- gray/grey → #2C3E50 (dark) or #95A5A6 (light)
- black → #000000 or #2C3E50 (softer)
- white → #FFFFFF or #ECF0F1 (softer)

## Design Best Practices

1. **Business Cards:**
   - Company name: Large, bold (48-54px)
   - Person name: Medium (32-36px)
   - Contact info: Readable (18-20px)
   - Use 2-3 colors max
   - Leave whitespace/breathing room

2. **Flyers:**
   - Eye-catching headline: Very large (80-120px)
   - Key info prominent (48-72px)
   - Details readable (36-48px)
   - Use bold colors for attention
   - Balance text with shapes/graphics

3. **Door Hangers:**
   - Vertical orientation
   - Large text (people read from distance)
   - Clear call-to-action
   - Phone number prominent

## Example User Request Scenarios

### Scenario 1: Simple Prompt
**User:** "Business card for plumber, blue background, white text, phone (555) 123-4567"

**You do:**
1. Create `designs/plumber-card.html`
2. 1050×600 canvas
3. Blue background (#0066CC)
4. White text for company name, phone
5. Add placeholder for name/email
6. Update index.html with new card

### Scenario 2: Detailed Gemini Prompt
**User:** "Create a professional flyer for 'Fresh Bites Cafe' grand opening. Use warm colors like orange and cream. Include: 'Grand Opening - October 20th', '50% Off All Drinks', location '123 Main Street', hours 'Open 7AM-8PM Daily'. Modern, clean design with coffee theme."

**You do:**
1. Create `designs/fresh-bites-flyer.html`
2. 2550×3300 canvas (flyer size)
3. Cream background (#FFF8DC)
4. Orange accents (#FF6B35)
5. Large "Grand Opening" headline
6. All specified text with proper hierarchy
7. Add decorative coffee-themed circles/shapes
8. Update index.html

### Scenario 3: Minimal Info
**User:** "Door hanger for lawn care service"

**You do:**
1. Create `designs/lawn-care-hanger.html`
2. 1275×3300 canvas
3. Use green (#00AA00) as primary color
4. Add generic text: company name placeholder, services list, phone placeholder
5. Nature-inspired decorative elements
6. Update index.html

## What User Can Export To

- **VistaPrint:** PNG files at 300 DPI (your canvas dimensions are already correct)
- **Canva:** User can import PNG to Canva for further editing
- **Local printing:** Any print shop accepts PNG at these resolutions

## Testing Your Design

Before finalizing, mentally check:
- ✅ Correct canvas dimensions for design type?
- ✅ All text readable at actual size?
- ✅ Colors match prompt?
- ✅ Export function works (download button)?
- ✅ Added to index.html gallery?

## Common Mistakes to Avoid

❌ Wrong canvas dimensions
❌ Text too small to read
❌ Forgetting to update index.html
❌ Using low contrast (e.g., light gray on white)
❌ Overcrowding the design with too much text
❌ Misspelling words from user's prompt

## User Will Say...

- "Read the backend" → You read this file for context
- [Gives you a prompt] → You create design + update index
- "Make it [change]" → You edit the specific HTML file
- "Delete [design]" → You remove file and index entry

## That's It!

You're not a complex system. You're a code generator that:
1. Takes prompts
2. Writes HTML files with Canvas drawing code
3. Updates the gallery page

Keep it simple. Each design is self-contained. No databases, no APIs, no frameworks.

