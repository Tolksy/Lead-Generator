# 🎨 Graphic Design Studio

An AI-powered web application for creating professional graphic designs for business cards, flyers, and door hangers. Export designs ready for VistaPrint!

## ✨ Features

- 🤖 **AI-Powered Design Generation** - Paste prompts from Google Gemini or describe your design
- 🎨 **Visual Design Editor** - Interactive canvas for tweaking designs
- 💾 **Design Library** - Save and manage all your designs
- 📥 **VistaPrint Export** - Export high-resolution PNG files ready for printing
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed on your system
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Graphic-Design-Software
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

   This will install dependencies for both the frontend and backend.

3. **Start the application**
   
   **Option A: Run both servers simultaneously**
   ```bash
   npm run dev
   ```

   **Option B: Run servers separately**
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run client
   ```

4. **Open your browser**
   
   Navigate to: `http://localhost:3000`

## 📖 How to Use

### Creating a Design

1. **Get a prompt from Google Gemini** (optional)
   - Go to Google Gemini
   - Ask it to create a design prompt for your needs
   - Example: "Create a business card prompt for a tech startup"

2. **Generate your design**
   - Select your design type (Business Card, Flyer, or Door Hanger)
   - Paste the prompt or write your own description
   - Click "Generate Design"

3. **Edit and customize**
   - Click on elements to select them
   - Modify text, colors, fonts, and more
   - Use the properties panel on the left

4. **Save or export**
   - Click "Save" to add to your library
   - Click "Export for VistaPrint" to download high-res PNG

### Design Types

| Type | Dimensions | Use Case |
|------|-----------|----------|
| Business Card | 3.5" × 2" | Professional networking |
| Flyer | 8.5" × 11" | Promotions, events |
| Door Hanger | 4.25" × 11" | Local marketing |

## 🏗️ Project Structure

```
Graphic-Design-Software/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # React components
│       ├── utils/         # Helper functions
│       ├── App.js         # Main app component
│       └── index.js       # Entry point
├── server/                # Express backend
│   ├── designs/          # Saved designs (auto-created)
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package file
└── README.md
```

## 🛠️ Tech Stack

**Frontend:**
- React 18
- HTML5 Canvas API
- Axios for API calls
- Modern CSS3

**Backend:**
- Node.js
- Express
- File-based storage
- UUID for unique IDs

## 💡 Example Prompts

### Business Card
```
Create a modern business card for a tech startup called "InnovateTech". 
Use blue and white colors. Include the name "John Smith", title "CEO & Founder", 
phone "(555) 123-4567", email "john@innovatetech.com", and website "www.innovatetech.com".
```

### Flyer
```
Design a promotional flyer for a grand opening sale. Title: "Grand Opening - 50% OFF Everything!" 
Include store name "Fashion Hub", date "October 15, 2025", address "123 Main St, Downtown", 
and phone "(555) 987-6543". Use bold red and yellow colors.
```

### Door Hanger
```
Create a door hanger for a lawn care service called "Green Paradise Lawns". 
Include services: Mowing, Trimming, Fertilizing. Add phone "(555) 456-7890" 
and tagline "Your Lawn, Our Passion". Use green and white colors.
```

## 📋 API Endpoints

- `GET /api/designs` - Get all designs
- `GET /api/designs/:id` - Get a specific design
- `POST /api/designs` - Save a new design
- `PUT /api/designs/:id` - Update a design
- `DELETE /api/designs/:id` - Delete a design

## 🎯 Future Enhancements

- [ ] Direct VistaPrint API integration
- [ ] More design templates
- [ ] Collaborative editing
- [ ] Cloud storage integration
- [ ] Image upload support
- [ ] Custom fonts
- [ ] Advanced shape tools
- [ ] Layer management
- [ ] Design history/undo-redo

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Troubleshooting

### Port already in use
If port 3000 or 5000 is already in use:
- Change the port in `client/package.json` (proxy setting)
- Change PORT in `server/index.js`

### Dependencies not installing
Try:
```bash
cd client && npm install
cd ../server && npm install
```

### Designs not saving
Make sure the server is running and check that the `server/designs` directory has write permissions.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for entrepreneurs and small businesses

