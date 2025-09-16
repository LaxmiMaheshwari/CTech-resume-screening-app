import React, { useState } from 'react';
import type { ChangeEvent } from 'react';

import './index.css';

interface ResumeUploaderProps {
  onSubmit: (resume: string, jd: string) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onSubmit }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState<string>('');

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setterFile: React.Dispatch<React.SetStateAction<File | null>>,
    setterText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setterFile(file);
      setterText('');
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const text = event.target?.result as string;
        setterText(text);
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

    const resume = resumeText || `PDF: ${resumeFile?.name}`;
    const jd = jdText || `PDF: ${jdFile?.name}`;

    onSubmit(resume, jd);
  };

  const handleCancel = () => {
    setResumeFile(null);
    setResumeText('');
    setJdFile(null);
    setJdText('');
    (document.getElementById('resume-input') as HTMLInputElement).value = '';
    (document.getElementById('jd-input') as HTMLInputElement).value = '';
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
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ResumeUploader;
