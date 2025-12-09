import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import MatchScore from "./components/MatchingScore";

import Signin from "./pages/Signin";
import Home from "./pages/Home";
import { ConfigProvider } from "antd";
import ResumeUploader from "./components/ResumeUploader";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
    children: [
      { element: <ResumeUploader />, index: true },
      { path: "upload", element: <ResumeUploader /> },
      { path: "match-score", element: <MatchScore /> },
      { path: "about", element: <About /> },

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
  return (
    <ConfigProvider theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
