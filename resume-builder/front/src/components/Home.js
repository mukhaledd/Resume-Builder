import React from 'react';
import './Home.css'


const Home = () => {
  return (
    <section className="Page" id="ServicesPage">


      <p className="Description">"Impress employers with ease - Create top-notch cover letters and resumes."</p>


      <div className="Cards">
        <div id="S1" className="S">
          <i id="fass" className="fa-solid fa-file fa-8x"></i>
          <h1 id="des1">Resume</h1>
          <p id="des2">Resume Builder, the ultimate online tool for crafting your personal brand. Resume Builder is a simple and easy-to-use platform that helps you design and customize your resume </p>
        </div>
        <div id="S2" className="S">
          <i id="fass" className="fa-solid fa-envelope fa-8x"></i>
          <h1 id="des1">Cover Letter</h1>
          <p id='des2'>Cover Letter Builder, the best online tool for creating a persuasive and personalized cover letter in minutes.</p>
        </div>
      </div>
      <footer className="footer">
        <div className="row">
          <div className="col-md-6">
            <p>&copy; 2023. All rights reserved.</p>
          </div>
          <div className="col-md-6">
            <div className="col-md-7">

            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default Home;
