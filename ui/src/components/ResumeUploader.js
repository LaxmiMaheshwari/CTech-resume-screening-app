import React, { useState } from 'react';

import './ResumeUploader.css';


function ResumeUploader({ onSubmit }) {
    const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');

  const handleFileChange = (e, setterFile, setterText) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setterFile(file);
      setterText('');
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setterText(e.target.result);
        setterFile(null);
      };
      reader.readAsText(file);
    } else {
      alert('Only PDF or TXT files are allowed.');
    }
  };

  const handleSubmit = () => {
    if ((!resumeFile && !resumeText) || (!jdFile && !jdText)) {
      alert('Please provide both Resume and Job Description (via file or text).');
      return;
    }

    // Submit logic here
    alert('Submitted!');
    console.log('Resume File:', resumeFile);
    console.log('Resume Text:', resumeText);
    console.log('JD File:', jdFile);
    console.log('JD Text:', jdText);


    const resume = resumeText || `PDF: ${resumeFile.name}`;
    const jd = jdText || `PDF: ${jdFile.name}`;

    onSubmit(resume, jd);
  };

  const handleCancel = () => {
    setResumeFile(null);
    setResumeText('');
    setJdFile(null);
    setJdText('');
    document.getElementById('resume-input').value = '';
    document.getElementById('jd-input').value = '';
  };

  return (
    <div className="uploader-container">
      <h2>Upload Resume & Job Description...</h2>

      {/* Resume Input */}
      <div className="input-group">
        <label>Resume (PDF/TXT):</label>
        <input
          id="resume-input"
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => handleFileChange(e, setResumeFile, setResumeText)}
        />
        {resumeFile && <p className="file-name">📄 {resumeFile.name}</p>}
        {/* {!resumeFile && (
          <textarea
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        )} */}
      </div>

      {/* JD Input */}
      <div className="input-group">
        <label>Job Description (PDF/TXT):</label>
        <input
          id="jd-input"
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => handleFileChange(e, setJdFile, setJdText)}
        />
        {jdFile && <p className="file-name">📄 {jdFile.name}</p>}
        {/* {!jdFile && (
          <textarea
            placeholder="Paste the job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        )} */}
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default ResumeUploader;
