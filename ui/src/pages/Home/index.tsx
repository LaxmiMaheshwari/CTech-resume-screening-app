import React, { useState } from 'react';
import type { FC } from 'react';
import ResumeUploader from '../../components/ResumeUploader';
import MatchingScore from '../../components/MatchingScore';

// Type for each breakdown item
interface BreakdownItem {
  label: string;
  score: number;
  description: string;
}

// Type for matchData state
interface MatchData {
  score: number;
  breakdown: BreakdownItem[];
}

const Home: FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null);

  const handleFormSubmit = (resumeText: string, jdText: string) => {
    // Dummy logic for matching — replace with real API call later
    const dummyScore = 78;
    const dummyBreakdown: BreakdownItem[] = [
      { label: 'Skills Match', score: 85, description: '8 out of 10 skills matched' },
      { label: 'Keyword Match', score: 72, description: '15 of 21 keywords matched' },
      { label: 'Experience Alignment', score: 65, description: 'Experience slightly below required level' },
    ];

    setMatchData({ score: dummyScore, breakdown: dummyBreakdown });
    setSubmitted(true);
  };

  return (
    <div className="App">
      {!submitted || !matchData ? (
        <ResumeUploader onSubmit={handleFormSubmit} />
      ) : (
        <MatchingScore score={matchData.score.toString()} breakdown={matchData.breakdown} />
      )}
    </div>
  );
};

export default Home;
