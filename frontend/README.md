# AI Workout & Diet Planner - Frontend

A modern React frontend for the AI-based workout and diet planning system.

## Features

- 🤖 **AI-Powered Plan Generation**: Generate personalized workout and diet plans
- 📊 **Plan History**: View and manage previously generated plans
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean and intuitive user interface
- ⚡ **Real-time Updates**: Instant feedback and loading states

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Backend Flask server running on port 8000

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`

## Usage

### Generate New Plan
1. Click on "Generate New Plan" tab
2. Enter your present weight, expected weight, and target duration
3. Click "Generate My Plan" to create your personalized plan
4. View your detailed weekly workout and nutrition plan

### View Plan History
1. Click on "View History" tab
2. Browse through your previously generated plans
3. Click on any plan to view detailed information
4. Use pagination to navigate through multiple plans

## API Integration

The frontend connects to the Flask backend running on `http://localhost:8000` with the following endpoints:

- `POST /generate-plan` - Generate new workout and diet plan
- `GET /plans` - Retrieve all saved plans
- `GET /plans/<id>` - Get specific plan by ID
- `GET /health` - Health check endpoint

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── PlanGenerator.js
│   │   ├── PlanDisplay.js
│   │   └── PlanHistory.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Technologies Used

- **React 18** - Frontend framework
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with modern features
- **JavaScript ES6+** - Modern JavaScript features

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Contributing

1. Make sure the backend Flask server is running
2. Ensure all API endpoints are working correctly
3. Test the frontend functionality thoroughly
4. Follow React best practices and coding standards

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Make sure the Flask server is running on port 8000
2. **CORS Issues**: The backend should handle CORS for localhost:3000
3. **API Errors**: Check browser console for detailed error messages

### Development Tips

- Use browser developer tools to debug API calls
- Check network tab for request/response details
- Ensure backend is running before starting frontend
