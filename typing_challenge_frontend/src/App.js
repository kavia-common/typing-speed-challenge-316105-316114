import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';

// PUBLIC_INTERFACE
function App() {
  /** Main SPA entry that provides routes for the game and leaderboard views. */
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
