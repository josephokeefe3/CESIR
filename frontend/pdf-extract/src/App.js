import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.jpg';  // Ensure this points to your .jpg file

function App() {
  const [file, setFile] = useState(null);
  const [extractedInfo, setExtractedInfo] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExtractedInfo(response.data.extracted_info);
      setSubmitted(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/submit', {
        text: '', // Adjust as per backend requirements
        extracted_info: extractedInfo,
      });
      setSubmitted(true);
      setFile(null);
      setExtractedInfo({});
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleStartOver = () => {
    setFile(null);
    setExtractedInfo({});
    setSubmitted(false);
  };

  return (
    <div className="App">
      <div className="Header">
        <img src={logo} alt="Company Logo" className="Logo" />
      </div>
      <h1>CESIR Model Trainer</h1>
      {!submitted && (
        <>
          <input type="file" onChange={handleFileChange} accept=".pdf" className='Spacing'/>
          <button onClick={handleUpload} className='Spacing'>Extract Info</button>
        </>
      )}

      {file && (
        <div className="MainContent">
          <div className="PDFPreview">
            <h2>PDF Preview</h2>
            <embed src={URL.createObjectURL(file)} type="application/pdf" width="100%" height="100%" />
          </div>

          {Object.keys(extractedInfo).length > 0 && (
            <div className="ExtractedInfo">
              <h2>Extracted Information</h2>
              {Object.keys(extractedInfo).map((key) => (
                <div key={key}>
                  <label htmlFor={key}>{key}</label>
                  <input
                    type="text"
                    id={key}
                    value={extractedInfo[key]}
                    onChange={(e) =>
                      setExtractedInfo((prevInfo) => ({
                        ...prevInfo,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
              <button onClick={handleSubmit}>Submit</button>
            </div>
          )}
        </div>
      )}

      {submitted && (
        <div>
          <p>Data saved successfully!</p>
          <button onClick={handleStartOver}>Start Over</button>
        </div>
      )}
    </div>
  );
}

export default App;
