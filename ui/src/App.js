import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Home from './pages/Home';
import About from './pages/About';
import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="app-container">
//       <Header />

//         {/* <Sidebar /> */}
//         <div className="content">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import Settings from './pages/Settings';
// import './App.css';

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
