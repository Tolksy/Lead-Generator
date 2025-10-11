# 🚀 Quick Start Guide

## For Windows Users

### Option 1: Using the Startup Script (Easiest!)

1. Double-click `START.bat`
2. Wait for the servers to start (two command windows will open)
3. Your browser will automatically open to `http://localhost:3000`

### Option 2: Manual Installation

Open PowerShell or Command Prompt in this folder and run:

```bash
# Install all dependencies
npm run install-all

# Start both servers
npm run dev
```

## For Mac/Linux Users

Open Terminal in this folder and run:

```bash
# Install all dependencies
npm run install-all

# Start both servers
npm run dev
```

## First Time Setup

The first time you run the application:

1. **Installation** will take 2-3 minutes
2. **Frontend** will open at `http://localhost:3000`
3. **Backend** will run at `http://localhost:5000`

## 🎨 Your First Design

1. Click "New Design" (you're already there!)
2. Click "📝 Use Example Prompt" to see a sample
3. Click "✨ Generate Design"
4. Edit your design in the visual editor
5. Click "💾 Save" or "📥 Export for VistaPrint"

## 📱 Workflow

```
1. Get prompt from Google Gemini (optional)
   ↓
2. Paste prompt into Graphic Design Studio
   ↓
3. AI generates your design
   ↓
4. Edit and customize visually
   ↓
5. Export for VistaPrint or save to library
```

## 🆘 Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your computer
- Try again

### "Port 3000 is already in use"
- Close other apps using port 3000
- Or modify `client/package.json` to use a different port

### Servers won't start
- Make sure you have Node.js 16+ installed
- Delete `node_modules` folders and run `npm run install-all` again

### Designs won't save
- Make sure the backend server is running
- Check that `server/designs` folder exists and has write permissions

## 💡 Pro Tips

- **Use example prompts** to see how the AI parses design requests
- **Start with simple designs** before complex ones
- **Save frequently** to avoid losing work
- **Export at full resolution** for best print quality

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Look at the example prompts in the app
- The AI does its best to parse prompts - be specific!

---

Ready to create amazing designs? Let's go! 🚀

