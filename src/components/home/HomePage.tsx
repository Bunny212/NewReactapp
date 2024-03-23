import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  useEffect(() => {
    // Check for register error
    const classList = document.body.classList;
    if (!classList.length && !localStorage.getItem("token")) {
      classList.add('login_bg');
    } else {
      classList.remove('login_bg');
    }

  }, []);
  return (
    <>
      <div className="clear pad-40" />

      <section className="container-fluid">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <ul className="menu">
              {/* <li>
                <a href="#">
                  <img src="./images/menu_print.png" alt="" />
                  <span>Print</span>
                </a>
              </li> */}
              <li>
                <a href="/builders">
                  <img src="./images/menu_builder.png" alt="" />
                  <span>Builder</span>
                </a>
              </li>
              <li>
                <a href="/ceiling-finishes">
                  <img src="./images/menu_ceiling.png" alt="" />
                  <span>Ceiling Finish</span>
                </a>
              </li>
              <li>
                <a href="/cities">
                  <img src="./images/menu_city.png" alt="" />
                  <span>City</span>
                </a>
              </li>
              <li>
                <a href="/delivered-by">
                  <img src="./images/menu_delivered.png" alt="" />
                  <span>Delivered By</span>
                </a>
              </li>
              <li>
                <a href="/garage-finishes">
                  <img src="./images/menu_garage.png" alt="" />
                  <span>Garage Finish</span>
                </a>
              </li>
              <li>
                <a href="/garage-stalls">
                  <img src="./images/menu_garagestalls.png" alt="" />
                  <span>Garage Stalls</span>
                </a>
              </li>
              {/* <li>
                <a href="#">
                  <img src="./images/menu_bills.png" alt="" />
                  <span>Gen Bills</span>
                </a>
              </li> */}
              <li>
                <a href="/house-types">
                  <img src="./images/menu_house.png" alt="" />
                  <span>House Type</span>
                </a>
              </li>
              <li>
                <a href="/invoices">
                  <img src="./images/menu_invoice.png" alt="" />
                  <span>Invoices</span>
                </a>
              </li>
              <li>
                <a href="/users">
                  <img src="./images/menu_users.png" alt="" />
                  <span>Users</span>
                </a>
              </li>
              <li>
                <a href="/options">
                  <img src="./images/menu_option.png" alt="" />
                  <span>Options</span>
                </a>
              </li>
              <li>
                <a href="/rate-plans">
                  <img src="./images/menu_rate.png" alt="" />
                  <span>Rate Plans</span>
                </a>
              </li>
              {/* <li>
                <a href="#">
                  <img src="./images/menu_services.png" alt="" />
                  <span>Service Tech</span>
                </a>
              </li> */}
              <li>
                <a href="/vaults">
                  <img src="./images/menu_vaults.png" alt="" />
                  <span>Vaults</span>
                </a>
              </li>
              <li>
                <a href="/billing-items">
                  <img src="./images/menu_config.png" alt="" />
                  <span>Inventory Items</span>
                </a>
              </li>
              <li>
                <a href="/house-level-types">
                  <img src="./images/menu_option.png" alt="" />
                  <span>House Level Types</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <footer>Copyright &copy; Schoenberger Drywall, Inc. 2020</footer>
    </>
  );
}

export default HomePage;
