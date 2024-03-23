import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { INavbar, IAuthReduxProps } from '../../types/interfaces';



import Logout from '../auth/Logout';

const Navbar = ({ auth }: INavbar) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  const location = useLocation();

  const activeClass = (route: any) => { return location.pathname === route ? "active" : "" }
  console.log('-___________________-+++++++++', {pathname: window.location.pathname, cla: activeClass(window.location.pathname)});
  const authLinks = (
    <>
      <nav className="navbar" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#main-menu" onClick={() => handleToggle()}>
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
        </div>

        <div className={`collapse navbar-collapse ${isOpen ? 'in' : ''}`} id="main-menu">
          <ul className="nav nav-justified navs">
            <li className={activeClass("/home")}><a href="/home">Home</a></li>

            {/* <NavLink to={'/home'} activeClassName="active">
              Trending
            </NavLink> */}
            {/* <li><a href="#">New JIO</a></li> */}
            <li className={activeClass("/job-orders")}><a href="/job-orders">New JIO</a></li>
            <li className={activeClass("/")}><a href="/">Overall Schedule</a></li>
            {/* <li><a href="#">Hanger &amp; Taper</a></li>
            <li><a href="#">Sprayer &amp; Sander</a></li> */}
            <li className={activeClass("/garage")}><a href="/garage">Garage</a></li>
            <li className={activeClass("/reports")}><a href="/reports">Reports</a></li>
            <Logout />
            {/* <li><a href="#">Logout</a></li> */}
          </ul>
        </div>
      </nav>
    </>
  );

  const guestLinks = (
    <>
    </>
  );

  return (
    <>
      {auth && auth.isAuthenticated ? authLinks : guestLinks}
    </>
  );
};

const mapStateToProps = (state: IAuthReduxProps) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(Navbar);
