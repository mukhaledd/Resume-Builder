import React from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';


const Navbar = ({ authUser }) => {
  return (
    <div id="Navbar">
      <Link to="/">Home</Link>
      {!authUser && <Link to="./SignUp">Sign up</Link>}
      {!authUser && <Link to="./Login">Log in</Link>}
      {authUser && <Link to="./Resume">Resume</Link>}
      {authUser && <Link to="./CoverLetter">Cover Letter</Link>}
      <Link to="./About">About</Link>

    </div>

  );
}

export default Navbar;
