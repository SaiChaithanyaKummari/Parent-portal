import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Studentdetails from './pages/Studentdetails';
import Paymentdashboard from './pages/Paymentdashboard';
import Result from './pages/Result';
import Studentattendance from './pages/Studentattendance';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App bg-light min-vh-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student-details" element={<Studentdetails />} />
          <Route path="/payment-dashboard" element={<Paymentdashboard />} />
          <Route path="/result" element={<Result />} />
          <Route path="/student-attendance" element={<Studentattendance />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
