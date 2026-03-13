import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaBell, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null; // Don't show navbar on login page
  }

  const isActive = (path) => location.pathname === path ? 'nav-link active fw-bold text-white' : 'nav-link text-white-50';

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#1a237e' }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand text-white d-flex align-items-center" to="/student-details">
          <FaGraduationCap className="me-2" />
          <span className="fw-semibold">MRIET</span>
        </Link>
        <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className={isActive('/student-details')} to="/student-details">Student Details</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/student-attendance')} to="/student-attendance">Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/result')} to="/result">Result</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/payment-dashboard')} to="/payment-dashboard">Payment Dashboard</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center text-white">
            <FaBell className="me-4 fs-5" style={{ cursor: 'pointer' }} />
            <div className="dropdown">
              <div
                className="d-flex align-items-center dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt="Profile"
                  className="rounded-circle me-2 border border-white"
                  width="32"
                  height="32"
                />
                <span className="me-1 fw-medium">
                  {user.student ? `${user.student.name}'s Parent` : user.name}
                </span>
              </div>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li><button className="dropdown-item py-2" onClick={handleLogout}><FaSignOutAlt className="me-2" />Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
