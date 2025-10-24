import React, { useState } from 'react';
import PlanGenerator from './components/PlanGenerator';
import PlanHistory from './components/PlanHistory';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="App">
      <div className="header">
        <h1>🤖 AI Workout & Diet Planner</h1>
        <p>Get personalized workout and diet plans powered by AI</p>
      </div>

      <div className="container">
        <nav className="nav">
          <button 
            className={activeTab === 'generate' ? 'active' : ''}
            onClick={() => setActiveTab('generate')}
          >
            Generate New Plan
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            View History
          </button>
        </nav>

        {activeTab === 'generate' && <PlanGenerator />}
        {activeTab === 'history' && <PlanHistory />}
      </div>
    </div>
  );
}

export default App;
