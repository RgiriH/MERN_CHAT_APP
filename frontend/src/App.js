import './App.css'
import React from 'react';
import { Route , Routes } from 'react-router-dom';
import Home from './pages/Home.js';
import Chat from './pages/Chat.js';
function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Chat" element={<Chat/> } />
      </Routes>
    </div>
  );
}

export default App;
