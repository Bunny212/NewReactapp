import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import _ from 'lodash';
import axios from 'axios';
import PropTypes from 'prop-types';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { ToastContainer, toast } from 'react-toastify';
import * as ratePlanActions from '../../redux/actions/ratePlanAction';
import * as ratePlanJobActions from '../../redux/actions/ratePlanJobActions';
import * as UserActions from '../../redux/actions/userActions';
import * as userTypeActions from '../../redux/actions/userTypeActions';
import 'react-toastify/dist/ReactToastify.css';
import {
  InvoicesList,
  InvoicesReduxProps,
} from '../../types/interfaces';

//Yellow code highliter 
const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('minvoicesListTableBody');
  schTblBody!.querySelectorAll('tr').forEach(function (elem) {
    elem.classList.remove('slctdRow');
  });
  const slctdRowID = 'tblRow'+row!.id;
  const slctdRow = document.getElementById(slctdRowID);
  slctdRow!.classList.add('slctdRow');
};
const handleSelectedRow2 = (row: any) => {
  const schTblBody = document.getElementById('jobtypemodelListTbody');
  schTblBody!.querySelectorAll('tr').forEach(function (elem) {
    elem.classList.remove('slctdRow');
  });
  const slctdRowID = 'tblRow'+row!.id;
  const slctdRow = document.getElementById(slctdRowID);
  slctdRow!.classList.add('slctdRow');
};

const modalCustomStyles = {
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


const InvoicesPage = ({
  invoices,
  users,
  userTypes,
  ratePlans,
  ratePlanJobs,
  actions
}: InvoicesList, getState: Function) => {

  useEffect(() => {
    actions.getUsers();
    actions.getAllUserTypes();
    actions.getAllRatePlans();
    actions.getAllRatePlanJobs();
  }, []);

  useEffect(() => {
    if (ratePlanJobs.ratePlanJobLevels !== undefined) {
      //   const { ratePlanItems: ratePlanItemsData } = ratePlans;
      //   console.log('here it is');
      //   console.log(ratePlans.ratePlanItems);
      //   console.log('-------end');
      setModalFormData({ ...modalFormData, levels: [...ratePlanJobs.ratePlanJobLevels.levels] });
      // setModalFormData({ ...modalFormData, ...ratePlanJobs.ratePlanJobLevels });
      setTblRowCount(ratePlanJobs.ratePlanJobLevels.levels.length);
      setTblInitRowCount(ratePlanJobs.ratePlanJobLevels.levels.length);
      // setIsModalLoading(false);
      // actions.getRatePlanJobLevels();
      // setBillItems(serverResponse.rpItems[0].jbi_items);

    }
  }, [
    // ratePlanJobs.levels
    ratePlanJobs.ratePlanJobLevels
  ]);

  const defaultModalState: any = {
    id: 0,
    levels: []
  };

  const defaultLevelFormData = {
    id: 0,
    userId: 0,
    userTypeId: 0,
    ratePlanLevelId: 0,
    levelId: 0
  };

  const [levelFormData, setLevelFormData] = useState(defaultLevelFormData);
  const [levelJobId, setLevelJobId] = useState(0);

  const [modalFormData, setModalFormData] = useState(defaultModalState);
  const [userTypeId, setUserTypeId] = useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tblRowCount, setTblRowCount] = useState(defaultModalState.levels.length);
  const [tblInitRowCount, setTblInitRowCount] = useState(0);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);


  const getSelectedUserLevel = (userData: any) => {
    // modalFormData.levels.filter((singleLevel: any) => singleLevel)
    // console.log('-----', userData.invoiceLevels);
    // console.log('+++++', modalFormData.levels);
    const currentLevel = userData.invoiceLevels.filter((userLevel: any) => modalFormData.levels.some((singleLevel: any) => {
      // console.log('-------------');
      // console.log(userLevel, singleLevel);
      // console.log('-------------');
      if (
        // true
        singleLevel.id == userLevel.ratePlanLevelId &&
        singleLevel.levelId == userLevel.levelId &&
        userTypeId == userLevel.userTypeId
      ) {
        return true;
      }
      return false;
    }));
    if (currentLevel.length) {
      console.log('seeeeeeeeeeee', currentLevel[0].id);

    }
    return currentLevel.length ? currentLevel[0].id : 0;
  };

  const onLevelChange = (e: any, userData: any) => {
    e.preventDefault();
    const value = e.target.value;
    if (!(userData.id && value && userTypeId)) {
      return;
    }
    const levelObj = {
      userId: userData.id,
      userTypeId: userTypeId,
      ratePlanLevelId: e.target.value
    };

    axios.put(configs.url.API_URL + '/invoice-levels', levelObj, authHeader(getState))
      .then((res) => {
        // actions.getRatePlanJobLevels(levelJobId);
        actions.getUsers();
      }).catch((err) => {

      });
  };


  const onJobTypeFilterChange = async (e: any) => {
    const value = e.target.value;
    // setLevelFormData({ ...levelFormData, id: value });

    const currentJobType = _.find(ratePlanJobsData, (jobType) => jobType.id == value);
    console.log(currentJobType);
    if (!currentJobType) {
      return;
    }
    const userTypeValue = _.find(getUserTypesList(), (userType) => userType.name === currentJobType.job);

    if (!userTypeValue) {
      return;
    }

    setUserTypeId(userTypeValue.id);

    if (value && value != '0') {
      setLevelJobId(value);
      await actions.getRatePlanJobLevels(value);
    } else {
      setLevelJobId(0);
      // setModalFormData({ ...modalFormData, levels: [] });
    }
  };

  const onUserTypeChange = (e: any) => {
    setUserTypeId(e.target.value);
  };

  const onJobTypeChange = async (e: any) => {
    console.log(modalFormData);
    const value = e.target.value;
    setModalFormData({ ...modalFormData, id: value });
    if (value && value != '0') {
      await actions.getRatePlanJobLevels(value);
    } else {
      setModalFormData({ ...modalFormData, levels: [] });
    }
  };

  const editModalHandler = (e: any) => {
    e.preventDefault();
    setModalFormData({ ...modalFormData, levels: [] });
    setIsModalOpen(true);
    setIsModalLoading(true);
  };

  const closeModal = () => {
    if (levelJobId) {
      actions.getRatePlanJobLevels(levelJobId);
    }
    setModalFormData({ ...modalFormData, ...defaultModalState });
    setIsModalOpen(false);
  };

  const addNewRow = (e: any) => {
    e.preventDefault();

    let obj = { id: 0, levelId: 0, ratePlanId: 0 };
    setModalFormData({ ...modalFormData, levels: [...modalFormData.levels, obj] });
    setTblRowCount(tblRowCount + 1);
  };

  const deleteRow = (e: any) => {
    e.preventDefault();
    if (tblRowCount > 0) {
      modalFormData.levels.splice(-1, 1);
      setTblRowCount(tblRowCount - 1);
      setModalFormData({ ...modalFormData });
    }
  };

  const updateModalFormData = (e: any, dt: any, key: any, val: any, order: number) => {

    const deepCopied = JSON.parse(JSON.stringify(modalFormData.levels)).map((_dt: any, i: any) => {
      if (_dt.id === dt.id && order == i) {
        return { ..._dt, [key]: val };
      } else {
        return _dt;
      }
    });
    let currentValue: any = deepCopied;

    if (key === 'levelId' || key === 'ratePlanId') {
      for (let i = 0; i < currentValue.length; i++) {
        console.log('key, val, order, i, dt', key, val, order, i, dt);

        if (order == i) {
          if (key === 'ratePlanId') {
            currentValue[i].ratePlanId = val;
            currentValue[i].levelId = i + 1;
          }
        }
      }
    }
    console.log(currentValue);
    setModalFormData({ ...modalFormData, levels: currentValue });
  };

  const saveModalData = async (e: any) => {
    e.preventDefault();
    setModalSubmitted(true);
    console.log(modalFormData);
    await actions.updateRatePlanJobLevels(modalFormData.id, modalFormData);
    setIsModalOpen(false);
  };

  const getUsersDataByUserTypeId = () => {
    const usersDataList = usersData.filter((user: any) => user.userTypes.some((userType: any) => userType.id == userTypeId));
    return usersDataList;
  };

  const getUserTypesList = () => {
    const excludeUserTypes = [1, 2, 3];
    const userTypesDataList = userTypesData.filter((userType: any) => !excludeUserTypes.includes(userType.id));
    return userTypesDataList;
  };

  const ratePlansByJobId = () => {
    const ratePlansDataList = ratePlansData.filter((ratePlan: any) => ratePlan.jobId == modalFormData.id);
    return ratePlansDataList;
  };


  const { users: usersData } = users;
  const { userTypes: userTypesData } = userTypes;
  const { ratePlans: ratePlansData } = ratePlans;
  const { ratePlanJobs: ratePlanJobsData } = ratePlanJobs;









  useEffect(() => {
    const url = configs.url.API_URL + '/jobs';

    axios.get(url, authHeader(getState))
      .then(response => {
        setJobState(JSON.parse(JSON.stringify(response.data)));
        setLoadingState(false);
        // console.log(response.data);
      });

  }, []);

  const defaultState: any = {
    job_id: '',
  };



  const [modalFormDataa, setModalFormDataa] = useState([]);
  const [formData, setFormData] = useState(defaultState);
  const [jobData, setJobData] = useState('');
  const [jobsData, setJobState] = useState([]);
  const [loading, setLoadingState] = useState(true);
  const [levelsData, setLevelsData] = useState([]);
  const [invoiceLevelsData, setInvoiceLevelsData] = useState([] as any);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [formLevelData, setFormLevelData] = useState(defaultState);
  const [rpSampleData, setRpSampleData] = useState([]);

  const handleSubmit = (e: any) => {

  };
  const onFormChange = (e: any) => {

  };
  const onStatusChange = (e: any) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    axios.get(`${configs.url.API_URL}/invoices/${e.target.value}`, authHeader(getState))
      .then((res) => {
        const serverResponse = JSON.parse(JSON.stringify(res.data));
        setLevelsData(serverResponse);
        console.log(levelsData);
      }).catch((err) => {
        console.log(err);
      });
  };
  const clearData = () => {

  };
  const handleEdit = (e: any, leveldata: any) => {

  };



  const onLevelStatusChange = (e: any, contractor_id: any) => {
    e.preventDefault();
    const obj = {
      type_id: formData.job_id,
      contractor_id: contractor_id,
      level_id: parseInt(e.target.value, 10),
    };
    axios.post(configs.url.API_URL + '/update_contractor_level', obj, authHeader(getState))
      .then((res) => {
        const serverResponse = JSON.parse(JSON.stringify(res.data));
        console.log(serverResponse);
        if (serverResponse.status) {
          let currentValue: any = [...levelsData];
          for (let i = 0; i < currentValue.length; i++) {
            if (currentValue[i].contractor_id === contractor_id) {
              currentValue[i].level_id = obj.level_id;
            }
          }
          setLevelsData(currentValue);
          toast.success(serverResponse.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  };
  const assignRatePlan = () => {
    setIsOpen(true);
  };

  const closeModals = () => {
    setIsOpen(false);
    setJobData('');
    setInvoiceLevelsData([]);
  };

  const afterOpenModal = () => {

    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  };
  const updateModalLevelData = (e: any, dt: any) => {
    e.preventDefault();
    const obj = {
      type_id: jobData,
      level_id: dt.level_name,
      rp_id: e.target.value,
    };
    axios.post(configs.url.API_URL + '/update_invoice_levels', obj, authHeader(getState))
      .then((res) => {
        const serverResponse = JSON.parse(JSON.stringify(res.data));
        console.log(serverResponse);
        if (serverResponse.status) {
          let currentValue: any = [...invoiceLevelsData];
          // let keys = Object.keys(currentValue);
          for (let i = 0; i < currentValue.length; i++) {
            if (currentValue[i].level_name === dt.level_name) {
              currentValue[i].rp_id = obj.rp_id;
            }
          }
          setInvoiceLevelsData(currentValue);
          toast.success(serverResponse.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  };
  const onJobChange = (e: any) => {
    setJobData(e.target.value);
    axios.get(`${configs.url.API_URL}/invoicelevels/${e.target.value}`, authHeader(getState))
      .then((res) => {
        const serverResponse = JSON.parse(JSON.stringify(res.data));
        setRpSampleData(serverResponse[0].rateplans);
        setInvoiceLevelsData(serverResponse);
      }).catch((err) => {
        console.log(err);
      });
  };
  const deleteLevelRow = (e: any, delid: any) => {
    e.preventDefault();
    console.log(delid);
    if (window.confirm('Do you really want to delete this!')) {

      axios.get(`${configs.url.API_URL}/delete_rateplan_levels/${delid}`, authHeader(getState))
        .then((res) => {
          const serverResponse = JSON.parse(JSON.stringify(res.data));
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

            var index = JSON.parse(JSON.stringify(invoiceLevelsData)).findIndex((e: any) => e.delid == delid);
            //copy array
            var newAray = JSON.parse(JSON.stringify(invoiceLevelsData)).slice();
            //delete element by index
            newAray.splice(index, 1);
            setInvoiceLevelsData(newAray);
          }

        }).catch((err) => {
          console.log(err);
        });
    }
  };
  const addNewLevel = (e: any) => {
    e.preventDefault();
    axios.post(configs.url.API_URL + '/add_new_invoice_level',
      {
        type_id: jobData,
        level_name: invoiceLevelsData[invoiceLevelsData.length - 1].level_name,
      },
      authHeader(getState)
    ).then((res) => {
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
        console.log(serverResponse.objData[0]);
        // let obj = JSON.parse(serverResponse.objData[0]);
        setInvoiceLevelsData(serverResponse.objData);
        // invoiceLevelsData.push(serverResponse.objData[0]);
      }
    }).catch((err) => {
      console.log(err);
    });
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
                    Invoices
                    <br />
                    <small>Manage Invoices &amp; details</small>
                  </h3>
                </div>
                <div className="col-md-9 mt-20 text-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => editModalHandler(e)}
                  >
                    <i className="fas fa-arrow-circle-left mr-5" />
                      Assign Rate Plan
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <form className="form-horizontal" onSubmit={(e) => handleSubmit(e)}>
                <h4 className="text_blue">
                  Invoice Details
                                </h4>
                <div className="clear pad-5" />
                <div className="row">






                  {/* <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      User Type :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className="form-control"
                        name="userTypeId"
                        value={userTypeId || ''}
                        onChange={(e) => onUserTypeChange(e)}
                      >
                        <option value={0}>select...</option>
                        {getUserTypesList().length ? getUserTypesList().map((userType: any, i: any) => (
                          <option key={i} value={userType.id}>{userType.name}</option>
                        )) : (<></>)}
                      </select>
                    </div>
                  </div> */}

                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Job Type :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <select
                        className="form-control"
                        name="levelJobId"
                        value={levelJobId || ''}
                        onChange={(e) => onJobTypeFilterChange(e)}
                      >
                        <option value={0}>select...</option>
                        {ratePlanJobsData.length ? ratePlanJobsData.map((ratePlanJob: any, i: any) => (
                          <option key={i} value={ratePlanJob.id}>{ratePlanJob.job}</option>
                        )) : (<></>)}
                      </select>
                    </div>
                  </div>

                </div>
                <hr />
              </form>


              <div className="clear pad-5" />

              {/* <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>
                        Sub Contractor Name
                      </th>
                      <th>
                        Sub Contractor Levels
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelsData.length > 0 ? levelsData.map((leveldata: any) => (
                      <tr key={leveldata.contractor_id}>
                        <td>
                          <strong>{leveldata.contractor_name}</strong>
                        </td>
                        <td>
                          <select
                            className="form-control"
                            name="level_id"
                            value={leveldata.level_id}
                            onChange={(e) => onLevelStatusChange(e, leveldata.contractor_id)}
                          >
                            <option value={0}>select...</option>
                            {leveldata.levels.length > 0 ? leveldata.levels.map((jd: any, i: any) => (
                              <option key={i} value={jd?.id}>{jd?.level_name} </option>
                            )) : (
                                <option value={0}>select...</option>
                              )}
                          </select>
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
              </div> */}




              <div className="col-md-10 col-md-offset-1">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>
                          Sub Contractor Name
                        </th>
                        <th>
                          Sub Contractor Levels
                        </th>
                      </tr>
                    </thead>
                    <tbody id='minvoicesListTableBody'>
                      {levelJobId && getUsersDataByUserTypeId().length > 0 ? getUsersDataByUserTypeId().map((userData: any) => (
                        <tr key={userData.id} id={`tblRow${userData.id}`} onClick={()=>handleSelectedRow(userData)}>
                          <td>
                            <strong>{userData.name}</strong>
                          </td>
                          <td>
                            <select
                              className="form-control"
                              name="levelId"
                              value={getSelectedUserLevel(userData)}
                              onChange={(e) => onLevelChange(e, userData)}
                            >
                              <option value={0}>select...</option>
                              {modalFormData.levels.length > 0 ? modalFormData.levels.map((level: any, i: any) => (
                                <option key={i} value={level.id}>Level {level.levelId}</option>
                              )) : (<></>)}
                              {/* {leveldata.levels.length > 0 ? leveldata.levels.map((jd: any, i: any) => (
                                <option key={i} value={jd?.id}>{jd?.level_name} </option>
                              )) : (
                                  <option value={0}>select...</option>
                                )} */}
                            </select>
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
                </div>
              </div>
              <div className="clear pad-5"></div>





            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModals}
        style={customStyles}
        contentLabel="Assign Rate Plan"
      >
        <button onClick={closeModals}>close</button>
        <br /><br /><div>Job Type</div>
        <select
          className="form-control"
          name="job_id"
          value={jobData || ''}
          onChange={(e) => onJobChange(e)}
        >
          <option value={0}>select...</option>
          {!loading ? jobsData.map((jd: any, i: any) => (
            <option key={i} value={jd?.id}>{jd?.job}</option>
          )) : (
              <option value={0}>select...</option>
            )}
        </select>
        <br /><br />
        <table className="modaltbl">
          <thead>
            <tr>
              <th>
                Level
                            </th>
              <th>
                Rate Plan
                            </th>
              <th>
                Action
                            </th>
            </tr>
          </thead>
          <tbody>
            {invoiceLevelsData.length > 0 ? invoiceLevelsData.map((dt: any, i: any) => (
              <tr key={i} >
                <td>{dt.level_name}</td>
                <td>
                  <select
                    className="form-control"
                    name="job_id"
                    value={dt.rp_id || ''}
                    onChange={(e) => { updateModalLevelData(e, dt) }}
                  >
                    <option value={0}>select...</option>
                    {dt.rateplans.length > 0 ? dt.rateplans.map((jd: any, i: any) => (
                      <option key={i} value={jd?.id}>{jd?.rate_plan_name}</option>
                    )) : (
                        <option value={0}>select...</option>
                      )}
                  </select>
                </td>
                <td>
                  <button type="button" className="btn btn-danger right-10" onClick={(e) => deleteLevelRow(e, dt.delid)}>
                    Delete
                                    </button>
                </td>
              </tr>
            )) : (
                <tr>
                  <td colSpan={3}>Sorry! no data available...</td>
                </tr>
              )}
          </tbody>
        </table>
        <div className="pull-center top10">
          <button type="button" className="btn btn-info mr-5" onClick={(e) => addNewLevel(e)}>
            Add New Level
                    </button>
        </div>
      </Modal>















      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalCustomStyles}
        contentLabel="Assign Rate Plan"
      >
        <button onClick={closeModal}>close</button>
        <br /><br />
        <form className="form-horizontal">

        <div className="col-md-10 col-md-offset-1">
          <div className="form-group col-md-12 mb-20">
            <label className="col-md-3 control-label">
              Job Type :
              <span className="text_red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-control"
                name="jobId"
                value={modalFormData.id || ''}
                onChange={(e) => onJobTypeChange(e)}
                >
                <option value={0}>select...</option>
                {ratePlanJobsData.length ? ratePlanJobsData.map((ratePlanJob: any, i: any) => (
                  <option key={i} value={ratePlanJob.id}>{ratePlanJob.job}</option>
                  )) : (<></>)}
              </select>
              </div>
          </div>

            <br /><br />
            <table className="modaltbl">
              <thead>
                <tr>
                  <th>SI.No.</th>
                  <th>Level</th>
                  <th>Rate Plan</th>
                </tr>
              </thead>
              <tbody id="jobtypemodelListTbody">
                {modalFormData.levels.length > 0 ? modalFormData.levels.map((dt: any, i: any) => (
                  <tr key={i} id={`tblRow${dt.id}`} onClick={()=>handleSelectedRow2(dt)}>
                    <td>{i + 1}</td>
                    <td>Level {i + 1}</td>
                    <td>
                      <select
                        className="form-control"
                        name="ratePlanId"
                        value={dt.ratePlanId}
                        onChange={(e) => updateModalFormData(e, dt, 'ratePlanId', e.target.value, i)}
                      >
                        <option value={0}>select...</option>
                        {ratePlansByJobId().length > 0 ? ratePlansByJobId().map((ratePlan: any, i: any) => (
                          <option key={i} value={ratePlan.id}>{ratePlan.ratePlanName}</option>
                        )) : (<></>)}
                      </select>
                    </td>
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
          </div>
        </form>
      </Modal>





    </>
  );
};



InvoicesPage.propTypes = {

};

const mapStateToProps = (state: InvoicesReduxProps) => ({
  invoices: state.invoices,
  users: state.users,
  userTypes: state.userTypes,
  ratePlans: state.ratePlans,
  ratePlanJobs: state.ratePlanJobs
});

// const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: {
    getAllRatePlans: bindActionCreators(ratePlanActions.getAllRatePlans, dispatch),
    getAllRatePlanJobs: bindActionCreators(ratePlanJobActions.getAllRatePlanJobs, dispatch),
    getUsers: bindActionCreators(UserActions.getUsers, dispatch),
    getAllUserTypes: bindActionCreators(userTypeActions.getAllUserTypes, dispatch),
    getRatePlanJobLevels: bindActionCreators(ratePlanJobActions.getRatePlanJobLevels, dispatch),
    updateRatePlanJobLevels: bindActionCreators(ratePlanJobActions.updateRatePlanJobLevels, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InvoicesPage);

