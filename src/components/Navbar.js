import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">Task Manager</h1>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/assigners" className={isActive('/assigners')}>
              Assigners
            </Link>
          </li>
          <li>
            <Link to="/tasks" className={isActive('/tasks')}>
              Tasks
            </Link>
          </li>
          <li>
            <Link to="/stats" className={isActive('/stats')}>
              Statistics
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar; 