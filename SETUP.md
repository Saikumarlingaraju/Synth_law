# 🚀 Synth-Law Setup Guide

## Step 1: Get Your Google AI API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key" in the top right
3. Sign in with your Google account
4. Click "Create API Key"
5. Copy your API key

## Step 2: Configure the Application

1. Open the `.env` file in the project root
2. Replace `GOOGLE_API_KEY=` with your actual key:
   ```
   GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. Save the file

## Step 3: Start the Application

Run this command:
```bash
npm run dev
```

## Step 4: Open in Browser

Navigate to:
```
http://localhost:5173
```

## 🎉 You're Ready!

The application should now be running with:
- ✨ Frontend UI at http://localhost:5173
- 🤖 AI Backend at http://localhost:4000

## 🧪 Test the App

1. Click "Analyze Your Contract Now"
2. Upload any PDF contract (or use the sample data)
3. Click "Analyze Contract"
4. View the results in the three tabs:
   - DETECT (risk analysis)
   - DECIPHER (translation)
   - DEFEND (negotiation)

## ⚠️ Troubleshooting

### "Failed to analyze contract"
- Check that your Google API key is correct in `.env`
- Ensure the backend server is running on port 4000

### Port already in use
- Change the port in `.env`:
  ```
  PORT=3001
  GENKIT_PORT=4001
  ```

### Dependencies error
- Run `npm install` again
- Make sure you have Node.js 18+ installed

## 📝 Notes

- The demo includes sample contract data for testing
- Real contract analysis requires a valid Google AI API key
- First analysis may take 10-15 seconds as models initialize

Enjoy using Synth-Law! 🏛️
