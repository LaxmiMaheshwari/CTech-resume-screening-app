


// components/ResumeUploader.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { MatchScoreResponse } from "../../types/resume";
import './index.css';
import { useUploadResumeMutation } from '../../redux/api';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { setMatchData } from '../../redux/features/match/matchSlice';

const ResumeUploader= () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();;
  const [loading, setLoading] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState<string>('');
  const [uploadResume, { isLoading }] = useUploadResumeMutation();

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setterFile: React.Dispatch<React.SetStateAction<File | null>>,
    setterText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setterFile(file)
  };


  const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsText(file); // Read as plain text
  });
};


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resumeFile || !jdFile) {
      alert("Please provide both resume and job description.");
      return;
    }
    let jobdesc : any= null

    if (jdFile.type === 'application/pdf') {
        alert("Job desc should be text")
        return 
    } else if (jdFile.type === 'text/plain') {
      const text = await readFileAsText(jdFile);
      jobdesc = text
      console.log("jobdesc", jobdesc)
    } else {
      alert('Only PDF or TXT files are allowed.');
    }

    const formData = new FormData();
    formData.append('resume_file', resumeFile);
    formData.append('jd_text', jobdesc);
    try {
      setLoading(true)
      const response: any = await uploadResume(formData).unwrap();
            setLoading(false)

      dispatch(setMatchData(response)); // Store the response
      navigate('/match-score');
    } catch (error) {
      console.error('Upload failed:', error);
    }

  };

  return (
     <div className="uploader-container">
      <h2>Resume Matcher</h2>
      {/* Resume Input */}
      <form onSubmit={handleSubmit}>
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
        <label>Job Description (TXT):</label>
        <input
          id="jd-input"
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => handleFileChange(e, setJdFile, setJdText)}
        />
        {jdFile && <p className="file-name">📄 {jdFile.name}</p>}
      </div>

      {/* Buttons */}
      {/* <div className="button-group">
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div> */}

         <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>
      </form>
    </div>


  );
};

export default ResumeUploader;
