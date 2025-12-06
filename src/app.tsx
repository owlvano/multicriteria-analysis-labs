import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/common/navbar";
import Lab1App from "@/features/lab-1-app";
import Lab2App from "@/features/lab-2-app";
import Lab3App from "@/features/lab-3-app";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 p-6">
          <Routes>
            {/* default route */}
            <Route path="/" element={<Navigate to="/lab-1" replace />} />

            {/* lab routes */}
            <Route path="/lab-1" element={<Lab1App />} />
            <Route path="/lab-2" element={<Lab2App />} />
            <Route path="/lab-3" element={<Lab3App />} />

            {/* fallback */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
