import React, { useState, ChangeEvent, FormEvent } from "react";
import { MatchScoreResponse } from "../../types/resume";
import { useUploadResumeMutation } from "../../redux/api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { setMatchData } from "../../redux/features/match/matchSlice";

const ResumeJobUpload: React.FC = () => {
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState<string>("");
  const [uploadResume, { isLoading }] = useUploadResumeMutation();

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleJobDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setJdFile(file);
  };

  const handleCancel = () => {
    setResumeFile(null);
    setJobDescFile(null);
    setJdFile(null);
  };

  // const handleSubmit = () => {
  //   if (!resumeFile || !jobDescFile) {
  //     alert("Please upload both files.");
  //     return;
  //   }

  //   // Upload logic goes here (API call, form data, etc.)
  //   console.log("Submitting files:", { resumeFile, jobDescFile });
  //   alert("Submitted successfully!");
  // };

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
    let jobdesc: any = null;

    if (jdFile.type === "application/pdf") {
      alert("Job desc should be text");
      // return
    } else if (jdFile.type === "text/plain") {
      const text = await readFileAsText(jdFile);
      jobdesc = text;
      console.log("jobdesc", jobdesc);
    } else {
      alert("Only PDF or TXT files are allowed.");
    }

    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    // formData.append("jd_text", jdFile);
    formData.append("jd_text", jobdesc);

    try {
      setLoading(true);
      const response: any = await uploadResume(formData).unwrap();
      setLoading(false);

      dispatch(setMatchData(response)); // Store the response
      navigate("/match-score");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Upload Resume & Job Description
      </h2>

      {/* Resume Upload */}
      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2">
          Resume (PDF, DOC, DOCX)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
          className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {resumeFile && (
          <p className="mt-2 text-sm text-green-600">{resumeFile.name}</p>
        )}
      </div>

      {/* Job Description Upload */}
      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2">
          Job Description (PDF, DOC, DOCX)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleJobDescChange}
          className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {jobDescFile && (
          <p className="mt-2 text-sm text-green-600">{jobDescFile.name}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleCancel}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ResumeJobUpload;
