import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useAuth } from '../context/auth-context';
import { useHistory } from 'react-router';


const Navbar = () =>{

  function toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  function toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }

  const { setUser } = useAuth();

  const {user} = useAuth()

  const history = useHistory();

  // signout function
  const signOut = () =>{
    // remove token from localstorage
    localStorage.removeItem('user');

    // clear current user profile
    setUser(null)

    // Redirect the user to the login page
    history.push('/auth/login');

  }

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to="/">
          Rep Connect 
          {/* <img src={require('../assets/images/logo.svg')} alt="logo" /> */}
          </Link>
        <Link className="navbar-brand brand-logo-mini" to="/">
          R. C
          {/* <img src={require('../assets/images/logo-mini.svg')} alt="logo" /> */}
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
          <span className="mdi mdi-menu"></span>
        </button>
        {/* <div className="search-field d-none d-md-block">
          <form className="d-flex align-items-center h-100" action="#">
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text border-0 mdi mdi-magnify"></i>
              </div>
              <input type="text" className="form-control bg-transparent border-0" placeholder="Search projects"/>
            </div>
          </form>
        </div> */}
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile">
            <Dropdown alignRight>
              <Dropdown.Toggle className="nav-link">
                <div className="nav-profile-img">
                  <img src={require("../assets/images/faces/face1.jpg")} alt="user"/>
                  <span className="availability-status online"></span>
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black"><Trans>Dr. {user?.names}</Trans></p>
                  
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="navbar-dropdown">
                <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()}>
                  <i className="mdi mdi-user-profile mr-2 text-success"></i>
                  <Trans>Profile</Trans>
                </Dropdown.Item>
                <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()}>
                  <i className="mdi mdi-setting mr-2 text-success"></i>
                  <Trans>Settings</Trans>
                </Dropdown.Item>
                <hr />
                <Dropdown.Item onClick={() => signOut()}>
                  <i className="mdi mdi-logout mr-2 text-primary"></i>
                  <Trans>Signout</Trans>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          
          {/* <li className="nav-item nav-settings d-none d-lg-block">
            <button type="button" className="nav-link border-0" onClick={() => toggleRightSidebar()} >
              <i className="mdi mdi-format-line-spacing"></i>
            </button>
          </li> */}
        </ul>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={() => toggleOffcanvas()}>
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
