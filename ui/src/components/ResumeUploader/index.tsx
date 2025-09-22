


// components/ResumeUploader.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { MatchScoreResponse } from "../../types/resume";

import './index.css';

interface ResumeUploaderProps {
  onResult: (result: MatchScoreResponse) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResult }) => {
  // const [resumeFile, setResumeFile] = useState<File | null>(null);
  // const [jobDescription, setJobDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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


  // const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   setResumeFile(file || null);
  // };

  //  const handleJobDescChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   setResumeFile(file || null);
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resumeFile || !jdText.trim()) {
      alert("Please provide both resume and job description.");
      return;
    }

    const formData = new FormData();

     formData.append('resume_file', resumeFile);
    formData.append('jd_text', jdText);

    try {
      setLoading(true);
      let apiUrl = `${import.meta.env.VITE_API_URL}screen_resume`;
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to fetch result");

      const data: MatchScoreResponse = await response.json();
      onResult(data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <div>
    //     <label>Upload Resume:</label>
    //     <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
    //   </div>

    //   <div>
    //     <label>Job Description:</label>
    //     <textarea
    //       rows={6}
    //       value={jobDescription}
    //       onChange={(e) => setJobDescription(e.target.value)}
    //     />
    //   </div>

    //   <button type="submit" disabled={loading}>
    //     {loading ? "Processing..." : "Submit"}
    //   </button>
    // </form>











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
      {/* <div className="button-group">
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div> */}

         <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>
      </form>
    </div>


  );
};

export default ResumeUploader;
