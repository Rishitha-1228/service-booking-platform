import { Link } from "react-router-dom";

function ServiceCard({service}) {

  return (

    <div className="service-card">

      <h2>
        {service.title}
      </h2>

      <h3>
        {service.price}
      </h3>

      <Link
        to="/booking"
        className="book-btn"
      >
        Book Now
      </Link>

    </div>

  );
}

export default ServiceCard;