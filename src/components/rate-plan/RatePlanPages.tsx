import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import * as ratePlanActions from '../../redux/actions/ratePlanActions';
import axios from 'axios';
import PropTypes from 'prop-types';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RatePlanReduxPropss,
  RatePlanLists,
  RatePlans,
  Target,
} from '../../types/interfaces';
import { TableHeader, Pagination, Search } from "../DataTable";
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


const RatePlanPages = ({ rateplan, actions }: RatePlanLists, getState: Function) => {
  useEffect(() => {
    actions.getAllRatePlan();

    const url = configs.url.API_URL + '/jobs';

    axios.get(url, authHeader(getState))
      .then(response => {
        setJobState(JSON.parse(JSON.stringify(response.data)));
        setLoadingState(false);
        console.log(response.data);
      });

  }, [actions.getAllRatePlan]);

  const defaultState = {
    id: 0, rate_plan_name: '', job_id: 0, job: '',
  };



  const defaultTableData = {
    rpItems: [
      { id: 1, billitem: 'Wasif', rate: 21 },
      { id: 2, billitem: 'Ali', rate: 19 },
      { id: 3, billitem: 'Saad', rate: 16 },
      { id: 4, billitem: 'Asad', rate: 25 },
    ],
  };

  const defaultModalState: any = {
    id: 0, job_id: 0, m_rateplan_name: '', rpItems: [],
  };

  // const subtitle;
  const [formData, setFormData] = useState(defaultState);
  const [modalFormData, setModalFormData] = useState(defaultModalState);
  const [rpname, setRatePlanForPopup] = useState('');
  const [jobid, setJobId] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [rpTableData, setRatePlanDetails] = useState(defaultTableData);
  const [tblrowcount, setTblRowCount] = useState(defaultModalState.rpItems.length);
  const [tblinitrowcount, setInitTblRowCount] = useState(0);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [jobsData, setJobState] = useState([]);
  const [billsData, setBillItems] = useState([]);
  const [loading, setLoadingState] = useState(true);
  const [mloading, setMLoadingState] = useState(true);
  const [activetxt, setTextActive] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const clearData = () => {
    setSubmitted(false);
    setFormData({ ...defaultState });
  };

  const { rateplan: ratePlanData } = rateplan;
  const handleDelete = (e: any, id: number) => {
    e.preventDefault();
    if (window.confirm('Do you really want to delete this!')) {
      actions.deleteRatePlan(id);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const afterOpenModal = () => {
    setRatePlanDetails(rpTableData);
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  };
  const showRowOnload = () => {

  };
  const handleModify = async (e: any, rplanname: any, rplanid: any, jobid: any) => {
    console.log('rplanname', rplanname);
    console.log('rplanid', rplanid);
    console.log('jobid', jobid);
    e.preventDefault();
    setIsOpen(true);
    setModalFormData({ ...defaultModalState });
    await axios.post(configs.url.API_URL + '/rateplan_items', { rpid: rplanid }, authHeader(getState))
      .then((res) => {
        const serverResponse = JSON.parse(JSON.stringify(res.data));
        setTblRowCount(serverResponse.rpItems.length);
        setInitTblRowCount(serverResponse.rpItems.length);
        setBillItems(serverResponse.rpItems[0].jbi_items);
        setMLoadingState(false);
        setModalFormData({
          ...modalFormData,
          id: (rplanid as any),
          job_id: (jobid as any),
          m_rateplan_name: (rplanname as any),
          rpItems: [...serverResponse.rpItems]
        });
      }).catch((err) => {
        console.log(err);
      });

    // console.log(JSON.parse(JSON.stringify(rplanid)));
    // setModalFormData({ ...modalFormData, rpItems: [...serverResponse] });
    // setModalFormData({ ...modalFormData, id: (rplanid as any), m_rateplan_name: (rplanname as any), rpItems: [...serverResponse] });
    setRatePlanForPopup(rplanname);
    setJobId(jobid);
  };

  const handleEdit = (e: any, rateplan: RatePlans) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...rateplan });
  };

  const onFormChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onModalFormChange = (e: Target, index: any) => {
    const { name, value } = e.target;
    // const bilitemData = [...modalFormData.bilitem];
    // const rateData = [...modalFormData.rate];
    // const m_rateplan_name = [...modalFormData.m_rateplan_name];
    // bilitemData[index] = { ...bilitemData[index], [name]: value };
    // rateData[index] = { ...rateData[index], [name]: value };
    // m_rateplan_name = value;

    setModalFormData({ ...modalFormData });
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    console.log(formData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (formData.rate_plan_name) {
      if (!formData.id) {
        actions.addRatePlan(formData);
        setFormData({ ...formData });
        toast.success('Rate plan saved successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.log(formData);
        actions.updateRatePlan(formData);
        setFormData({ ...formData });
        toast.success('Update rate plan saved successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData({ ...defaultState });
      }
    }
  };
  const handleEditForm = (e: any, id: any) => {
    e.preventDefault();

  };

  const saveModalData = (e: any) => {
    e.preventDefault();
    setModalSubmitted(true);
    console.log(modalFormData);
    // const formData = JSON.parse(JSON.stringify(modalFormData));
    axios.post(configs.url.API_URL + '/update_rateplan_items', modalFormData, authHeader(getState))
      .then((res) => {
        const serverResponse = JSON.parse(JSON.stringify(res.data));
        console.log(serverResponse);
        if (serverResponse.status) {
          toast.success(serverResponse.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsOpen(false);
        }
      }).catch((err) => {
        console.log(err);
      });
  };
  const addNewRow = (e: any) => {
    e.preventDefault();

    let cnt = tblrowcount + 1;
    let obj = { id: cnt, bill_id: 0, jbi_items: billsData, billitem: '', rate: 0 };
    // defaultTableData.rpItems.push(obj);
    // setRatePlanDetails(defaultTableData)
    // let newData = JSON.parse(JSON.stringify([...defaultTableData.rpItems]));
    // newData.push(obj);
    // console.log(newData);
    console.log(modalFormData.rpItems);
    setModalFormData({ ...modalFormData, rpItems: [...modalFormData.rpItems, obj] });
    setTblRowCount(cnt);
  };

  const deleteRow = (e: any) => {
    e.preventDefault();
    console.log(tblinitrowcount, '===', tblrowcount);
    if (tblrowcount !== tblinitrowcount) {
      modalFormData.rpItems.splice(-1, 1);
      setTblRowCount(tblrowcount - 1);
      setModalFormData({ ...modalFormData });
    }

    // let filterData = data.filter(item => item.name.includes(search));
    // console.log(filterData);
  };

  const updateModalFormData = (dt: any, key: any, val: any) => {

    // const targetDt = modalFormData.rpItems.filter((_dt:any) => (_dt.id === dt.id))[0];
    const deepCopied = JSON.parse(JSON.stringify(modalFormData.rpItems)).map((_dt: any) => {
      if (_dt.id === dt.id) {
        return { ..._dt, [key]: val };
      } else {
        return _dt;
      }
    });

    let currentValue: any = deepCopied;
    if (key == "billitem") {
      for (let i = 0; i < currentValue.length; i++) {
        if (currentValue[i].id === dt.id) {
          currentValue[i].bill_id = val;
          if (key == "billitem" && val == "new" && currentValue[i].id === dt.id) {
            setTextActive(true);
          }
        }
      }
    }
    // deepCopied
    setModalFormData({ ...modalFormData, rpItems: currentValue });
  };
  //Pagination Start
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });


  const initialratePlanData: any = [];
  const [newRatePlanData, setNewRatePlanData] = useState(initialratePlanData);

  useEffect(() => {
    // console.log("Total Data Length =>", jobOrdersData.length);
    setTotalItems(ratePlanData.length);

    //Current Page slice
    let newSliceData = JSON.parse(JSON.stringify(ratePlanData)).slice(
        (currentPage - 1) * itemPerPage,
        (currentPage - 1) * itemPerPage + itemPerPage
    );
    setNewRatePlanData(newSliceData);
    console.log(newSliceData);

  }, [
    ratePlanData, currentPage, search, sorting
  ]);

  const changePerPage = (e: any) => {
    console.log(e.target.value);
    setItemPerPage(e.target.value);

    //Current Page slice
    let newSliceData = JSON.parse(JSON.stringify(ratePlanData)).slice(
        (currentPage - 1) * e.target.value,
        (currentPage - 1) * e.target.value + e.target.value
    );

    setNewRatePlanData(newSliceData);
  }

  //Pagination End
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
                    Rate Plan
                    <br />
                    <small>Manage Rate Plan & details</small>
                  </h3>
                </div>
                <div className="col-md-9 mt-20 text-right">
                  {/* <button type="button" className="btn btn-info mr-5">
                    <i className="fas fa-arrow-circle-left mr-5" />
                    Return to Dashboard
                  </button> */}
                  {/* <button type="button" className="btn btn-primary">
                    <i className="fas fa-save mr-5" />
                    Save
                  </button> */}
                </div>
              </div>
            </div>

            <div className="card-body">
              <form className="form-horizontal" onSubmit={(e) => handleSubmit(e)}>
                <h4 className="text_blue">
                  Rate Plan Details
                </h4>
                <div className="clear pad-5" />
                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Name :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="rate_plan_name"
                        value={formData.rate_plan_name || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.rate_plan_name ? 'ap-required' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Job Type :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className="form-control"
                        name="job_id"
                        value={formData.job_id.toString() || '1'}
                        onChange={(e) => onStatusChange(e)}
                      >
                        <option value={0}>select...</option>
                        {!loading ? jobsData.map((jd: any, i: any) => (
                          <option key={i} value={jd?.id}>{jd?.job}</option>
                        )) : (
                            <option value={0}>select...</option>
                          )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mt-20 text-right">
                    <button type="button" className="btn btn-info mr-5" onClick={() => clearData()}>
                      {/* <i className="fas fa-arrow-circle-left mr-5" /> */}
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save mr-5" />
                      Save
                    </button>
                  </div>
                </div>

                <hr />
                {/* <div className="clear pad-15" /> */}

                {/* <div className="row">
                  <div className="col-md-6 col-md-offset-3">
                    <div className="row">
                      <div className="col-sm-6 mb-5">
                        <button type="button" className="btn btn-info btn-block btn-lg">
                          <i className="fas fa-arrow-circle-left mr-5" />
                          Return to Schedule
                        </button>
                      </div>
                      <div className="col-sm-6">
                        <button type="submit" className="btn btn-primary btn-block btn-lg">
                          <i className="fas fa-save mr-5" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
              </form>

              <h4 className="text_blue">
                Rate Plan
              </h4>
              <div className="clear pad-5" />

              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>
                        Sr.#
                      </th>
                      <th>
                        RP Name
                      </th>
                      <th>
                        RP Job
                      </th>
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {newRatePlanData.length > 0 ? newRatePlanData.map((rateplan: any, i:any) => (
                      <tr key={rateplan.id}>
                        <td>
                        {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                        </td>
                        <td>
                          <strong>{rateplan.rate_plan_name}</strong>
                        </td>
                        <td>
                          {rateplan.job}
                        </td>
                        <td>
                          <a
                            href="#"
                            title="Edit"
                            className="text_grey_d"
                            onClick={(e) => handleEdit(e, rateplan)}
                          >
                            <i className="fa fa-edit fa-lg" />
                          </a>&nbsp;
                          <a
                            href="#"
                            title="Edit"
                            className="text_red"
                            onClick={(e) => handleDelete(e, rateplan.id)}
                          >
                            <i className="fa fa-times-circle fa-lg" />
                          </a>&nbsp;
                          <a
                            href="#"
                            title="Edit"
                            className="modify_data"
                            onClick={(e) => handleModify(e, rateplan.rate_plan_name, rateplan.id, rateplan.job_id)}
                          >
                            Modify
                          </a>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No record found.
                        </td>
                        </tr>
                      )}
                  </tbody>
                </table>
                {ratePlanData.length < 1}
                {/* <ul className="pagination center-block">
                  <li><a href="#">«</a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#">»</a></li>
                </ul> */}

                  <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                    <div className="col-md-6">
                        <Pagination
                            total={totalItems}
                            itemsPerPage={itemPerPage}
                            currentPage={currentPage}
                            onPageChange={(page:any) => setCurrentPage(page)}
                        />
                    </div>
                    <div className="col-md-6">
                      <select name="itemPerPage" className="form-control input-sm" style={{ width: '80px', float: 'right' }} onChange={(e) => changePerPage(e)}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="80">80</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="RatePlan"
      >
        <button onClick={closeModal}>close</button>
        <br /><br /><div>Rate Plan</div>
        <form>
          <input
            type="text"
            name="m_rateplan_name"
            value={(modalFormData.m_rateplan_name != '') ? modalFormData.m_rateplan_name : rpname}
            onChange={(e) => setModalFormData({ ...modalFormData, m_rateplan_name: e.target.value })}
            className={`form-control ${modalSubmitted && !modalFormData.m_rateplan_name ? 'ap-required' : ''}`}
          />
          <input
            type="hidden"
            name="job_id"
            value={(modalFormData.job_id != '') ? modalFormData.job_id : jobid}
            onChange={(e) => setModalFormData({ ...modalFormData, job_id: e.target.value })}
          />
          <br /><br />
          <table className="modaltbl">
            <thead>
              <tr>
                <th>SI.No.</th>
                <th>Billing Item</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {modalFormData.rpItems.length > 0 ? modalFormData.rpItems.map((dt: any, i: any) => (
                <tr key={i}>
                  <td>{dt.id}</td>
                  <td>
                    <input
                      className="form-control"
                      type="text"
                      value={dt.billitem}
                      name="billitem"
                      style={{ display: activetxt ? 'block' : 'none' }}
                      onChange={(e) => { updateModalFormData(dt, 'billitem', e.target.value) }}
                    />
                    <select
                      className="form-control"
                      name="billitem"
                      value={dt.bill_id}
                      style={{ display: !activetxt ? 'block' : 'none' }}
                      onChange={(e) => updateModalFormData(dt, 'billitem', e.target.value)}
                    >
                      <option value={0}>select...</option>
                      <option value={'new'}>New</option>
                      {dt.jbi_items.length > 0 ? dt.jbi_items.map((jd: any, i: any) => (
                        <option key={i} value={jd?.id}>{jd?.billitem_id}</option>
                      )) : (
                          <option value={0}>select...</option>
                        )}
                    </select>
                  </td>
                  <td><input className="form-control" type="text" value={dt.rate} name="rate" onChange={(e) => { updateModalFormData(dt, 'rate', e.target.value) }} /></td>
                </tr>
              )) : (
                  <tr>
                    <td colSpan={4}>Sorry! no data available...</td>
                  </tr>
                )}
            </tbody>
          </table>
          <div className="pull-right top10">
            <button type="button" className="btn btn-danger right-10" onClick={(e) => deleteRow(e)}>
              Delete Last Row
                    </button>
            <button type="button" className="btn btn-info mr-5" onClick={(e) => addNewRow(e)}>
              Add New Row
          </button>
          </div>
          <div className="pull-left top10">
            <button type="submit" className="btn btn-primary" onClick={(e) => saveModalData(e)}>
              <i className="fas fa-save mr-5" />
              Save
          </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

RatePlanPages.propTypes = {
  // cities: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: RatePlanReduxPropss) => ({
  rateplan: state.rateplan,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getAllRatePlan: bindActionCreators(ratePlanActions.getAllRatePlan, dispatch),
    getRatePlan: bindActionCreators(ratePlanActions.getRatePlan, dispatch),
    addRatePlan: bindActionCreators(ratePlanActions.addRatePlan, dispatch),
    updateRatePlan: bindActionCreators(ratePlanActions.updateRatePlan, dispatch),
    deleteRatePlan: bindActionCreators(ratePlanActions.deleteRatePlan, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatePlanPages);
