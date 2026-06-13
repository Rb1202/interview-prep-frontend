import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import UserProvider from "./context/userContext";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Home/Dashboard"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep/InterviewPrep"));
const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/interview-prep/:sessionId"
                element={<InterviewPrep />}
              />
            </Routes>
          </Suspense>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;
