import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaPrint,
  FaWallet,
  FaHourglassHalf,
  FaFileAlt,
  FaClock,
  FaShieldAlt
} from "react-icons/fa";

/* =========================================
   PAYMENT GATEWAY MODAL
========================================= */

function PaymentGatewayModal({ amount, student, onSuccess, onClose }) {

  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);

    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.55)"
      }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ width: "420px" }}
      >
        <h4 className="fw-bold mb-3 text-center">
          <FaShieldAlt className="me-2" />
          Secure Payment
        </h4>

        <h5 className="text-center mb-4">
          Pay ₹ {amount.toLocaleString()}
        </h5>

        {processing ? (
          <div className="text-center">
            <div className="spinner-border text-primary mb-3"></div>
            <p>Processing payment...</p>
          </div>
        ) : (
          <>
            <button
              className="btn btn-primary w-100 py-2"
              onClick={handlePay}
            >
              Pay Now
            </button>

            <button
              className="btn btn-link text-secondary w-100 mt-2"
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================
   MAIN DASHBOARD
========================================= */

const Paymentdashboard = () => {

  const userStr = localStorage.getItem("user");

  const user = useMemo(() => (userStr ? JSON.parse(userStr) : null), [userStr]);

  const [transactions, setTransactions] = useState([]);

  const [showGateway, setShowGateway] = useState(false);

  const [showReceipt, setShowReceipt] = useState(false);

  const [selectedTxn, setSelectedTxn] = useState(null);

  /* =========================================
     FETCH PAYMENTS FROM API
  ========================================= */

  useEffect(() => {

    const fetchPayments = async () => {

      try {

        if (user && user.student) {

          const token = localStorage.getItem("token");
          const res = await axios.get(
            `http://localhost:5002/api/payments/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }
          );

          if (res.data && res.data.transactions) {
            setTransactions(res.data.transactions);
          }

        }

      } catch (err) {
        console.error("Payment fetch error:", err);
      }

    };

    fetchPayments();

  }, [user]);

  /* =========================================
     HANDLE PAYMENT SUCCESS
  ========================================= */

  const handlePaymentSuccess = async () => {

    const newTxn = {
      date: new Date(),
      amount: user.student.feeDue,
      type: "Tuition Fee - Term 2",
      status: "Paid"
    };

    try {

      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5002/api/payments/me`,
        newTxn, {
        headers: { Authorization: `Bearer ${token}` }
      }
      );

      setTransactions(prev => [
        ...prev,
        {
          ...newTxn,
          id: `TXN${prev.length + 1}`,
          date: new Date().toLocaleDateString()
        }
      ]);

    } catch (err) {
      console.error("Payment save error:", err);
    }

    setShowGateway(false);
  };

  /* =========================================
     RECEIPT HANDLING
  ========================================= */

  const handleViewReceipt = (txn) => {

    setSelectedTxn(txn);

    setShowReceipt(true);
  };

  const handlePrint = () => window.print();

  const closeReceipt = () => {

    setShowReceipt(false);

    setSelectedTxn(null);
  };

  /* =========================================
     AUTH CHECK
  ========================================= */

  if (!user || user.type !== "parent") {

    return (
      <div className="container mt-5 text-center">

        <div className="alert alert-danger p-4">

          <FaExclamationTriangle className="fs-3 mb-2" />

          <h5>Please login as parent</h5>

        </div>

      </div>
    );
  }

  const { student } = user;

  const hasPending = !transactions.some(
    t => t.type === "Tuition Fee - Term 2"
  );

  const feeDue = hasPending ? (student?.feeDue || 0) : 0;

  /* =========================================
     RECEIPT VIEW
  ========================================= */

  if (showReceipt && selectedTxn) {

    return (

      <div className="container mt-4">

        <div className="card shadow p-4">

          <h3 className="mb-4">
            <FaShieldAlt className="me-2" />
            Payment Receipt
          </h3>

          <p><b>Student:</b> {student.name}</p>

          <p><b>Receipt ID:</b> {selectedTxn.id}</p>

          <p><b>Date:</b> {selectedTxn.date}</p>

          <p><b>Amount:</b> ₹ {selectedTxn.amount}</p>

          <p><b>Status:</b> SUCCESS</p>

          <div className="mt-4">

            <button
              className="btn btn-secondary me-3"
              onClick={closeReceipt}
            >
              <FaArrowLeft /> Back
            </button>

            <button
              className="btn btn-primary"
              onClick={handlePrint}
            >
              <FaPrint /> Print
            </button>

          </div>

        </div>

      </div>

    );
  }

  /* =========================================
     DASHBOARD VIEW
  ========================================= */

  return (

    <div className="container mt-4">

      {showGateway && (

        <PaymentGatewayModal

          amount={student?.feeDue || 0}

          student={student}

          onSuccess={handlePaymentSuccess}

          onClose={() => setShowGateway(false)}

        />

      )}

      <div className="row g-4">

        {/* Fee Due Card */}

        <div className="col-md-4">

          <div className="card shadow text-center p-4">

            <FaWallet className="fs-1 mb-3 text-primary" />

            <h6>Total Fee Due</h6>

            <h2 className={feeDue > 0 ? "text-danger" : "text-success"}>

              ₹ {feeDue.toLocaleString()}

            </h2>

            {feeDue > 0 ? (

              <button
                className="btn btn-warning mt-3"
                onClick={() => setShowGateway(true)}
              >
                <FaCreditCard className="me-2" />
                Pay Now
              </button>

            ) : (

              <div className="alert alert-success mt-3">

                <FaCheckCircle className="me-2" />
                All dues cleared

              </div>

            )}

          </div>

        </div>

        {/* Payment History */}

        <div className="col-md-8">

          <div className="card shadow">

            <div className="card-header">

              <h5 className="mb-0">
                <FaClock className="me-2" />
                Payment History
              </h5>

            </div>

            <table className="table mb-0">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>

              </thead>

              <tbody>

                {transactions.map(txn => (

                  <tr key={txn.id}>

                    <td>{txn.id}</td>

                    <td>{txn.date}</td>

                    <td>{txn.type}</td>

                    <td>₹ {txn.amount}</td>

                    <td>

                      <span className="badge bg-success">
                        {txn.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewReceipt(txn)}
                      >
                        <FaFileAlt /> Receipt
                      </button>

                    </td>

                  </tr>

                ))}

                {hasPending && (

                  <tr className="table-warning">

                    <td>PENDING</td>

                    <td>Upcoming</td>

                    <td>Tuition Fee - Term 2</td>

                    <td>₹ {student.feeDue}</td>

                    <td>

                      <span className="badge bg-warning text-dark">
                        <FaHourglassHalf /> Pending
                      </span>

                    </td>

                    <td>

                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => setShowGateway(true)}
                      >
                        Pay Now
                      </button>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Paymentdashboard;