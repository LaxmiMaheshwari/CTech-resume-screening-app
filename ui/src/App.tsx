import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ResumeUploader from './components/ResumeUploader';
import MatchScore from './components/MatchingScore';
import Home from './pages/Home';
import About from './pages/About';
import './index.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
        {/* <Routes>
          <Route path="/" element={<Home />} />
             <Route path="/about" element={<About />} />
           </Routes> */}

            <Routes>
              <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<ResumeUploader />} />
        <Route path="/match-score" element={<MatchScore />} />
      </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
