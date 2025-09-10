import React, { useState } from 'react';
import ResumeUploader from '../components/ResumeUploader'
import MatchingScore from '../components/MatchingScore';


function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [matchData, setMatchData] = useState(null); // to pass score/breakdown

  const handleFormSubmit = (resumeText, jdText) => {
    // 👇 Dummy match logic (replace with real match algorithm/API later)
    const dummyScore = 78;
    const dummyBreakdown = [
      { label: 'Skills Match', score: 85, description: '8 out of 10 skills matched' },
      { label: 'Keyword Match', score: 72, description: '15 of 21 keywords matched' },
      { label: 'Experience Alignment', score: 65, description: 'Experience slightly below required level' },
    ];

    setMatchData({ score: dummyScore, breakdown: dummyBreakdown });
    setSubmitted(true);
  };

  return (
    <div className="App">
      {!submitted ? (
        <ResumeUploader onSubmit={handleFormSubmit} />
      ) : (
        <MatchingScore score={matchData.score} breakdown={matchData.breakdown} />
      )}
    </div>
  );
}

export default Home;
