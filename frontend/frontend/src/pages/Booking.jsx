import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Booking.css";

function Booking() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentUser =
      localStorage.getItem("currentUser");

    const booking = {
      userEmail: currentUser,
      service: "Web Development",
      bookingDate: date.toDateString(),
      timeSlot: time,
      status: "Pending",
      paymentStatus: "Not Paid",
    };

    const bookings =
      JSON.parse(
        localStorage.getItem("bookings")
      ) || [];

    bookings.push(booking);

    localStorage.setItem(
      "bookings",
      JSON.stringify(bookings)
    );

    navigate("/payment");
  };

  return (
    <>
      <Navbar />

      <div className="booking-page">
        <div className="booking-card">

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h1>📅 Book Your Service</h1>

          <p className="subtitle">
            Choose your preferred date and
            time slot
          </p>

          <form onSubmit={handleSubmit}>

            <label>Select Date</label>

            <DatePicker
              selected={date}
              onChange={(date) =>
                setDate(date)
              }
              minDate={new Date()}
              className="datepicker"
            />

            <label>Select Time Slot</label>

            <select
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
              required
            >
              <option value="">
                Choose Time
              </option>

              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
              <option>02:00 PM</option>
              <option>03:00 PM</option>
              <option>04:00 PM</option>
            </select>

            <button
              type="submit"
              className="confirm-btn"
            >
              Continue To Payment →
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default Booking;