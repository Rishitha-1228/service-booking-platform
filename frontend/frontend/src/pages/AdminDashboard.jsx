import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, usersRes, paymentsRes] = await Promise.all([
        axios.get(`${API}/admin/dashboard`),
        axios.get(`${API}/admin/bookings`),
        axios.get(`${API}/admin/users`),
        axios.get(`${API}/admin/payments`),
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error("Admin load error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    setStatusUpdating(bookingId);
    try {
      await axios.put(`${API}/admin/bookings/${bookingId}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setStatusUpdating(null);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const statusBadge = (status) => {
    const map = {
      Pending: "badge-pending",
      Paid: "badge-paid",
      Confirmed: "badge-confirmed",
      Completed: "badge-completed",
      Cancelled: "badge-cancelled",
    };
    return <span className={`badge ${map[status] || "badge-pending"}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <h2>⚡ SkillConnect</h2>
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: "overview", icon: "📊", label: "Overview" },
            { id: "bookings", icon: "📅", label: "Bookings" },
            { id: "users", icon: "👥", label: "Users" },
            { id: "payments", icon: "💳", label: "Payments" },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="sidebar-back-btn" onClick={() => navigate("/")}>
          ← Back to Site
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-page-title">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "bookings" && "All Bookings"}
              {activeTab === "users" && "All Users"}
              {activeTab === "payments" && "Payment Records"}
            </h1>
            <p className="admin-page-sub">SkillConnect Pro — Admin Panel</p>
          </div>
          <button className="refresh-btn" onClick={loadData}>🔄 Refresh</button>
        </div>

        {/* ════ OVERVIEW ════ */}
        {activeTab === "overview" && stats && (
          <div>
            {/* Stat Cards */}
            <div className="stat-grid">
              <div className="stat-card purple">
                <div className="stat-icon">👥</div>
                <div>
                  <p className="stat-label">Total Users</p>
                  <h2 className="stat-value">{stats.totalUsers}</h2>
                </div>
              </div>
              <div className="stat-card blue">
                <div className="stat-icon">📅</div>
                <div>
                  <p className="stat-label">Total Bookings</p>
                  <h2 className="stat-value">{stats.totalBookings}</h2>
                </div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">💰</div>
                <div>
                  <p className="stat-label">Total Revenue</p>
                  <h2 className="stat-value">₹{stats.totalRevenue?.toLocaleString()}</h2>
                </div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon">🛠️</div>
                <div>
                  <p className="stat-label">Total Services</p>
                  <h2 className="stat-value">{stats.totalServices}</h2>
                </div>
              </div>
            </div>

            {/* Booking Status Summary */}
            {stats.bookingStats && (
              <div className="section-card">
                <h3 className="section-title">📊 Booking Status Breakdown</h3>
                <div className="status-summary">
                  {Object.entries(stats.bookingStats).map(([key, val]) => (
                    <div key={key} className="status-item">
                      <span className={`badge badge-${key}`}>{key}</span>
                      <span className="status-count">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Bookings */}
            <div className="section-card">
              <h3 className="section-title">🕒 Recent Bookings</h3>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings?.map((b) => (
                      <tr key={b._id}>
                        <td>{b.userId?.name || "—"}</td>
                        <td>{b.serviceId?.title || "—"}</td>
                        <td>{b.bookingDate}</td>
                        <td>{b.bookingTime}</td>
                        <td>{statusBadge(b.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════ BOOKINGS ════ */}
        {activeTab === "bookings" && (
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">📅 All Bookings ({bookings.length})</h3>
            </div>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b._id}>
                      <td className="row-num">{i + 1}</td>
                      <td><strong>{b.userId?.name || "—"}</strong></td>
                      <td className="email-cell">{b.userId?.email || "—"}</td>
                      <td>{b.serviceId?.title || "—"}</td>
                      <td>{b.bookingDate}</td>
                      <td>{b.bookingTime}</td>
                      <td>{statusBadge(b.status)}</td>
                      <td>
                        <select
                          className="status-select"
                          value={b.status}
                          disabled={statusUpdating === b._id}
                          onChange={(e) => updateStatus(b._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Paid">Paid</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={8} className="empty-row">No bookings found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ USERS ════ */}
        {activeTab === "users" && (
          <div className="section-card">
            <h3 className="section-title">👥 All Users ({users.length})</h3>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td className="row-num">{i + 1}</td>
                      <td><strong>{u.name}</strong></td>
                      <td className="email-cell">{u.email}</td>
                      <td>{u.phone || "—"}</td>
                      <td>
                        <span className={`badge ${u.role === "admin" ? "badge-confirmed" : "badge-pending"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteUser(u._id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={7} className="empty-row">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ PAYMENTS ════ */}
        {activeTab === "payments" && (
          <div className="section-card">
            <h3 className="section-title">💳 Payment Records ({payments.length})</h3>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={p._id}>
                      <td className="row-num">{i + 1}</td>
                      <td><code className="txn-code">{p.transactionId}</code></td>
                      <td>{p.bookingId?.userId?.name || "—"}</td>
                      <td>{p.bookingId?.serviceId?.title || "—"}</td>
                      <td className="amount-cell">₹{p.amount?.toLocaleString()}</td>
                      <td>{p.paymentMethod}</td>
                      <td>{statusBadge(p.status)}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan={8} className="empty-row">No payments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;