import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const categories = [
    {
      icon: "💻",
      title: "Web Development",
      desc: "Modern websites, MERN applications and business portals.",
    },
    {
      icon: "🤖",
      title: "AI Solutions",
      desc: "Chatbots, AI automation and intelligent assistants.",
    },
    {
      icon: "☁️",
      title: "Cloud Services",
      desc: "AWS deployment, DevOps and cloud infrastructure.",
    },
    {
      icon: "🎨",
      title: "UI / UX Design",
      desc: "Beautiful user experiences and mobile interfaces.",
    },
    {
      icon: "📈",
      title: "Digital Marketing",
      desc: "SEO, Social Media and Brand Growth.",
    },
  ];

  const services = [
    {
      title: "Business Website",
      price: "₹4,999",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
    },
    {
      title: "AI Chatbot",
      price: "₹6,999",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    },
    {
      title: "Cloud Deployment",
      price: "₹3,999",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
    },
  ];

  const testimonials = [
    {
      name: "Rahul",
      text: "Excellent service and amazing support throughout the project.",
    },
    {
      name: "Priya",
      text: "Very professional team. Delivery was on time.",
    },
    {
      name: "Naveen",
      text: "Highly recommended for startups and businesses.",
    },
  ];

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay">
          <h4>TRUSTED PROFESSIONAL SERVICES</h4>

          <h1>
            Book Professional
            <br />
            Services With Confidence
          </h1>

          <p>
            AI • Cloud • Web Development • UI/UX • Digital Marketing
          </p>

          <div className="hero-buttons">
            <Link to="/services" className="primary-btn">
              Explore Services
            </Link>

            <Link to="/register" className="secondary-btn">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="search-section">
        <h2>Find Your Perfect Service</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search services..."
          />

          <button>Search</button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Categories</h2>

        <div className="category-grid">
          {categories.map((item, index) => (
            <div className="category-card" key={index}>
              <h1>{item.icon}</h1>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <h2>Popular Services</h2>

        <div className="service-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
              />

              <div className="service-content">
                <h3>{service.title}</h3>

                <h2>{service.price}</h2>

                <Link
                  to="/services"
                  className="book-btn"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div>
          <h1>500+</h1>
          <p>Clients Served</p>
        </div>

        <div>
          <h1>1,200+</h1>
          <p>Bookings</p>
        </div>

        <div>
          <h1>98%</h1>
          <p>Client Satisfaction</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What Our Clients Say</h2>

        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <p>"{item.text}"</p>

              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <h2>SkillConnect Pro</h2>

        <p>
          Connecting customers with trusted professionals.
        </p>

        <div className="footer-links">
          <Link to="/">Home</Link>

          <Link to="/services">Services</Link>

          <Link to="/dashboard">Dashboard</Link>

          <Link to="/profile">Profile</Link>
        </div>

        <p>© 2026 SkillConnect Pro. All Rights Reserved.</p>
      </footer>
    </div>
  );
}