import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import './Sidebar.scss';

const Sidebar = () =>{
  const [menuState, setMenuState] = useState({});

  const { user } = useAuth();

  // get current route
  const location = useLocation();

  function toggleMenuState(newState) {
    if (menuState[newState]) {
      setMenuState(prevState => ({ ...prevState, [newState]: false }));
    } else if (Object.keys(menuState).length === 0) {
      setMenuState({ [newState]: true });
    } else {
      Object.keys(menuState).forEach(i => {
        setMenuState(prevState => ({ ...prevState, [i]: false }));
      });
      setMenuState(prevState => ({ ...prevState, [newState]: true }));
    }
  }

  function onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(menuState).forEach(i => {
      setMenuState(prevState => ({ ...prevState, [i]: false }));
    });
  }

  useEffect(() => {

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      el.addEventListener('mouseover', function() {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });

    onRouteChanged();

   
  }, []);


return (
  <nav className="sidebar sidebar-offcanvas" id="sidebar">
    <ul className="nav">
      <li className="nav-item nav-profile">
        <a href="!#" className="nav-link" onClick={evt =>evt.preventDefault()}>
          <div className="nav-profile-image">
            <i className="fa fa-solid fa-user-circle fa-4x" />
            {/* <img src={ require("../assets/images/faces/face1.jpg") } alt="profile" /> */}
            <span className="login-status online ms-2 text-success"></span> {/* change to offline or busy as needed */}
          </div>
          <div className="nav-profile-text">
            <h6 className="font-weight-bold mt-2 ms-1 mb-2">{user?.names}</h6>
          </div>
          {/* <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i> */}
        </a>
      </li>
      <li className={location.pathname === '/dashboard' ? 'nav-item active' : 'nav-item'}>
        <Link 
        // className="nav-link" 
        to="/dashboard"
        className= "nav-link"
        >
          <span className="menu-title">Dashboard</span>
          <i className="mdi mdi-home menu-icon"></i>
        </Link>
      </li>

      <li className={location.pathname === '/expenses' ? 'nav-item active' : 'nav-item'}>
        <Link className="nav-link" to="/expenses">
          <span className="menu-title">Expenses</span>
          <i className="mdi mdi-cash menu-icon"></i>
        </Link>
      </li>

      <li className={location.pathname === '/task-manager' ? 'nav-item active' : 'nav-item'}>
        <Link className="nav-link" to="/task-manager">
          <span className="menu-title">Task Manager</span>
          <i className="fa fa-tasks menu-icon"></i>
        </Link>
      </li>

      <li className={location.pathname === '/lead-generation' ? 'nav-item active d-none' : 'nav-item d-none'}>
        <Link className="nav-link" to="/lead-generation">
          <span className="menu-title">Lead Generation</span>
          <i className="fa fa-user-plus menu-icon"></i>
        </Link>
      </li>

      <li className={location.pathname === '/reference' ? 'nav-item active d-none' : 'nav-item d-none'}>
        <Link className="nav-link" to="/reference">
          <span className="menu-title">Reference</span>
          <i className="mdi mdi-link menu-icon"></i>
        </Link>
      </li>

      <li className={location.pathname === '/calendar' ? 'nav-item active d-none' : 'nav-item d-none'}>
        <Link className="nav-link" to="/calendar">
          <span className="menu-title">Calendar</span>
          <i className="mdi mdi-calendar menu-icon"></i>
        </Link>
      </li>
    </ul>
  </nav>
);

}

export default Sidebar;