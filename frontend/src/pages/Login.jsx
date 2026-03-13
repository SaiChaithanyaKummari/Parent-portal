import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Parent");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (activeTab !== "Parent") {
      setError("Only Parent login is implemented.");
      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:5002/api/auth/login",
        {
          email: email,
          password: password
        }
      );

      const user = response.data.user;

      // store login data and token
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", response.data.token);

      // go to dashboard
      navigate("/student-details");

    } catch (err) {

      setError(
        err.response?.data?.message || "Invalid email or password"
      );

    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">

      <div
        className="row bg-white shadow-lg rounded overflow-hidden"
        style={{ maxWidth: "900px", width: "100%" }}
      >

        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f"
            alt="College Building"
            className="img-fluid h-100 object-fit-cover"
          />
        </div>

        <div className="col-md-6 p-5 d-flex flex-column justify-content-center">

          <h2
            className="mb-4 text-center"
            style={{ color: "#1a237e", fontWeight: "bold" }}
          >
            Welcome to <br /> College Management System
          </h2>

          {/* Tabs */}

          <div className="d-flex mb-4 border rounded">
            {["Admin", "Student", "Parent"].map((tab) => (
              <button
                key={tab}
                className={`flex-fill btn ${activeTab === tab
                    ? "btn-primary rounded-0"
                    : "btn-light rounded-0 border-0"
                  }`}
                style={{
                  backgroundColor:
                    activeTab === tab ? "#1a237e" : "transparent",
                  color: activeTab === tab ? "#fff" : "#6c757d",
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-danger p-2">{error}</div>}

          <form onSubmit={handleLogin}>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-bold py-2 mb-3"
              style={{ backgroundColor: "#1a237e" }}
            >
              Login
            </button>

            <div
              className="d-flex justify-content-between text-muted"
              style={{ fontSize: "0.9rem" }}
            >
              <span style={{ cursor: "pointer" }}>
                Forgot Password?
              </span>

              <span>
                Not Registered?{" "}
                <span
                  style={{ color: "#1a237e", cursor: "pointer" }}
                >
                  Sign Up
                </span>
              </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;