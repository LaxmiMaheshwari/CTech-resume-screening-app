import React, { useState } from 'react';
import type { FC } from 'react';
import ResumeUploader from '../../components/ResumeUploader';
import MatchScore from '../../components/MatchingScore';
import axios from 'axios';
// App.tsx
import { MatchScoreResponse } from "../../types/resume";

const App: React.FC = () => {
  const [matchResult, setMatchResult] = useState<MatchScoreResponse | null>(null);

  return (
        <div >
          {!matchResult &&
      <ResumeUploader onResult={setMatchResult} />
      }

      {matchResult &&
      <MatchScore result={matchResult} />
      }
    </div>
  );
};

export default App;
