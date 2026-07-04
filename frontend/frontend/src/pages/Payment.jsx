import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

const API = "https://week7-if5e.onrender.com";

function Payment() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [txnId, setTxnId] = useState("");

  const booking = JSON.parse(localStorage.getItem("booking")) || {
    service: "Web Development",
    price: 4999,
    bookingDate: new Date().toDateString(),
    timeSlot: "10:00 AM",
    _id: "",
  };

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Customer",
    email: "",
    phone: "",
  };

  const amount = booking.price || 4999;

  const handleDemoPayment = async () => {
    try {
      setLoading(true);
      setStep(2);

      // Create Razorpay Demo Order
      const { data: order } = await axios.post(
        `${API}/api/payments/create-order`,
        {
          amount,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verify Payment
      const { data } = await axios.post(
        `${API}/api/payments/verify`,
        {
          bookingId: booking._id,
          amount,
          orderId: order.id,
          serviceName: booking.service,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
        }
      );

      if (data.success) {
        localStorage.setItem("paymentStatus", "Paid");
        localStorage.setItem("lastTxnId", data.transactionId);

        setTxnId(data.transactionId);
        setStep(3);
      } else {
        throw new Error("Payment Failed");
      }
    } catch (err) {
      console.error(err);

      setStep(1);

      alert(
        "Payment failed.\n\nThe backend server may still be waking up on Render.\nPlease wait 30-60 seconds and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="payment-page">
        <div className="payment-card processing-card">
          <div className="spinner-ring"></div>

          <h2>Processing Payment...</h2>

          <p>Please wait...</p>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="payment-page">
        <div className="payment-card success-card">
          <div className="success-icon">✅</div>

          <h1>Payment Successful!</h1>

          <p>Your booking has been confirmed.</p>

          <div className="txn-box">
            <span>Transaction ID</span>

            <code>{txnId}</code>
          </div>

          <div className="success-details">
            <div className="row">
              <span>Service</span>

              <span>{booking.service}</span>
            </div>

            <div className="row">
              <span>Date</span>

              <span>{booking.bookingDate}</span>
            </div>

            <div className="row">
              <span>Time</span>

              <span>{booking.timeSlot}</span>
            </div>

            <div className="row">
              <span>Amount</span>

              <span>₹{amount}</span>
            </div>

            <div className="row">
              <span>Status</span>

              <span style={{ color: "green", fontWeight: "bold" }}>
                Paid
              </span>
            </div>
          </div>

          <div className="notification-badges">
            <span>📧 Email Sent</span>

            <span>📱 SMS Sent</span>
          </div>

          <button
            className="goto-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-card">

        <div className="payment-header">
          <h1>🔒 Secure Payment</h1>

          <p>Review your booking before payment.</p>
        </div>

        <div className="summary">
          <h2>Booking Summary</h2>

          <div className="row">
            <span>Service</span>

            <span>{booking.service}</span>
          </div>

          <div className="row">
            <span>Date</span>

            <span>{booking.bookingDate}</span>
          </div>

          <div className="row">
            <span>Time</span>

            <span>{booking.timeSlot}</span>
          </div>

          <div className="row">
            <span>Customer</span>

            <span>{user.name}</span>
          </div>
        </div>

        <div className="price-card">
          <div className="row">
            <span>Service Charge</span>

            <span>₹{amount}</span>
          </div>

          <div className="row">
            <span>Platform Fee</span>

            <span>₹0</span>
          </div>

          <hr />

          <div className="total">
            <span>Total</span>

            <span>₹{amount}</span>
          </div>
        </div>

        <div className="demo-notice">
          <span>🔵</span>

          <div>
            <strong>Demo Payment</strong>

            <p>No real money will be charged.</p>
          </div>
        </div>

        <button
          className="pay-btn"
          disabled={loading}
          onClick={handleDemoPayment}
        >
          {loading
            ? "Processing..."
            : `Complete Payment — ₹${amount}`}
        </button>

        <div className="features">
          <div>🔒 Secure</div>

          <div>⚡ Instant Confirmation</div>

          <div>📧 Email Receipt</div>

          <div>📱 SMS Alert</div>
        </div>
      </div>
    </div>
  );
}

export default Payment;