import React, { useEffect, useState } from 'react';
import './Resume.css';
import SaveDivAsPDF from './SaveDivAsPDF';


export default function Resume({ authUser }) {

	const [state, setState] = useState({
		firstName: '',
		lastName: '',
		jobTitle: '',
		address: '',
		summary: '',
		email: '',
		phone: '',
	});


	const [resumesList, setResumesList] = useState([]);

	const loadResumes = () => {
		fetch(process.env.REACT_APP_API_URL + '/resumes', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + authUser.token,
			}
		}).then(res => {
			return res.json();
		}).then(resData => {
			if (resData.resumes) {
				setResumesList(resData.resumes);
			} else {
				alert(resData.message ? resData.message : resData.error);
			}
		});
	}

	useEffect(() => {
		loadResumes();
	}, []);

	const handleInput = (event) => {
		const { name, value } = event.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};



	const [image, setImage] = useState(null);
	const [formImage, setFormImage] = useState(null);



	const handleImageChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setFormImage(event.target.files[0]);
			setImage(URL.createObjectURL(event.target.files[0]));
		}
	};

	const [entries, setEntries] = useState({
		skills: [],
		experiences: [],
		educations: [],
		languages: [],
	});

	const addEntry = (type) => {
		setEntries((prevState) => ({
			...prevState,
			[type]: [...prevState[type], ''],
		}));
	};

	const removeEntry = (type, index) => {
		setEntries((prevState) => ({
			...prevState,
			[type]: prevState[type].filter((_, i) => i !== index),
		}));
	};

	const handleEntryChange = (event, type, index) => {
		const newEntries = { ...entries };
		newEntries[type][index] = event.target.value;
		setEntries(newEntries);
	};

	const [success, setSuccess] = useState(false);

	const previewResume = (resume) => {
		setState({
			firstName: resume.firstName,
			lastName: resume.lastName,
			jobTitle: resume.jobTitle,
			address: resume.address,
			summary: resume.summary,
			email: resume.email,
			phone: resume.phone,
		});

		setImage(process.env.REACT_APP_API_URL + "/uploads/" + resume.image);

		setEntries({
			skills: resume.skills,
			experiences: resume.experiences,
			educations: resume.educations,
			languages: resume.languages,
		})
	}

	const saveResume = () => {
		const dataObj = {
			...state,
			'image': formImage,
			...entries
		};

		const formData = new FormData();

		Object.keys(dataObj).forEach(key => formData.append(key, dataObj[key]));

		fetch(process.env.REACT_APP_API_URL + '/resume', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + authUser.token,
			},
			body: formData
		}).then(res => {
			return res.json();
		}).then(resData => {
			if (resData.resume) {
				setResumesList([...resumesList, resData.resume]);
				setSuccess(true);
				setTimeout(() => { setSuccess(false); }, 4000);
			} else {
				alert(resData.message ? resData.message : resData.error);
			}
		});

	}

	return (
		<div>
			<div id="resumesContainer">
				<h1>My resumes</h1>
				<table>
					<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Job Title</th>
							<th>action</th>
						</tr>
					</thead>
					<tbody>
						{resumesList.map((resume) => (
							<tr key={resume._id}>
								<td>{resume.firstName}</td>
								<td>{resume.lastName}</td>
								<td>{resume.jobTitle}</td>
								<td>
									<button onClick={() => previewResume(resume)}>
										Preview
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div id="ResumePage">
				<div id='formResume'>
					{success && <div className='success'>
						Resume Saved Succesfully
					</div>}
					<h1>Personal Information</h1>

					<input
						type="file"
						accept="image/*"
						id='UploadButton'
						onChange={handleImageChange}
					/>

					<div id='Input1'>
						<input
							type="text"
							name="firstName"
							placeholder="First Name"
							value={state.firstName}
							onChange={handleInput}
						/>
						<input
							type="text"
							name="lastName"
							placeholder="Last Name"
							value={state.lastName}
							onChange={handleInput}
						/>
						<input
							type="text"
							name="jobTitle"
							placeholder="Job Title"
							value={state.jobTitle}
							onChange={handleInput}
						/>
						<input
							type="text"
							name="address"
							placeholder="address"
							value={state.address}
							onChange={handleInput}
						/>
					</div>
					<textarea
						name="summary"
						placeholder="summary"
						id='summary'
						value={state.summary}
						onChange={handleInput}
					/>
					<h1>contact</h1>
					<div id='Input2'>
						<input
							type="text"
							name="phone"
							placeholder="phone"
							value={state.phone}
							onChange={handleInput}
						/>

						<input
							type="email"
							name="email"
							placeholder="E-mail"
							value={state.email}
							onChange={handleInput}
						/>
					</div>
					<h1>Qualifications</h1>
					<div id="Buttons">
						<button type="button" onClick={() => addEntry('skills')}>
							Add Skill
						</button>
						{entries.skills.map((skill, index) => (
							<div key={index}>
								<input
									type="text"
									value={skill}
									onChange={(event) =>
										handleEntryChange(event, 'skills', index)
									}
								/>
								<button type="button" className='RemoveButtons' onClick={() => removeEntry('skills', index)}>
									Remove Skill
								</button>
							</div>
						))}

						<button type="button" onClick={() => addEntry('languages')}>
							Add Languages
						</button>
						{entries.languages.map((language, index) => (
							<div key={index}>
								<input
									type="text"
									value={language}
									onChange={(event) =>
										handleEntryChange(event, 'languages', index)
									}
								/>
								<button type="button" className='RemoveButtons' onClick={() => removeEntry('languages', index)}>
									Remove Language
								</button>
							</div>
						))}



						<button type="button" onClick={() => addEntry('experiences')}>
							Add Experience
						</button>
						{entries.experiences.map((experience, index) => (
							<div key={index}>
								<input
									type="text"
									value={experience}
									onChange={(event) =>
										handleEntryChange(event, 'experiences', index)
									}
								/>
								<button type="button" className='RemoveButtons' onClick={() => removeEntry('experiences', index)}>
									Remove Experience
								</button>
							</div>
						))}

						<button type="button" onClick={() => addEntry('educations')}>
							Add Education
						</button>
						{entries.educations.map((education, index) => (
							<div key={index}>
								<input
									type="text"
									value={education}
									onChange={(event) =>
										handleEntryChange(event, 'educations', index)
									}
								/>
								<button type="button" className='RemoveButtons' onClick={() => removeEntry('educations', index)}>
									Remove Education
								</button>
							</div>
						))}


					</div>
					<div id='saveDiv'>
						<button onClick={saveResume}>Save</button>
					</div>
				</div>
				<div>
					<div id="Resume">
						<div id="FirstHalf">
							<div id="PersonalInformation">

								{image && <img src={image} alt="Uploaded" />}
								<div id='General'>
									<div id='NameJob'>

										<h1 id="FirstName">{state.firstName}</h1>
										<h1 id="lastName">{state.lastName}</h1>
										<h4 id="JobTitle">{state.jobTitle}</h4>
									</div>
									<div id='contact'>
										<p id="address">{state.address}</p>
										<p id="email">{state.email}</p>
										<p id="phone">{state.phone}</p>
									</div>

								</div>

								<p id="summaryP">{state.summary}</p>

							</div>


							<div id='Additional'>
								{entries.skills.length > 0 && (
									<div id='Skills'>
										<h2>Key Skills</h2>
										<ul>
											{entries.skills.map((skill, index) => (
												<li key={index}>{skill}</li>
											))}
										</ul>
									</div>
								)}


								{entries.languages.length > 0 && (
									<div id='Languages'>
										<h2>Languages</h2>
										<ul>
											{entries.languages.map((language, index) => (
												<li key={index}>{language}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</div>
						<div id='SecondHalf'>
							<div id="Experince">
								{entries.experiences.length > 0 && (
									<div id='Experience'>
										<h2>Experience</h2>
										<ul>
											{entries.experiences.map((experience, index) => (
												<li key={index} >{experience}</li>
											))}
										</ul>
									</div>
								)}

							</div>
							<div id="Education">
								{entries.educations.length > 0 && (
									<div id='Education'>
										<h2>Education</h2>
										<ul>
											{entries.educations.map((education, index) => (
												<li key={index}>{education}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</div>


					</div>
					<SaveDivAsPDF divId="Resume"></SaveDivAsPDF>
				</div>
			</div>
		</div>
	);
}
