import React, { useState } from 'react';
import './SignUp.css'
import { useNavigate } from 'react-router-dom';


export default function SignUp({ authUser, setAuthUser }) {

  const navigate = useNavigate();
  if (authUser) {
    navigate("/Resume");
  }
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidData, setInvaildData] = useState('');




  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(process.env.REACT_APP_API_URL + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name
      })
    })
      .then(res => {
        console.log("signup respone:");
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Creating a user failed!');
        }
        return res.json();
      })
      .then(resData => {

        setAuthUser({
          user: resData.user,
          token: resData.token,
        });

        navigate("/Resume");
      })
      .catch(err => {
        console.log(err);
        setInvaildData(err.message);
        setPassword('');
      });
    setEmail('');
    setName('');
    setPassword('');
    setInvaildData('');
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {invalidData && <div className='error'>
          {invalidData}
        </div>}
        <div id="elements">
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder='Enter Your Name'
            required
          />
        </div>
        <div id="elements">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter Your Email'
            required
          />
        </div>
        <div id="elements">
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder='Enter Password'
          />
        </div>
        <button type="submit" id="elements">Sign Up</button>
      </form>
    </div>
  );

};