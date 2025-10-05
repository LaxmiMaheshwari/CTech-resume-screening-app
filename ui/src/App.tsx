// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Header from "./components/Header";
// import ResumeUploader from "./components/ResumeUploader";
// import MatchScore from "./components/MatchingScore";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import "./index.css";

// function App() {
//   return (
//     <Router>
//       <Header />
//       <div className="layout">
//         <Sidebar />
//         <main className="main-content">
//           <Routes>
//             <Route path="/" element={<Navigate to="/upload" replace />} />
//             <Route path="/upload" element={<ResumeUploader />} />
//             <Route path="/match-score" element={<MatchScore />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;

import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//  import AuthGuard from "./components/AuthGuard";
import Signin from "./pages/Signin";
// import Home from "./pages/Home";
import { ConfigProvider } from "antd";
import { useDispatch } from "react-redux";
import Sidebar from "./components/Sidebar";
import ResumeUploader from "./components/ResumeUploader";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/",
    element: (
      // <AuthGuard>
      <ResumeUploader />
      // </AuthGuard>
    ),
    children: [
      { element: <ResumeUploader />, index: true },
      { path: "upload", element: <ResumeUploader /> },

      // { path: "competitiveIntelligencecenter", element: <ExecutiveSummary /> },
      // { path: "faqs", lazy: () => import("./pages/FAQs") },
      // {
      //   path: "product-documentation",
      //   lazy: () => import("./pages/ProductDocumentation"),
      // },
      // {
      //   path: "release-notes",
      //   lazy: () => import("./pages/ReleaseNotes"),
      // },
    ],
  },
]);
const theme = {
  token: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "400",
  },
};

const App = () => {
  const dispatch = useDispatch();

  return (
    <ConfigProvider theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
