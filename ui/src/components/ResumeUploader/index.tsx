import React, { useState } from "react";
import { useUploadResumeMutation } from "../../redux/api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import {
  clearMatchData,
  setMatchData,
} from "../../redux/features/match/matchSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppSelector } from "../../hooks";
import MatchScore from "../MatchingScore/index";

import typingAnimation from "../../assets/images/typing_animation.gif";
import resumeImage from "../../assets/images/resume_image.png";
import { ToastContainer, toast } from "react-toastify";

const ResumeJobUpload: React.FC = () => {
  // const [jobDescFile, setJobDescFile] = useState<File | null>(null);

  const { user } = useSelector((state: RootState) => state.loginUser);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // const [resumeText, setResumeText] = useState<string>("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  // const [jdText, setJdText] = useState<string>("");
  const [uploadResume] = useUploadResumeMutation();
  const matchData = useAppSelector((state) => state.match.data);

  const categories = [
    "An overall Compatibility Score",
    "Experience Score",
    "Technical Score",
    "Education Score",
    "Soft Skills Score",
  ];

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) setResumeFile(file);

    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("File Upload Error. Only PDF, Docs files are allowed.");
    } else {
      setResumeFile(file);
    }
  };

  const handleJobDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("File Upload Error. Only PDF, Docs files are allowed.");
    } else {
      setJdFile(file);
    }
  };

  const handleCancel = () => {
    setResumeFile(null);
    // setJobDescFile(null);
    setJdFile(null);
    dispatch(clearMatchData()); // Store the response
  };

  const deleteResumeFile = () => {
    setResumeFile(null);
  };

  const deleteJobDescFile = () => {
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
      // navigate("/match-score");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    // <div
    //   className="mx-auto mt-12 p-6 bg-[#313233] shadow-lg rounded-lg"
    //   style={{
    //     width: " clamp(10px, 40vw, 2000px)",
    //     padding: " clamp(4px, 1.3vw, 500px)",
    //   }}
    // >
    //   <div
    //     className="flex justify-between items-center text-white "
    //     style={{
    //       marginBottom: " clamp(10px, 1vw, 2000px)",
    //     }}
    //   >
    //     <h2
    //       className="text-white"
    //       style={{
    //         fontSize: " clamp(10px, 1.2vw, 2000px)",
    //       }}
    //     >
    //       Upload Resume & Job Description
    //     </h2>
    //   </div>

    //   <div className="mb-5">
    //     <label className="block text-white mb-2">Resume (PDF, DOC, DOCX)</label>
    //     <input
    //       type="file"
    //       accept=".pdf,.doc,.docx"
    //       onChange={handleResumeChange}
    //       className="cursor-pointer w-full border border-[#D6D6D680] rounded-md text-white"
    //     />
    //     {resumeFile && (
    //       <p className="mt-2 text-sm text-green-600">{resumeFile.name}</p>
    //     )}
    //   </div>

    //   <div className="mb-5">
    //     <label className="block text-white mb-2">
    //       Job Description (PDF, DOC, DOCX)
    //     </label>
    //     <input
    //       type="file"
    //       accept=".pdf,.doc,.docx"
    //       onChange={handleJobDescChange}
    //       className="cursor-pointer w-full border border-[#D6D6D680] rounded-md text-white"
    //     />
    //     {jdFile && <p className="mt-2 text-sm text-green-600">{jdFile.name}</p>}
    //   </div>

    //   <div className="flex justify-end space-x-4 mt-6">
    //     <button
    //       onClick={handleCancel}
    //       className="mt-2 bg-gray-200 text-gray-700  px-3 py-1 rounded hover:bg-blue-700"
    //     >
    //       Clear
    //     </button>

    //     {loading ? (
    //       <div className="flex">
    //         <button
    //           onClick={handleSubmit}
    //           className="mt-2 bg-[#043C8B] text-white px-3 py-1 rounded hover:bg-blue-700"
    //         >
    //           Submit
    //           <img
    //             src={typingAnimation}
    //             style={{
    //               height: " clamp(12px, 2.2vw, 600px)",
    //               marginTop: " clamp(-100px, -0.2vw, 600px)",
    //               display: "inline",
    //             }}
    //           ></img>
    //         </button>
    //       </div>
    //     ) : (
    //       <button
    //         onClick={handleSubmit}
    //         className="mt-2 bg-[#043C8B] text-white px-3 py-1 rounded hover:bg-blue-700"
    //       >
    //         Submit
    //       </button>
    //     )}
    //   </div>
    // </div>

    <div className="min-h-screen bg-[#040322] text-white flex">
      {/* LEFT PANEL */}
      <div className="w-[35%] p-10 bg-[#0303034D]">
        <div className="flex items-center">
          <div className="flex flex-col">
            <h2 className="text-[16px]  font-bold text-white">
              Resume Screening Details
            </h2>
            <p className="text-white text-[12px]">
              Automates resume filtering to quickly identify and shortlist the
              best candidates
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center ml-1">
              {(resumeFile || jdFile) && (
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center text-gray-300 hover:text-white  rounded-[30px]
          bg-[#002D94]
          "
                  style={{
                    width: "clamp(10px, 5vw, 2000px)",
                    height: "clamp(10px, 3vw, 2000px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(10px, 1vw, 42px)",
                    }}
                    className="font-poppins font-normal leading-[100%] tracking-normal align-middle
         "
                  >
                    {/* <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.032 16.25C8.28712 16.25 6.80927 15.6447 5.59844 14.434C4.38747 13.2233 3.78198 11.7457 3.78198 10.0013C3.78198 8.25681 4.38747 6.77882 5.59844 5.56729C6.80927 4.35576 8.28712 3.75 10.032 3.75C11.0063 3.75 11.9283 3.9666 12.798 4.39979C13.6676 4.83313 14.3909 5.44451 14.9678 6.23396V4.375C14.9678 4.19792 15.0277 4.04951 15.1476 3.92979C15.2675 3.80993 15.4159 3.75 15.593 3.75C15.7702 3.75 15.9187 3.80993 16.0382 3.92979C16.158 4.04951 16.2178 4.19792 16.2178 4.375V8.09292C16.2178 8.30639 16.1457 8.48528 16.0014 8.62958C15.8569 8.77389 15.678 8.84604 15.4647 8.84604H11.7468C11.5697 8.84604 11.4212 8.78618 11.3014 8.66646C11.1816 8.5466 11.1218 8.39806 11.1218 8.22083C11.1218 8.04375 11.1816 7.89535 11.3014 7.77562C11.4212 7.65604 11.5697 7.59625 11.7468 7.59625H14.4134C13.9743 6.79167 13.3652 6.15785 12.5864 5.69479C11.8076 5.2316 10.9561 5 10.032 5C8.64309 5 7.46254 5.48611 6.49032 6.45833C5.51809 7.43056 5.03198 8.61111 5.03198 10C5.03198 11.3889 5.51809 12.5694 6.49032 13.5417C7.46254 14.5139 8.64309 15 10.032 15C11.0005 15 11.8871 14.7457 12.6918 14.2371C13.4965 13.7286 14.1061 13.0502 14.5207 12.2019C14.5998 12.0502 14.7159 11.9442 14.8693 11.8838C15.0226 11.8235 15.1789 11.82 15.338 11.8733C15.5079 11.9268 15.6268 12.0379 15.6947 12.2067C15.7625 12.3756 15.7568 12.5358 15.6778 12.6875C15.1617 13.7665 14.3999 14.63 13.3924 15.2779C12.3849 15.926 11.2648 16.25 10.032 16.25Z"
                        fill="white"
                      />
                    </svg> */}
                    Reset
                  </div>
                </button>
              )}

              {!resumeFile && !jdFile && (
                <>
                  <div
                    className="flex items-center justify-center text-gray-300   rounded-[30px]
          bg-[#434343]
          "
                    style={{
                      width: "clamp(10px, 6vw, 2000px)",
                      height: "clamp(10px, 3vw, 2000px)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(10px, 1vw, 42px)",
                      }}
                      className="font-poppins font-normal leading-[100%] tracking-normal align-middle
         "
                    >
                      {/* <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.032 16.25C8.28712 16.25 6.80927 15.6447 5.59844 14.434C4.38747 13.2233 3.78198 11.7457 3.78198 10.0013C3.78198 8.25681 4.38747 6.77882 5.59844 5.56729C6.80927 4.35576 8.28712 3.75 10.032 3.75C11.0063 3.75 11.9283 3.9666 12.798 4.39979C13.6676 4.83313 14.3909 5.44451 14.9678 6.23396V4.375C14.9678 4.19792 15.0277 4.04951 15.1476 3.92979C15.2675 3.80993 15.4159 3.75 15.593 3.75C15.7702 3.75 15.9187 3.80993 16.0382 3.92979C16.158 4.04951 16.2178 4.19792 16.2178 4.375V8.09292C16.2178 8.30639 16.1457 8.48528 16.0014 8.62958C15.8569 8.77389 15.678 8.84604 15.4647 8.84604H11.7468C11.5697 8.84604 11.4212 8.78618 11.3014 8.66646C11.1816 8.5466 11.1218 8.39806 11.1218 8.22083C11.1218 8.04375 11.1816 7.89535 11.3014 7.77562C11.4212 7.65604 11.5697 7.59625 11.7468 7.59625H14.4134C13.9743 6.79167 13.3652 6.15785 12.5864 5.69479C11.8076 5.2316 10.9561 5 10.032 5C8.64309 5 7.46254 5.48611 6.49032 6.45833C5.51809 7.43056 5.03198 8.61111 5.03198 10C5.03198 11.3889 5.51809 12.5694 6.49032 13.5417C7.46254 14.5139 8.64309 15 10.032 15C11.0005 15 11.8871 14.7457 12.6918 14.2371C13.4965 13.7286 14.1061 13.0502 14.5207 12.2019C14.5998 12.0502 14.7159 11.9442 14.8693 11.8838C15.0226 11.8235 15.1789 11.82 15.338 11.8733C15.5079 11.9268 15.6268 12.0379 15.6947 12.2067C15.7625 12.3756 15.7568 12.5358 15.6778 12.6875C15.1617 13.7665 14.3999 14.63 13.3924 15.2779C12.3849 15.926 11.2648 16.25 10.032 16.25Z"
                          fill="white"
                        />
                      </svg> */}
                      Reset
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center bg-[#101213] border-[1px] border-dashed border-gray-500 rounded-xl p-5 text-center mt-[20px]">
          <div className="mb- 4 text-4xl">📄</div>

          {resumeFile && (
            <>
              <p className="mt-2 text-sm text-[#CFCFCF]">{resumeFile.name}</p>

              <button
                onClick={deleteResumeFile}
                className="mt-6 px-6 py-2 bg-[#101213] border border-[#464848] rounded-lg"
              >
                Delete File
              </button>
            </>
          )}

          {!resumeFile && (
            <>
              <p className="text-sm text-gray-400 mt-[10px]">PDF, DOC, DOCX</p>

              <label
                htmlFor="resume-upload"
                className="mt-[5px] w-[200px] block px-6 py-2 bg-[#101213] border border-[#464848] rounded-lg cursor-pointer"
              >
                Upload Resume
              </label>
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                onChange={handleResumeChange}
              />
            </>
          )}
        </div>

        <div className="flex flex-col items-center bg-[#101213] border-[1px] border-dashed border-gray-500 rounded-xl p-5 text-center mt-[20px]">
          <div className="mb- 4 text-4xl">📄</div>
          {/* <p className="font-medium mb-1">Drag & Drop your Resume</p> */}

          {jdFile && (
            <>
              <p className="mt-2 text-sm text-[#CFCFCF]">{jdFile.name}</p>

              <button
                onClick={deleteJobDescFile}
                className="mt-6 px-6 py-2 bg-[#101213] border border-[#464848] rounded-lg"
              >
                Delete File
              </button>
            </>
          )}

          {!jdFile && (
            <>
              <p className="text-sm text-gray-400 mt-[10px]">PDF, DOC, DOCX</p>

              <label
                htmlFor="resume-upload"
                className="mt-[5px] w-[200px] block px-6 py-2 bg-[#101213] border border-[#464848] rounded-lg cursor-pointer"
              >
                Upload Job File
              </label>
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                onChange={handleJobDescChange}
              />
            </>
          )}

          {/* <button className="mt-6 px-6 py-2 bg-[#101213] border border-[#464848] rounded-lg">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
          </button> */}
        </div>

        {resumeFile && jdFile && !loading && (
          <div className="flex justify-center mt-[10px]">
            <button
              onClick={handleSubmit}
              className="mt-[5px] w-[200px] block px-6 py-2 bg-[#5046FA] border border-[#464848] rounded-lg cursor-pointer"
            >
              Check Match
            </button>
          </div>
        )}

        {(!(resumeFile && jdFile) || loading) && (
          <div className="flex justify-center mt-[10px]">
            <div className="mt-[5px] w-[200px] block px-6 py-2 bg-[#434343] border border-[#464848] rounded-lg">
              Check Match
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[65%] flex flex-col justify-center items-center  p-5">
        {/* Illustration Image */}

        {loading ? (
          <div className="flex flex-col items-center">
            <div>
              <img
                src={typingAnimation}
                style={{
                  height: " clamp(12px, 2.2vw, 600px)",
                  marginTop: " clamp(-100px, -0.2vw, 600px)",
                  display: "inline",
                }}
              ></img>
            </div>
            <div>
              Analyzing your resume and job description… This may take a few
              seconds
            </div>
          </div>
        ) : (
          <>
            {matchData && <MatchScore></MatchScore>}
            {!matchData && (
              <>
                <img
                  src={resumeImage}
                  alt="Illustration"
                  className="w-[220px]"
                />

                <div className="   ">
                  {/* Welcome Header */}
                  <h1 className="text-[20px] font-bold  mb-4">
                    Welcome,{" "}
                    <span className="text-[#5046FA]">{user?.given_name}</span>
                  </h1>

                  {/* Introduction */}
                  <p className="mb-2 text-[14px]">
                    Hi, I'm Resume Screening smart resume match analyzer.
                  </p>
                  <p className=" mb-2 text-[14px]">
                    Upload your <span className="font-semibold">resume</span>{" "}
                    and the{" "}
                    <span className="font-semibold">job description</span>, and
                    I’ll show you how well they align.
                  </p>

                  {/* What You'll Get */}
                  <div className="mb-6">
                    <h2 className="font-semibold text-[14px] mb-1">
                      What you’ll get:
                    </h2>
                    <ul className="list-disc list-inside text-[14px] mb-1">
                      {categories.map((category, index) => (
                        <li key={index}>{category}</li>
                      ))}
                    </ul>
                    {/* <p className="text-[14px] mb-1">
                      • An overall compatibility score
                    </p> */}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <ToastContainer
        // toastClassName="z-[9999]"
        toastStyle={{ width: " clamp(10px, 20vw, 2000px)" }}
        position="bottom-right"
        autoClose={3000}
        pauseOnHover
        draggable
        // progressClassName="bg-[#313233]"
        theme="colored"
      />
    </div>
  );
};

export default ResumeJobUpload;
