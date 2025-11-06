import React, { useState, ChangeEvent, FormEvent } from "react";
import { MatchScoreResponse } from "../../types/resume";
import { useUploadResumeMutation } from "../../redux/api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { setMatchData } from "../../redux/features/match/matchSlice";

import typingAnimation from "../../assets/images/typing_animation.gif";

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

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  const handleSubmit = async () => {
    //e.preventDefault();

    if (!resumeFile || !jdFile) {
      alert("Please provide both resume and job description.");
      return;
    }
    let jobdesc: any = null;

    if (jdFile.type === "application/pdf") {
      // alert("Job desc should be text");
      // return
    } else if (jdFile.type === "text/plain") {
      const text = await readFileAsText(jdFile);
      jobdesc = text;
      console.log("jobdesc", jobdesc);
    } else {
      // alert("Only PDF or TXT files are allowed.");
    }

    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    // formData.append("jd_text", jdFile);
    formData.append("jd_file", jdFile);

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
    // <div className="max-w-xl mx-auto mt-12 p-6 bg-[#313233] shadow-lg rounded-lg border border-gray-200">
    //   <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
    //     Upload Resume & Job Description
    //   </h2>

    //   {/* Resume Upload */}
    //   <div className="mb-5">
    //     <label className="block text-gray-700 font-medium mb-2">
    //       Resume (PDF, DOC, DOCX)
    //     </label>
    //     <input
    //       type="file"
    //       accept=".pdf,.doc,.docx"
    //       onChange={handleResumeChange}
    //       className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    //     />
    //     {resumeFile && (
    //       <p className="mt-2 text-sm text-green-600">{resumeFile.name}</p>
    //     )}
    //   </div>

    //   {/* Job Description Upload */}
    //   <div className="mb-5">
    //     <label className="block text-gray-700 font-medium mb-2">
    //       Job Description (PDF, DOC, DOCX)
    //     </label>
    //     <input
    //       type="file"
    //       accept=".pdf,.doc,.docx"
    //       onChange={handleJobDescChange}
    //       className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
    //     />
    //     {jobDescFile && (
    //       <p className="mt-2 text-sm text-green-600">{jobDescFile.name}</p>
    //     )}
    //   </div>

    //   {/* Action Buttons */}
    //   <div className="flex justify-end space-x-4 mt-6">
    //     <button
    //       onClick={handleCancel}
    //       className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
    //     >
    //       Cancel
    //     </button>
    //     <button
    //       onClick={handleSubmit}
    //       className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
    //     >
    //       Submit
    //     </button>
    //   </div>
    // </div>

    <div
      // className="w-80 bg-[#313233]  rounded-lg shadow-lg "
      className="mx-auto mt-12 p-6 bg-[#313233] shadow-lg rounded-lg"
      style={{
        width: " clamp(10px, 40vw, 2000px)",
        padding: " clamp(4px, 1.3vw, 500px)",
        // height: " clamp(4px, 30vw, 5000px)",
      }}
    >
      <div
        className="flex justify-between items-center text-white "
        style={{
          marginBottom: " clamp(10px, 1vw, 2000px)",
        }}
      >
        <h2
          className="text-white"
          style={{
            fontSize: " clamp(10px, 1.2vw, 2000px)",
          }}
        >
          Upload Resume & Job Description
        </h2>
      </div>

      {/* Resume Upload */}
      <div className="mb-5">
        <label className="block text-white mb-2">Resume (PDF, DOC, DOCX)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
          className="cursor-pointer w-full border border-[#D6D6D680] rounded-md text-white"
        />
        {resumeFile && (
          <p className="mt-2 text-sm text-green-600">{resumeFile.name}</p>
        )}
      </div>

      {/* Job Description Upload */}
      <div className="mb-5">
        <label className="block text-white mb-2">
          Job Description (PDF, DOC, DOCX)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleJobDescChange}
          className="cursor-pointer w-full border border-[#D6D6D680] rounded-md text-white"
        />
        {jdFile && <p className="mt-2 text-sm text-green-600">{jdFile.name}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleCancel}
          // className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          className="mt-2 bg-gray-200 text-gray-700  px-3 py-1 rounded hover:bg-blue-700"
        >
          Clear
        </button>

        {loading ? (
          <div className="flex">
            <button
              onClick={handleSubmit}
              // className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              className="mt-2 bg-[#043C8B] text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Submit
              <img
                src={typingAnimation}
                style={{
                  height: " clamp(12px, 2.2vw, 600px)",
                  marginTop: " clamp(-100px, -0.2vw, 600px)",
                  display: "inline",
                }}
              ></img>
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            // className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            className="mt-2 bg-[#043C8B] text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeJobUpload;
