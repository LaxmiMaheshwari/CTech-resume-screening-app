import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

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
        <Routes>
          <Route path="/" element={<Home />} />
             <Route path="/about" element={<About />} />
           </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
