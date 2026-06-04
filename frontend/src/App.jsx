import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import VideoMeetComponent from './pages/VideoMeet';

function App() {

  return (
    <>
      <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/:url" element={<VideoMeetComponent />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
