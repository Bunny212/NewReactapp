import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { Dispatch, bindActionCreators } from 'redux';
import _ from 'lodash';
import Modal from 'react-modal';
import { ThunkDispatch } from 'redux-thunk';
import History from '../common/History';
import * as ratePlanActions from '../../redux/actions/ratePlanAction';
import * as ratePlanJobActions from '../../redux/actions/ratePlanJobActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  RatePlanReduxProps,
  RatePlanList,
  RatePlan,
  Target,
} from '../../types/interfaces';
import { resolve } from 'path';
import { TableHeader, Pagination, Search } from "../DataTable";
import ReactPaginate from 'react-paginate';
import { configs } from '../../types/Constants';

//Yellow code highliter 
const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('rateplansListTableBody');
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
// Modal.setAppElement('#root');

const RatePlanPage = ({ ratePlans, ratePlanJobs, billingItems, meta, actions }: RatePlanList) => {
  useEffect(() => {
    // actions.getAllRatePlans();
    actions.getAllRatePlanJobs();
    actions.getAllBillingItems();
  }, [
    // actions.getAllRatePlans,
    actions.getAllRatePlanJobs,
    actions.getAllBillingItems
  ]);

  useEffect(() => {
    if (ratePlans.ratePlanItems && ratePlans.ratePlanItems.id !== undefined) {
      const { ratePlanItems: ratePlanItemsData } = ratePlans;
      console.log('here it is');
      console.log(ratePlans.ratePlanItems);
      console.log('-------end');
      setModalFormData({ ...defaultModalState, ...ratePlanItemsData });
      setTblRowCount(ratePlanItemsData.items.length);
      setTblInitRowCount(ratePlanItemsData.items.length);
      setIsModalLoading(false);
      actions.getAllBillingItems();
      // setBillItems(serverResponse.rpItems[0].jbi_items);

    }
  }, [
    ratePlans.ratePlanItems,
    actions.getAllBillingItems
  ]);

  const defaultState = {
    id: 0, ratePlanName: '', ratePlanPrice: 0, jobId: 0, job: 0
  };

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const { ratePlans: ratePlansData } = ratePlans;
  // const { ratePlanItems: ratePlanItemsData } = ratePlans;
  const { ratePlanJobs: ratePlanJobsData } = ratePlanJobs;
  const { billingItems: billingItemsData } = billingItems;


  const clearData = () => {
    // setSubmitted(false);
    // setFormData({ ...defaultState });
    return History.push('/home');
  };

  const handleDelete = (e: any, id: number) => {
    e.preventDefault();
    actions.deleteRatePlan(id);
    actions.getAllRatePlans();
    // show success messgae
  };

  const handleEdit = (e: any, ratePlan: RatePlan) => {
    e.preventDefault();
    const ratePlanPrice = parseFloat(ratePlan.ratePlanPrice.toFixed(2));
    setFormData({ ...defaultState, ...ratePlan, ratePlanPrice });
  };
  


  const defaultModalState: any = {
    id: 0,
    ratePlanName: '',
    ratePlanPrice: 0,
    jobId: 0,
    items: []
  };

  const defaultModalStates: any = {
    id: 0, job_id: 0, m_rateplan_name: '', rpItems: [],
  };

  const [modalFormData, setModalFormData] = useState(defaultModalState);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tblRowCount, setTblRowCount] = useState(defaultModalState.items.length);
  const [activeTxt, setTextActive] = useState(false);
  const [tblInitRowCount, setTblInitRowCount] = useState(0);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);

  const closeModal = () => {
    console.log('closing');
    console.log(defaultModalState);
    // setModalFormData({ ...modalFormData, ratePlanName: '' });
    setModalFormData({ ...modalFormData, ...defaultModalState });
    setIsModalOpen(false);
    setTextActive(false);
  };

  const addNewRow = (e: any) => {
    e.preventDefault();

    // const rowCount = tblRowCount + 1;
    let obj = { id: activeTxt ? 'new' : 0, billingItemName: activeTxt ? 'New' : '', rate: 0 };
    // console.log(modalFormData.rpItems);
    setModalFormData({ ...modalFormData, items: [...modalFormData.items, obj] });
    setTblRowCount(tblRowCount + 1);
  };

  const deleteRow = (e: any) => {
    e.preventDefault();
    if (tblRowCount > 0) {
      modalFormData.items.splice(-1, 1);
      setTblRowCount(tblRowCount - 1);
      setModalFormData({ ...modalFormData });
    }
  };

  const getBillingItemName = (id: any) => {
    const name = billingItemsData.filter((item) => item.id == id)
      .map((singleItem: any) => singleItem.billingItemName);
    console.log(name);
    return name.length ? name[0] : '';
  }
  const updateModalFormData = (e: any, dt: any, key: any, val: any, order: number) => {

    const deepCopied = JSON.parse(JSON.stringify(modalFormData.items)).map((_dt: any, i: any) => {
      if (_dt.id === dt.id && order == i) {
        // if (parseInt(_dt.id, 10) > 0) {
        //   return { ..._dt, [key]: 'so' };
        // }
        return { ..._dt, [key]: val };
      } else {
        // if (parseInt(_dt.id, 10) > 0) {
        //   return { ..._dt, [key]: 'so' };
        // }
        return _dt;
      }
    });

    console.log('here......');
    console.log(deepCopied);
    let currentValue: any = deepCopied;



    if (key == 'billingItemName' || key == 'id') {
      for (let i = 0; i < currentValue.length; i++) {
        console.log('key, val, order, i, dt', key, val, order, i, dt);

        if (key == 'id' && (currentValue[i].id == 0 || currentValue[i].id == 'new') && val == 'new' && !activeTxt) {
          setTextActive(true);
        }




        if (key === 'id' && val === 'new') {
          if (parseInt(currentValue[i].id, 0) === 0) {
            currentValue[i].id = 'new';
            currentValue[i].billingItemName = 'New';
          } else if (parseInt(currentValue[i].id, 0) > 0) {
            currentValue[i].billingItemName = getBillingItemName(currentValue[i].id);
          }
        }

        if (order == i) {
          console.log('-----------i am in');

          if (key === 'billingItemName') {
            currentValue[i].billingItemName = val;

          }

          if (key === 'id') {
            currentValue[i].id = val;
            if (val === 'new') {
              currentValue[i].billingItemName = 'New';
            }
          }

          if (key === 'id') {
            // currentValue[i].billingItemName = 'This is test';
          }

          // if (parseInt(currentValue[i].id, 10) > 0) {
          //   currentValue[i].id = val;
          //   // currentValue[i].billingItemName = val;
          // } else {
          //   currentValue[i].billingItemName = val;
          //   // currentValue[i].id = 'new';
          // }

          // if (currentValue[i].id != 'new') {
          //   currentValue[i].id = val;
          // }
          // if (key == "id" && val == "new" && !activeTxt) {
          //   setTextActive(true);
          // }
        }
        //  else if (currentValue[i].id == 0 && val == "new" && !activeTxt) {
        //   setTextActive(true);
        // }
        // if (val == 'new' && !activeTxt && parseInt(currentValue[i].id, 10) > 0) {
        //   currentValue[i].billingItemName = currentValue[i].bi
        // }
        // if (currentValue[i].id == 0 && val == "new" && !activeTxt) {
        // currentValue[i].id = 'new';
        // }
      }

      // for (let i = 0; i < currentValue.length; i++) {
      //   if (currentValue[i].id === dt.id) {
      //     currentValue[i].bill_id = val;
      //     if (key == "billitem" && val == "new" && currentValue[i].id === dt.id) {
      //       setTextActive(true);
      //     }
      //   }
      // }
    }
    console.log('Items value');
    console.log(currentValue);
    //console.log('++enditems --------');
    // deepCopied
    setModalFormData({ ...modalFormData, items: currentValue });
  };

  const editModalHandler = async (e: any, ratePlanName: any, ratePlanId: any, jobId: any) => {
    console.log('ratePlanName', ratePlanName);
    console.log('ratePlanId', ratePlanId);
    console.log('jobId', jobId);
    e.preventDefault();
    setIsModalOpen(true);
    setIsModalLoading(true);


    await actions.getRatePlanItems(ratePlanId);
    console.log('yes working...');


    // await axios.post(configs.url.API_URL + '/rateplan_items', { rpid: ratePlanId }, authHeader(getState))
    //   .then((res) => {
    //     const serverResponse = JSON.parse(JSON.stringify(res.data));
    // console.log(ratePlanItemsData);
    // setTblRowCount(ratePlanItemsData.items.length);
    // setTblInitRowCount(ratePlanItemsData.items.length);
    // setBillItems(serverResponse.rpItems[0].jbi_items);
    // setMLoadingState(false);
    // setModalFormData({
    //   ...modalFormData,
    //   id: (ratePlanId as any),
    //   job_id: (jobId as any),
    //   m_rateplan_name: (ratePlanName as any),
    //   rpItems: [...serverResponse.rpItems]
    // });
    //   }).catch((err) => {
    //     console.log(err);
    //   });

    // // console.log(JSON.parse(JSON.stringify(ratePlanId)));
    // // setModalFormData({ ...modalFormData, rpItems: [...serverResponse] });
    // // setModalFormData({ ...modalFormData, id: (ratePlanId as any), m_rateplan_name: (ratePlanName as any), rpItems: [...serverResponse] });
    // setRatePlanForPopup(ratePlanName);
    // setJobId(jobId);
  };

  const saveModalData = async (e: any) => {
    e.preventDefault();
    setModalSubmitted(true);
    console.log(modalFormData);
    await actions.updateRatePlan(modalFormData);
    // await actions.updateRatePlanItems(modalFormData.id, modalFormData);
    // // const formData = JSON.parse(JSON.stringify(modalFormData));
    // axios.post(configs.url.API_URL + '/update_rateplan_items', modalFormData, authHeader(getState))
    //   .then((res) => {
    //     const serverResponse = JSON.parse(JSON.stringify(res.data));
    //     console.log(serverResponse);
    //     if (serverResponse.status) {
    //       toast.success(serverResponse.message, {
    //         position: "top-right",
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //       });
    setIsModalOpen(false);

    //     }
    //   }).catch((err) => {
    //     console.log(err);
    //   });
  };

  //New Change riz
  const onFormChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^([0-9]*[.]?[0-9]{0,2})$/;
    const match = e.target.value.match(regex);
    if (match) {
      const newValue = match[0];
      setFormData({ ...formData, [e.target.name]: newValue });
    }
  };
  
  
  
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const regex = /^([0-9]*[.]?[0-9]{0,2})$/;
    const match = e.target.value.match(regex);
    if (match) {
      const newValue = parseFloat(match[0]).toFixed(2);
      setFormData({ ...formData, [e.target.name]: newValue });
    }
  };
  

  
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }
//New Change rix end


  const onFormChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    console.log(formData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (formData.ratePlanName && formData.jobId && formData.ratePlanPrice) {
      if (!formData.id) {
        actions.addRatePlan(formData);
        actions.getAllRatePlans();
      } else {
        actions.updateRatePlan(formData);
        actions.getAllRatePlans();
      }
    }
  };

  //Pagination Start
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });


  const initialratePlanData: any = [];
  const [newRatePlanData, setNewRatePlanData] = useState(initialratePlanData);

  // useEffect(() => {
  //   // console.log("Total Data Length =>", jobOrdersData.length);
  //   setTotalItems(ratePlansData.length);

  //   //Current Page slice
  //   let newSliceData = JSON.parse(JSON.stringify(ratePlansData)).slice(
  //       (currentPage - 1) * itemPerPage,
  //       (currentPage - 1) * itemPerPage + itemPerPage
  //   );
  //   setNewRatePlanData(newSliceData);
  //   console.log(newSliceData);

  // }, [
  //   ratePlans, ratePlansData, currentPage, search, sorting
  // ]);

  const changePerPage = (e: any) => {
    const pageValue = parseInt(e.target.value, 10);
    setItemPerPage(pageValue);

    //Current Page slice
    let newSliceData = JSON.parse(JSON.stringify(ratePlansData)).slice(
        (currentPage - 1) * pageValue,
        (currentPage - 1) * pageValue + pageValue
    );

    setNewRatePlanData(newSliceData);
  }


  const defaultColumnFilters: { [key: string]: boolean } = {
    all: true,
    supervisor: false,
    hanger: false,
    sprayer: false,
    sander: false,
    taper: false,
  };
  const [columnFilters, setColumnFilters] = React.useState(defaultColumnFilters);
  const [hasFilter, setHasFilter] = useState(false);
  const [filterArr, setFilterArr] = useState<any[]>([]);

  const onColumnFilterChange = (e:any) => {
    const name = e.target.name;
    const val = columnFilters[name] === true ? false : true;
    if (name === 'all') {
      const filterObj = {
        all: true,
        supervisor: false,
        hanger: false,
        taper: false,
        sprayer: false,
        sander: false
      };
      setColumnFilters({ ...columnFilters, ...filterObj });
      // setTotalItems(ratePlansData.length);
      //Current Page slice
      // let newSliceData = JSON.parse(JSON.stringify(ratePlansData)).slice(
      //     (currentPage - 1) * itemPerPage,
      //     (currentPage - 1) * itemPerPage + itemPerPage
      // );
      // setNewRatePlanData(newSliceData);
      setHasFilter(false);
      setFilterArr([]);
    } else {
      setHasFilter(true);
      const filterObj = {
        all: false,
        [e.target.name]: val
      };
      setColumnFilters({ ...columnFilters, ...filterObj });
      let active = _.keys(_.pickBy(columnFilters));
      if(active.indexOf('all') > -1){
        active.splice(active.indexOf('all'), 1);
      }

      if(val){
        active.push(name);
      }else{
        active.splice(active.indexOf(name), 1);
      }
      setFilterArr(active);

      // let newSearchedData = ratePlansData.filter((data: any) => {
      //   return active.includes(data.job.toLowerCase())
      // });
      // setTotalItems(newSearchedData.length);
      // //Current Page slice
      // let newSliceData = JSON.parse(JSON.stringify(newSearchedData)).slice(
      //   (currentPage - 1) * itemPerPage,
      //   (currentPage - 1) * itemPerPage + itemPerPage
      // );
      // setNewRatePlanData(newSliceData);
    }
  };

  //Pagination End



  // Pagination start
  const defaultPaginationOptions: any = {
    // offset: 0,
    limit: itemPerPage,
    currentPage: 1,
    userTypes: [],
    searchText: ''
  };
  const [paginationOptions, setPaginationOptions] = useState(defaultPaginationOptions);
  
  const onPerPageChange = (e: any) => {
    const pageValue = parseInt(e.target.value, 10);
    setItemPerPage(pageValue);
    setCurrentPage(1);
    const paginationUl = document.querySelector('.pagination') as HTMLElement | null;
      const firstLi = paginationUl?.querySelector('li:nth-child(2)') as HTMLElement | null;
      if (paginationUl) {
        const liElements = paginationUl.querySelectorAll('li');
        liElements.forEach((li) => {
          li.classList.remove('active');
        });
        // if (firstLi) {
        //   firstLi.classList.add('active');
        // }
      }
  }
  
  const getRatePlansPaginated = (selectedPage: number) => {
    const limit = itemPerPage;
    setCurrentPage(selectedPage);
    const options = { page: selectedPage, limit, searchText: paginationOptions.searchText };
    if (!_.isEmpty(paginationOptions.userTypes)) {
      actions.getRatePlanList({ ...options, userTypes: paginationOptions.userTypes });
    } else {  
      actions.getRatePlanList(options);
    }      
  };

  useEffect(() => {
    actions.getRatePlanList({ ... paginationOptions })
  }, [actions.getRatePlanList]);

  useEffect(() => {
    getRatePlansPaginated(currentPage);
  }, [itemPerPage])
  
  useEffect(() => {
    getRatePlansPaginated(currentPage);
  }, [paginationOptions])

  useEffect(() => {
    const userTypeListFilter = [];
    if (!_.isEmpty(filterArr)) {
      for (let singleUserType of filterArr) {
        if (singleUserType === 'hanger') {
          userTypeListFilter.push(1);
        } else if (singleUserType === 'sprayer') {
          userTypeListFilter.push(4);
        } else if (singleUserType === 'sander') {
          userTypeListFilter.push(3);
        } else if (singleUserType === 'taper') {
          userTypeListFilter.push(2);
        }
      }
    }
    setPaginationOptions({ ...paginationOptions, userTypes: userTypeListFilter, searchText: search.toLowerCase() });
  }, [
    filterArr, search
    // users, usersData, currentPage, search, sorting
  ]);

  const showData = () => {
    if (ratePlans.loading) {
      return (
        <tr>
          <td colSpan={10} className="text-center">
            Loading...
          </td>
        </tr>
      )
    }
    if (!_.isEmpty(ratePlansData)) {
        return (
          <>
            {ratePlansData.map((ratePlan: any, i:any) => (
              <tr key={ratePlan.id} id={`tblRow${ratePlan.id}`} onClick={()=>handleSelectedRow(ratePlan)}>
                <td>
                  {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                </td>
                <td>
                  <strong>{ratePlan.ratePlanName}</strong>
                </td>
                <td>
                  {ratePlan.ratePlanPrice.toFixed(2)}
                </td>
                <td>
                  {ratePlan.job}
                </td>
                <td>
                  <a
                    href="#"
                    title="Edit"
                    className="text_grey_d ml-5"
                    onClick={(e) => handleEdit(e, ratePlan)}
                  >
                    <i className="fa fa-edit fa-lg" />
                  </a>
                  <a
                    href="#"
                    title="Edit"
                    className="text_red ml-5"
                    onClick={(e) => handleDelete(e, ratePlan.id)}
                  >
                    <i className="fa fa-times-circle fa-lg" />
                  </a>

                </td>
              </tr>
            ))}
          </>
        )
    }
    
    if (ratePlans.error) {
      return <p>{ ratePlans.error }</p>
    }
    return <p>Unable to get data</p>
  }


  
  return (
    <>
      <div className="clear pad-40" />
      <div className="container">
        <div className="row">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    Rate Plans
                    <br />
                    <small>Manage Rate Plans &amp; details</small>
                  </h3>
                </div>
                <div className="col-md-9 mt-20 text-right">
                </div>
              </div>
            </div>

            <div className="card-body">
              <form className="form-horizontal" onSubmit={(e) => handleSubmit(e)}>
                <h4 className="text_blue">
                  Rate Plan Details
                </h4>
                <div className="clear pad-5"></div>
                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Name :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="ratePlanName"
                        value={formData.ratePlanName || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.ratePlanName ? 'ap-required' : ''}`}
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
                        className={`form-control ${submitted && !formData.jobId ? 'ap-required' : ''}`}
                        name="jobId"
                        value={formData.jobId.toString() || '0'}
                        onChange={(e) => onStatusChange(e)}
                      >
                        <>
                          <option value={0}>select...</option>
                          {ratePlanJobsData.length > 0 ? ratePlanJobsData.map((singleRatePlanJob: any) => (
                            <option key={singleRatePlanJob.id} value={singleRatePlanJob.id}>{singleRatePlanJob.job}</option>
                          )) : (<></>)}
                        </>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Price per SQFT : 
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="ratePlanPrice"
                        value={formData.ratePlanPrice || ''}
                        onChange={(e) => onFormChangePrice(e)}
                        onBlur={(e) => onInputBlur(e)}
                        onKeyDown={(e) => onInputKeyDown(e)}
                        step="0.01"
                        className={`form-control ${submitted && !formData.ratePlanPrice ? 'ap-required' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mt-20 text-right">
                    <button type="button" className="btn btn-info mr-5" onClick={() => clearData()}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save mr-5" />
                      Save
                    </button>
                  </div>
                </div>

                <hr />
              </form>

              <div>
                <h4 className="text_blue">
                  Rate Plans
                </h4>
                <div style={{float: 'left'}}>
                <div className="chk-filter-container pull-left mt-5">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group col-md-12 mb-20">
                          <label className="checkbox-inline">
                            <input type="checkbox" name="all" value="1" checked={columnFilters.all} onChange={(e) => onColumnFilterChange(e)} />
                            All
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="hanger" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.hanger} />
                            Hanger
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="taper" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.taper} />
                            Taper
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="sprayer" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.sprayer} />
                              Sprayer
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="sander" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.sander} />
                            Sander
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{float: 'right'}}>
                <Search
                    onSearch={(value:any) => {
                    setSearch(value);
                    setCurrentPage(1);
                      }}
                />
                </div>
              </div>
             
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
                        Price
                      </th>
                      <th>
                        RP Job
                      </th>
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody id='rateplansListTableBody'>
                    {showData()}
                  </tbody>
                </table>

                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                  { !_.isEmpty(ratePlansData) && (
                    <>
                      <div className="col-md-6">
                        <ReactPaginate
                          pageCount={Math.ceil(meta.total / itemPerPage)}
                          pageRangeDisplayed={5} // 5
                          marginPagesDisplayed={2} // 2
                          onPageChange={(data) => getRatePlansPaginated(data.selected + 1)}
                          previousLabel={'<'}
                          nextLabel={'>'}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          containerClassName={'pagination'}
                          activeClassName={'active'}
                        />
                      </div>
                      <div className="col-md-6">
                        <select name="itemPerPage" value={itemPerPage} className="form-control input-sm" style={{ width: '80px', float: 'right' }} onChange={(e) => onPerPageChange(e)}>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="40">40</option>
                          <option value="50">50</option>
                          <option value="80">80</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalCustomStyles}
        contentLabel="RatePlan"
      >
        <button onClick={closeModal}>close</button>
        <br /><br /><div>Rate Plan</div>
        <form>
          <input
            type="text"
            name="ratePlanName"
            value={modalFormData.ratePlanName || ''}
            onChange={(e) => setModalFormData({ ...modalFormData, ratePlanName: e.target.value })}
            className={`form-control ${modalSubmitted && !modalFormData.ratePlanName ? 'ap-required' : ''}`}
          />
          <br /><div>Price per SQFT :</div>
          <input
            type="text"
            name="ratePlanPrice"
            value={modalFormData.ratePlanPrice || ''}
            onChange={(e) => setModalFormData({ ...modalFormData, ratePlanPrice: e.target.value })}
            className={`form-control ${modalSubmitted && !modalFormData.ratePlanPrice ? 'ap-required' : ''}`}
          />
          <input
            type="hidden"
            name="jobId"
            // value={(modalFormData.job_id != '') ? modalFormData.job_id : jobid}
            onChange={(e) => setModalFormData({ ...modalFormData, jobId: e.target.value })}
          />
          {/* <br /><br /> */}
          {/* <table className="modaltbl">
            <thead>
              <tr>
                <th>SI.No.</th>
                <th>Billing Item</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {modalFormData.items.length > 0 ? modalFormData.items.map((dt: any, i: any) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <input
                      className="form-control"
                      type="text"
                      value={dt.billingItemName}
                      name="billingItemName"
                      style={{ display: activeTxt ? 'block' : 'none' }}
                      onChange={(e) => { updateModalFormData(e, dt, 'billingItemName', e.target.value, i) }}
                    />
                    <select
                      className="form-control"
                      name="id"
                      value={dt.id}
                      style={{ display: !activeTxt ? 'block' : 'none' }}
                      onChange={(e) => updateModalFormData(e, dt, 'id', e.target.value, i)}
                    >
                      <option value={0}>select...</option>
                      <option value={'new'}>New</option>
                      {billingItemsData.length > 0 ? billingItemsData.map((billingItem: any, i: any) => (
                        <option key={i} value={billingItem.id}>{billingItem.billingItemName}</option>
                      )) : (
                          <></>
                        )}
                    </select>
                  </td>
                  <td><input className="form-control" type="text" value={dt.rate} name="rate" onChange={(e) => { updateModalFormData(e, dt, 'rate', e.target.value, i) }} /></td>
                </tr>
              )) : (
                  <tr>
                    <td colSpan={4}>Sorry! no data available...</td>
                  </tr>
                )}
            </tbody>
          </table> */}
          {/* <div className="pull-right top10">
            <button type="button" className="btn btn-danger right-10" onClick={(e) => deleteRow(e)}>
              Delete Last Row
                    </button>
            <button type="button" className="btn btn-info mr-5" onClick={(e) => addNewRow(e)}>
              Add New Row
          </button>
          </div> */}
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

RatePlanPage.propTypes = {
  // ratePlans: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: RatePlanReduxProps) => ({
  ratePlans: state.ratePlans,
  ratePlanJobs: state.ratePlanJobs,
  billingItems: state.billingItems,
  meta: state.ratePlans.meta,
});

// const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: {
    getRatePlanList: bindActionCreators(ratePlanActions.getRatePlanList, dispatch),
    getAllRatePlans: bindActionCreators(ratePlanActions.getAllRatePlans, dispatch),
    getRatePlan: bindActionCreators(ratePlanActions.getRatePlan, dispatch),
    addRatePlan: bindActionCreators(ratePlanActions.addRatePlan, dispatch),
    updateRatePlan: bindActionCreators(ratePlanActions.updateRatePlan, dispatch),
    deleteRatePlan: bindActionCreators(ratePlanActions.deleteRatePlan, dispatch),
    getRatePlanItems: bindActionCreators(ratePlanActions.getRatePlanItems, dispatch),
    updateRatePlanItems: bindActionCreators(ratePlanActions.updateRatePlanItems, dispatch),
    // getRatePlanItems: () => dispatch(ratePlanActions.getRatePlanItems),
    getAllRatePlanJobs: bindActionCreators(ratePlanJobActions.getAllRatePlanJobs, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatePlanPage);
