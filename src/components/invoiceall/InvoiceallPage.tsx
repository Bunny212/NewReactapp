import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tabs/style/react-tabs.css';
import {
  InvoiceallList,
} from '../../types/interfaces';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '500px',
    overlfow: 'scroll',
    width: '50%',
  }
};

Modal.setAppElement('#root');


const InvoiceallPage = ({ invoiceall, actions }: InvoiceallList, getState: Function) => {
  const { job_id } = useParams();

  useEffect(() => {
    const jid: number = job_id !== undefined ? +job_id : 0;
    console.log(jid);
    const url = configs.url.API_URL + '/jobs';

    axios.get(url, authHeader(getState))
      .then(response => {
        setJobState(JSON.parse(JSON.stringify(response.data)));
        setLoadingState(false);
        console.log(response.data);
      });
    isDatePassed('7/21/2020');
  }, []);

  const [jobsData, setJobState] = useState([]);
  const [loading, setLoadingState] = useState(true);
  const [invoicetxtboxstatus, setInvoiceTextboxStatus] = useState(true);

  const isDatePassed = (date: string) => {

    var dateofvisit = moment(date, 'MM-DD-YYYY');
    var today = moment();
    var dif = dateofvisit.diff(today, 'days');

    return (dif < 0) ? false : true;
  };
  return (
    <>
      <ToastContainer />
      <div className="clear pad-40" />
      <div className="container">
        <div className="row">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    All Invoices
                                    <br />
                    <small>Manage All Invoices & details</small>
                  </h3>
                </div>
                <div className="col-md-9 mt-20 text-right">

                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="clear pad-5" />

              <div className="table-responsive">
                <Tabs onSelect={index => console.log(index)}>
                  <TabList>
                    <Tab>Hanger</Tab>
                    <Tab>Taper</Tab>
                    <Tab>Sprayer</Tab>
                    <Tab>Sander</Tab>
                  </TabList>

                  <TabPanel>
                    <table style={{ border: '1px solid black' }}>
                      <tbody>
                        <tr style={{ backgroundColor: '#FAD163' }}>
                          <td colSpan={2} style={{ textAlign: 'center' }}>
                            <table style={{ width: '100%' }}>
                              <tbody>
                                <tr>
                                  <td style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'black' }}>Schoenberger Drywall, Inc.</td>
                                </tr>
                                <tr>
                                  <td>17180 Adelmann Street SE</td>
                                </tr>
                                <tr>
                                  <td>Prior Lake, MN 55372</td>
                                </tr>
                                <tr>
                                  <td>Phone: 952-447-1078
                                </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style={{ backgroundColor: '#FAD163' }}>
                          <td colSpan={2} style={{ textAlign: 'center' }}>Invoice</td>
                        </tr>
                        <tr style={{ backgroundColor: '#FAD163' }}>
                          <td colSpan={2} style={{ borderBottom: '1px solid black', textAlign: 'right' }}>
                            Invoice Date: 7/17/2020 5:57:47 AM
                                                    </td>
                        </tr>
                        <tr style={{ backgroundColor: '#FFF7D7' }}>
                          <td style={{ borderRight: '1px solid black', textAlign: 'right' }} ><b>Sub Contractor:</b></td>
                          <td>&nbsp;SGA DRYWALL, LLC</td>
                        </tr>
                        <tr style={{ backgroundColor: '#FFF7D7' }}>
                          <td style={{ borderRight: '1px solid black', textAlign: 'right' }}><b>Job Address:</b></td>
                          <td>&nbsp;955 Forest Edge,
                                                        {/* <br> */}
                                                        &nbsp;Jordan</td>
                        </tr>
                        <tr style={{ backgroundColor: '#FFF7D7' }}>
                          <td style={{ borderRight: '1px solid black', textAlign: 'right' }}><b>Builder:</b></td>
                          <td>Key-Land Homes</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: '#FFF7D7', textAlign: 'right' }} colSpan={2}>
                            <table style={{ backgroundColor: '#FFF7D7' }}>
                              <tbody>
                                <tr style={{ height: '20px ' }}>
                                  <th className="inst" style={{ width: '50px ' }}>SlNo</th>
                                  <th className="inst" style={{ width: '130px ' }}>ItemID</th>
                                  <th className="inst" style={{ width: '200px ' }}>Item Description</th>
                                  <th className="inst" style={{ width: '70px ' }}>Quantity</th>
                                  <th className="inst" style={{ width: '70px ' }}>Unit Price</th>
                                  <th className="inst" style={{ width: '70px ' }}>Price</th>
                                </tr>
                                <tr style={{ height: '20px ' }}>
                                  <td className="inst-bd-r">&nbsp;1</td>
                                  <td className="inst-bd-r">&nbsp;750-G</td>
                                  <td className="inst-bd-r">&nbsp;Garage</td>
                                  <td className="inst-bd-r" style={{ textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '98.22'}
                                  </td>
                                  <td className="inst-bd-r" style={{ textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '46.22'}
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '36.22'}
                                  </td>
                                </tr>
                                <tr style={{ height: '20px ' }}>
                                  <td className="inst-bd-r">&nbsp;2</td>
                                  <td className="inst-bd-r">&nbsp;750-GH</td>
                                  <td className="inst-bd-r">&nbsp;High Garage</td>
                                  <td className="inst-bd-r" style={{ textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '46.22'}
                                  </td>
                                  <td className="inst-bd-r" style={{ textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '25.22'}
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '36.22'}
                                  </td>
                                </tr>
                                <tr style={{ height: '20px' }}>
                                  <td className="inst-bd-r">&nbsp;6</td>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td style={{ textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '0.00'}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td className="inst-bd-r">&nbsp;</td>
                                  <td>&nbsp;</td>
                                </tr>
                                <tr style={{ height: '20px' }}>
                                  <td colSpan={4} style={{ borderTop: '1px solid black', textAlign: 'right' }}>
                                    <b>Discount:</b>&nbsp;&nbsp;&nbsp;
                                                                         </td>
                                  <td style={{ borderTop: '1px solid black', textAlign: 'right' }}>

                                    {invoicetxtboxstatus ?
                                      <div className="input-group"><input
                                        type="text"
                                        name="line1"
                                        value={0}
                                        onChange={(e) => console.log(e)}
                                        className="form-control"
                                      /><div className="input-group-append">
                                          <span className="input-group-text">%</span>
                                        </div>
                                      </div> : '0'}
                                  </td>
                                  <td style={{ borderTop: '1px solid black', textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '0.00'}
                                  </td>
                                </tr>
                                <tr style={{ height: '20px ' }}>
                                  <td colSpan={5} style={{ borderTop: '1px solid black', textAlign: 'right' }}> <b>Grand Total:</b>&nbsp;&nbsp;&nbsp;</td>
                                  <td style={{ borderTop: '1px solid black', textAlign: 'right' }}>
                                    {invoicetxtboxstatus ? <input
                                      type="text"
                                      name="line1"
                                      value={0}
                                      onChange={(e) => console.log(e)}
                                      className="form-control"
                                    /> : '0.00'}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                        </tr>
                      </tbody>
                    </table>
                  </TabPanel>
                  <TabPanel>
                    <h2>Any content 2</h2>
                  </TabPanel>
                  <TabPanel>
                    <h2>Any content 3</h2>
                  </TabPanel>
                  <TabPanel>
                    <h2>Any content 4</h2>
                  </TabPanel>
                </Tabs>
              </div>
            </div >
          </div >
        </div >
      </div >
    </>
  );
};

InvoiceallPage.propTypes = {

};

export default connect(

)(InvoiceallPage);
