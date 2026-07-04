import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loggedUser =
      JSON.parse(localStorage.getItem("user")) || {};

    setUser(loggedUser);

    const allBookings =
      JSON.parse(localStorage.getItem("bookings")) || [];

    const myBookings = allBookings.filter(
      (booking) =>
        booking.userEmail === loggedUser.email
    );

    setBookings(myBookings);
  }, []);

  const completed = bookings.filter(
    (b) => b.paymentStatus === "Paid"
  ).length;

  const pending = bookings.filter(
    (b) => b.paymentStatus !== "Paid"
  ).length;

  const spent = bookings.reduce(
    (sum, b) => sum + Number(b.amount || 0),
    0
  );

  const initials = (user.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-grid">

          {/* LEFT */}

          <div className="profile-card">

            <div className="avatar">
              {initials}
            </div>

            <h2>{user.name || "Guest User"}</h2>

            <p className="email">
              {user.email}
            </p>

            <span className="premium">
              ⭐ Premium Customer
            </span>

            <div className="profile-stats">

              <div>
                <h3>{bookings.length}</h3>
                <p>Bookings</p>
              </div>

              <div>
                <h3>{completed}</h3>
                <p>Completed</p>
              </div>

              <div>
                <h3>{pending}</h3>
                <p>Pending</p>
              </div>

            </div>

            <div className="wallet">

              <h3>Total Spent</h3>

              <h1>₹{spent}</h1>

            </div>

          </div>

          {/* RIGHT */}

          <div className="history-card">

            <div className="history-header">

              <h2>Booking History</h2>

              <span>
                {bookings.length} Bookings
              </span>

            </div>

            {bookings.length === 0 ? (

              <div className="empty">

                <h3>No Bookings Yet</h3>

                <p>
                  Book your first service to
                  view history here.
                </p>

              </div>

            ) : (

              bookings.map((booking, index) => (

                <div
                  className="booking-card"
                  key={index}
                >

                  <div className="booking-top">

                    <h3>
                      {booking.service}
                    </h3>

                    <span
                      className={
                        booking.paymentStatus ===
                        "Paid"
                          ? "paid"
                          : "pending"
                      }
                    >
                      {booking.paymentStatus ||
                        "Pending"}
                    </span>

                  </div>

                  <div className="booking-details">

                    <p>
                      📅 {booking.bookingDate}
                    </p>

                    <p>
                      ⏰ {booking.timeSlot}
                    </p>

                    <p>
                      💰 ₹{booking.amount}
                    </p>

                    <p>
                      🆔 {booking.bookingId}
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </>
  );
}

export default Profile;