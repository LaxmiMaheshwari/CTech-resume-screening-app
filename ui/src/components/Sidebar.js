// import { FaHome, FaInfoCircle, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      {/* <h2 className="logo">MyApp</h2> */}
      <nav>
        <Link to="/" className="sidebar-link">
          <span>Home</span>
        </Link>
        <Link to="/about" className="sidebar-link">
          {/* <FaInfoCircle className="icon" /> */}
          <span>About</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
