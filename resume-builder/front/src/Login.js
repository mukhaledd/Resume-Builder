import React, { useState } from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';

export default function Login({ authUser, setAuthUser }) {
	const navigate = useNavigate();
	if (authUser) {
		navigate("/Resume");
	}
	const [logemail, setEmail] = useState('');
	const [logpassword, setPassword] = useState('');
	const [invalidData, setInvaildData] = useState('');


	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetch(process.env.REACT_APP_API_URL + '/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: logemail,
				password: logpassword
			})
		}).then(res => {
			return res.json();
		}).then(resData => {
			if (resData.message) {
				setInvaildData(resData.message);
				setPassword('');
				return;
			}

			setAuthUser({
				user: resData.user,
				token: resData.token
			});

			navigate("/Resume");
		});
		console.log("Login submit");
		// Handle form submission logic here, such as sending data to a server
		console.log('Email:', logemail);
		// console.log('Password:', password);

	};
	return (
		<div id="wrap">
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				{invalidData && <div className='error'>
					{invalidData}
				</div>}
				<div id="elements">
					<input
						type="email"
						id="email"
						value={logemail}
						onChange={handleEmailChange}
						placeholder='Enter Your Email'
						required
					/>
				</div>
				<div id="elements">
					<input
						type="password"
						id="password"
						value={logpassword}
						required
						onChange={handlePasswordChange}
						placeholder='Enter Password'
					/>
				</div>
				<button type="submit" id="elements">Login</button>
			</form>
		</div>
	);
};