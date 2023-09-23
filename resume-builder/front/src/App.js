import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Resume from './components/Resume';
import CoverLetter from './components/CoverLetter';
import Home from './components/Home';
import About from './components/About';
import SignUp from './components/SignUp';
import Login from './Login';

function privateElement(isAuthenticated, element) {
  if (isAuthenticated) {
    return element;
  }
  return (<Navigate to="/Login" />);
}

const App = () => {
  const [authUser, setAuthUser] = useState(null);
  return (
    <Router>
      <Navbar authUser={authUser} />
      <Routes>
        <Route path="/Resume" element={privateElement(authUser != null, <Resume authUser={authUser} />)} />
        <Route path="/" element={<Home />} />
        <Route path="/CoverLetter" element={privateElement(authUser != null, <CoverLetter authUser={authUser} />)} />
        <Route path="/About" element={<About />} />
        <Route path="/SignUp" element={<SignUp setAuthUser={setAuthUser} authUser={authUser} />} />
        <Route path="/Login" element={<Login setAuthUser={setAuthUser} authUser={authUser} />} />
      </Routes>
    </Router>
  );

}



export default App;
