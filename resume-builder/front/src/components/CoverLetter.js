import React, { useEffect, useState } from 'react';
import './CoverLetter.css';
import SaveDivAsPDF from './SaveDivAsPDF';
import { useNavigate } from 'react-router-dom';
export default function CoverLetter({ authUser }) {
  const navigate = useNavigate();
  const [state, setState] = useState({
    name: '',
    jobTitle: '',
    address: '',
    paragraphs: [''],
    email: '',
    phone: '',
    yourName: '',
  });

  const [lettersList, setLettersList] = useState([]);

  const loadLetters = () => {
    fetch(process.env.REACT_APP_API_URL + '/letters', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authUser.token,
      }
    }).then(res => {
      return res.json();
    }).then(resData => {
      if (resData.letters) {
        setLettersList(resData.letters);
      } else {
        alert(resData.message ? resData.message : resData.error);
      }
    });
  }

  useEffect(() => {
    loadLetters();
  }, []);

  const handleInput = (event, index) => {
    const { name, value } = event.target;
    if (name === 'Paragraph') {
      setState((prevState) => {
        const newParagraphs = [...prevState.paragraphs];
        newParagraphs[index] = value;
        return { ...prevState, paragraphs: newParagraphs };
      });
    } else {
      setState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const addParagraph = () => {
    setState((prevState) => ({ ...prevState, paragraphs: [...prevState.paragraphs, ''] }));
  };

  const removeParagraph = (index) => {
    setState((prevState) => {
      const newParagraphs = [...prevState.paragraphs];
      newParagraphs.splice(index, 1);
      return { ...prevState, paragraphs: newParagraphs };
    });
  };


  const [success, setSuccess] = useState(false);

  const previewLetter = (letter) => {
    setState({
      name: letter.name,
      jobTitle: letter.jobTitle,
      address: letter.address,
      yourName: letter.yourName,
      paragraphs: letter.paragraphs,
      email: letter.email,
      phone: letter.phone,
    });
  }

  const saveLetter = () => {

    fetch(process.env.REACT_APP_API_URL + '/letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authUser.token,
      },
      body: JSON.stringify(state)
    }).then(res => {
      return res.json();
    }).then(resData => {
      if (resData.letter) {
        setLettersList([...lettersList, resData.letter]);
        setSuccess(true);
        setTimeout(() => { setSuccess(false); }, 4000);
      } else {
        alert(resData.message ? resData.message : resData.error);
      }
    });

  }




  return (
    <div id="CoverLetterPage">

      <div id='formCover'>
        {success && <div className='success'>
          Letter
        </div>}
        <div id="resumesContainer">
          <h1>My Letters</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Job Title</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {lettersList.map((letter) => (
                <tr key={letter._id}>
                  <td>{letter.name}</td>
                  <td>{letter.jobTitle}</td>
                  <td>
                    <button onClick={() => previewLetter(letter)}>
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h1>To</h1>
        <div id='Input1'>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={state.name}
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
            placeholder="Address"
            id='AdrressID'
            value={state.address}
            onChange={handleInput}
          />
        </div>
        <h1>Personal Information</h1>
        <div id='Input2'>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
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

          <input
            type="text"
            name="yourName"
            placeholder="Your Name"
            value={state.yourName}
            onChange={handleInput}
          />
        </div>
        <h1>Paragraphs</h1>
        {state.paragraphs.map((paragraph, index) => (
          <>
            <textarea
              key={index}
              name="Paragraph"
              placeholder={`Letter Paragraph ${index + 1}`}
              id={`letter${index}`}
              value={paragraph}
              onChange={(event) => handleInput(event, index)}
            />
            <button type="button" className='RemoveButtonsCover' onClick={() => removeParagraph(index)}>Remove Paragraph</button>
          </>
        ))}
        <button type="button" onClick={addParagraph}>Add Paragraph</button>


        <div id='saveDiv'>
          <button onClick={saveLetter}>Save</button>
        </div>
        <div id='saveDiv'>
          <SaveDivAsPDF divId="LetterPaper"></SaveDivAsPDF>
        </div>
      </div>

      <div id="LetterPaper">
        <p id="FirstName">{state.name}</p>
        <p id="JobTitle">{state.jobTitle}</p>
        <div id='contact'>
          <p id="Address">{state.address}</p>
          <p id="Email">{state.email}</p>
          <p id="Phone">{state.phone}</p>
        </div>
        <p id='greet'>Dear {state.name}:</p>
        <div className='Paragraphs'>
          {state.paragraphs.map((paragraph, index) => (
            <p key={index} id={`BodyP${index}`}>{paragraph}</p>
          ))}
          <p>Please find enclosed my resume for your review. I can be reached via email at {state.Email} or by phone at {state.Phone}. I enthusiastically look forward to
            hearing from you soon.</p>

          <p>Thank you for your time and consideration.</p>
          <p>Sincerely, </p>
          <p>{state.yourName}</p>
        </div>
      </div>
    </div>
  );
}
