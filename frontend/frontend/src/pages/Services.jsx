import "./Services.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const services = [
  {
    id: 1,
    title: "Web Development",
    category: "Development",
    price: 4999,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
    description:
      "Modern responsive websites, MERN applications and enterprise portals."
  },
  {
    id: 2,
    title: "AI Chatbot",
    category: "AI",
    price: 6999,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900",
    description:
      "AI assistants powered by OpenAI, Gemini and Llama."
  },
  {
    id: 3,
    title: "Cloud Deployment",
    category: "Cloud",
    price: 3999,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900",
    description:
      "AWS EC2, Docker, CI/CD and cloud deployment."
  },
  {
    id: 4,
    title: "UI UX Design",
    category: "Design",
    price: 2999,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900",
    description:
      "Professional UI/UX with Figma and responsive layouts."
  },
  {
    id: 5,
    title: "Digital Marketing",
    category: "Marketing",
    price: 3499,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900",
    description:
      "SEO, Ads, Social Media and Business Branding."
  },
  {
    id: 6,
    title: "Mobile App",
    category: "Development",
    price: 7999,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900",
    description:
      "Android & iOS applications using Flutter and React Native."
  }
];

function Services() {

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const filteredServices = services.filter((service) => {

    const matchSearch =
      service.title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" ||
      service.category === category;

    return matchSearch && matchCategory;

  });

  return (

    <div className="services-page">

      <section className="service-hero">

        <h1>Premium Professional Services</h1>

        <p>
          Find trusted experts for your business and personal needs.
        </p>

      </section>

      <section className="filter-section">

        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        >

          <option>All</option>

          <option>Development</option>

          <option>AI</option>

          <option>Cloud</option>

          <option>Design</option>

          <option>Marketing</option>

        </select>

      </section>

      <section className="service-grid">

        {

          filteredServices.map((service)=>(

            <div
              className="service-card"
              key={service.id}
            >

              <img
                src={service.image}
                alt={service.title}
              />

              <div className="service-content">

                <span className="category">

                  {service.category}

                </span>

                <h2>

                  {service.title}

                </h2>

                <p>

                  {service.description}

                </p>

                <div className="rating">

                  ⭐⭐⭐⭐⭐

                  <span>

                    (4.9)

                  </span>

                </div>

                <div className="bottom">

                  <h3>

                    ₹{service.price}

                  </h3>

                  <Link
                    to="/booking"
                    state={service}
                    className="book-btn"
                  >

                    Book Now →

                  </Link>

                </div>

              </div>

            </div>

          ))

        }

      </section>

    </div>

  );

}

export default Services;