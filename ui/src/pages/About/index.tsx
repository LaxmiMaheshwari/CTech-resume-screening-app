import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

export default function About() {
  const faqs: FAQ[] = [
    {
      question: " How does the application improve recruitment efficiency?",
      answer:
        "By instantly calculating match percentages, the application drastically reduces the time human recruiters spend on manual initial screening. It allows recruiters to focus their time on engaging with the top-matched candidates, thereby shortening the time-to-hire.",
    },

    {
      question: "How is the match percentage calculated?",
      answer:
        "The application uses a vertex AI to analyze and compare the text from the candidate's resume against the text in the job description. It scores alignment based on keywords, required skills, experience length, educational qualifications, and contextual relevance, synthesizing these factors into a single percentage.",
    },
    {
      question: "Can the application read different file formats?",
      answer:
        "Yes. The application is built with robust document parsing capabilities that can accurately extract and process text from various standard file formats such as PDF and DOCX.",
    },

    {
      question:
        "Does the application screen for hard skills, soft skills, or both?",
      answer:
        "The application is trained to identify both hard skills like Python, SQL, Financial Modeling, etc. and soft skills like communication, leadership, teamwork, etc. mentioned in the resume, provided these skills are explicitly or contextually implied in the job description.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-[#0f172a]">
      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center text-white">
        <h1 className="text-[18px] font-bold">About Our App</h1>
        <p className="text-[16px]  mt-4">
          This is an AI-powered application that automates resume screening by
          calculating a match percentage between candidate resumes and job
          descriptions, thereby improving recruitment efficiency and quality of
          hire.
        </p>

        <p className="text-white mt-6 text-[16px]">
          To know more about our application, please{" "}
          <a
            target="_blank"
            href="https://docs.google.com/document/d/1SmQys1JY2SsHB1U97ojD3dtm6A9wKwOdcwiROq9-Rk4/edit?tab=t.0"
            className="font-semibold transition text-blue-700"
          >
            visit this link
          </a>
        </p>
        {/* One-liner */}
        {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl mt-6 inline-block shadow-md">
          <span className="font-semibold">“Know better. Do better.”</span>
        </div> */}
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-2xl mx-auto mt-20 text-white">
        <h2 className="text-[18px] font-bold  text-center text-white">
          Frequently Asked Questions
        </h2>

        <div className="mt-8 space-y-4 ">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#282A2C] text-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => toggleFAQ(i)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-[16px] font-medium text-white">
                  {faq.question}
                </h3>
                <span className="text-blue-600 text-[16px]">
                  {openIndex === i ? "-" : "+"}
                </span>
              </div>

              {openIndex === i && (
                <p className="text-white mt-3 text-[16px]">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
