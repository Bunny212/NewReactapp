import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import _ from 'lodash';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment';
import Modal from 'react-modal';
import ReactModal from 'react-modal-resizable-draggable';
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as BuilderActions from '../../redux/actions/builderActions';
import * as HouseTypeActions from '../../redux/actions/houseTypeActions';
import * as UserActions from '../../redux/actions/userActions';
import * as CityActions from '../../redux/actions/cityActions';
import * as DeliveredByActions from '../../redux/actions/deliveredByActions';
import * as GarageStallActions from '../../redux/actions/garageStallActions';
import * as CeilingFinishActions from '../../redux/actions/ceilingFinishActions';
import * as GarageFinishActions from '../../redux/actions/garageFinishActions';
import * as VaultActions from '../../redux/actions/vaultActions';
import * as OptionActions from '../../redux/actions/optionActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import * as PurchaseOrderActions from '../../redux/actions/purchaseOrderActions';
import * as billingItemActions from '../../redux/actions/billingItemActions';
import { TableHeader, Pagination, Search } from "../DataTable";
import { configs } from '../../types/Constants';

import PropTypes from 'prop-types';
import {
  ScheduleReduxProps,
  ScheduleList,
  JobOrder,
  Target,
  JobOrderFilter,
} from '../../types/interfaces';
import VerModal from './VerModal';
import SubModal from './SubModal';
import InvoiceModal from './InvoiceModal';
import { filter } from 'lodash';
import ReactPaginate from "react-paginate";

Modal.setAppElement('#root');
const notesModalStyles = {
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

const GaragePage = ({
  jobOrders,
  meta,
  users,
  billingItems,
  searchData,
  houseLevelTypes,
  actions
}: ScheduleList) => {



  useEffect(() => {
    actions.getUsers();
    actions.getAllBillingItems();
    actions.getAllHouseLevelTypes();
    if (actions.getAllGarageJobOrders !== undefined) {
      // actions.getAllGarageJobOrders();
    }
    if (actions.getAllBillingItemGroups !== undefined) {
      actions.getAllBillingItemGroups();
    }
  }, []
  );

  const getCurrentGroupCounts = (groupId: any, jobOrder: any) => {
    // console.log(jobOrder.billingItemsGroupsCount);
    const group = jobOrder.billingItemsGroupsCount.filter((singleGroup: any) => singleGroup.groupId === groupId);
    // console.log(group);
    // if (group && group.length > 0) {
    //   return group[0].total;
    // }
    return group && group.length > 0 ? group[0].total : '';
  };

  const setFormDataState = () => {
    if (jobOrders.activeJobOrder.id !== undefined) {
      setFormData({ ...defaultState, ...jobOrders.activeJobOrder });
    }
  }

  useEffect(() => {
    setFormDataState();
  }, [
    jobOrders.activeJobOrder
  ]);



  const defaultState = {
    id: 0,
    builderId: 0,
    builderName: '',
    supervisorId: 0,
    name: '',
    houseTypeId: 0,
    address: '',
    cityId: 0,

    deliveryDate: '',
    deliveryTime: '',
    deliveredById: 0,
    deliveredByName: '',

    startDate: '',
    closeDate: '',
    paintStartDate: '',
    garageStallId: 0,
    garageStallName: '',
    walkthroughDate: '',
    ceilingFinishId: 0,
    ceilingFinishName: '',
    ceilingFinishFogged: '',
    garageFinishId: 0,
    garageFinishName: '',
    cityName: '',
    electric: 0,
    heat: 0,
    basement: 0,


    up58: 0,
    upHs: 0,
    up12: 0,
    up5412: 0,
    up5458: 0,
    main58: 0,
    mainHs: 0,
    main12: 0,
    main5412: 0,
    main5458: 0,
    l358: 0,
    l3Hs: 0,
    l312: 0,
    l35412: 0,
    l35458: 0,
    g58: 0,
    gHs: 0,
    g12: 0,
    g54: 0,
    g5412: 0,
    g5458: 0,
    house4x12: 0,
    house4x12o: 0,
    house54: 0,
    garage4x12: 0,
    garage4x12o: 0,
    garage54: 0,

    houseLevels: [],

    options: [],
    users: [],
    additionalInfo: '',
    grade: '',
    jobStatus: '',
    gigStatus: '',
    status: 1,
    pageTrack: 2,

    hangerStartDate: '',
    hangerEndDate: '', // one day after start
    scrapDate: '', // +1 day hanger end
    taperStartDate: '', // same as scrap date
    taperEndDate: '', // +2 days of scrap date
    sprayerDate: '', // +1 day of taper end date
    sanderDate: '', // +1 day of sprayer date
    paintDate: '', // +1 day of sander date
  };

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const [isVerModalOpen, setIsVerModalOpen] = React.useState(false);
  const [verJobOrderId, setVerJobOrderId] = React.useState(0);
  const [subUserTypeId, setSubUserTypeId] = React.useState({ userTypeId: 0 });
  const [isSubModalOpen, setIsSubModalOpen] = React.useState(false);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);

  // const [loader, showLoader, hideLoader] = useFullPageLoader();

  // Pagination Start
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);

  const getSchedulePaginated = (selectedPage: number) => {

    const limit = itemPerPage;
    setCurrentPage(selectedPage);
    const options = { page: selectedPage, limit };

    if (filterFormSubmitted){
      actions.searchJobOrders(filterFormData, options);
    }else{
      if (actions.getAllGarageJobOrders !== undefined) {
        actions.getAllGarageJobOrders(options);
      }
    }
  };


  const defaultPaginationOptions = {
    offset: 0,
    limit: itemPerPage,
    currentPage: 1,
  };
  const [paginationOptions, setPaginationOptions] = useState(defaultPaginationOptions);

  const onPerPageChange = (e: any) => {
    const pageValue = parseInt(e.target.value, 10);
    setCurrentPage(1);
    setItemPerPage(pageValue);
  }

  useEffect(() => {
    if (actions.getAllGarageJobOrders !== undefined) {
      actions.getAllGarageJobOrders({...paginationOptions});
    }
  }, [actions.getAllGarageJobOrders]);

  useEffect(() => {
    getSchedulePaginated(currentPage);
  }, [itemPerPage]);

  // Pagination End

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
  };

  const handleInvoiceModal = async (e: any, jobOrderId: any, userTypeId: any) => {
    setIsInvoiceModalOpen(true);
  };

  const handleSubModal = async (e: any, jobOrderId: any, userTypeId: any) => {

    if (actions.getHouseLevelStock !== undefined && jobOrderId) {
      await actions.getHouseLevelStock(jobOrderId);
    }

    setIsSubModalOpen(true);
    setVerJobOrderId(jobOrderId);

    let jobOrderUserType = '';
    if (userTypeId == 4) {
      jobOrderUserType = 'hanger';
    } else if (userTypeId == 5) {
      jobOrderUserType = 'sprayer';
    } else if (userTypeId == 6) {
      jobOrderUserType = 'sander';
    } else if (userTypeId == 7) {
      jobOrderUserType = 'taper';
    }

    const jobOrderUserId = getJobUserType(jobOrderId, jobOrderUserType);
    setSubUserTypeId(jobOrderUserId);
  };

  const closeSubModal = () => {
    setIsSubModalOpen(false);
  };

  const handleVerModal = async (e: any, jobOrderId: any) => {
    if (actions.getHouseLevelStock !== undefined && jobOrderId) {
      await actions.getHouseLevelStock(jobOrderId);
    }

    setIsVerModalOpen(true);
    setVerJobOrderId(jobOrderId);
  };

  const closeVerModal = () => {
    setIsVerModalOpen(false);
  };

  const onSaveSearch =() => {
    console.log('form data', filterFormData);
    actions.saveFilterSearch(filterFormData);
    setTimeout(function(){ window.location.reload(); }, 1000);

  }

  const onDateChange = (date: any, name: string) => {
    // setFormData({ ...formData, [name]: moment(date).format('YYYY-MM-DD') });
  }


  const calculateDate = (date: any, dayInterval: number) => {
    const currrentDate = moment(date).format('YYYY-MM-DD');

    if (!date) {
      return null;
    }
    dayInterval = dayInterval ? dayInterval : 0;
    let targetDate = moment(date).add('days', dayInterval).format('YYYY-MM-DD');
    let newDate = '';
    // calculate start date
    if (moment(targetDate).day() === 6) {
      newDate = moment(targetDate).add('days', 2).format('YYYY-MM-DD');
    } else if (moment(targetDate).day() === 0) {
      newDate = moment(targetDate).add('days', 1).format('YYYY-MM-DD');
    } else {
      newDate = moment(targetDate).format('YYYY-MM-DD');
    }
    return newDate;
  }

  const highlightBackgroundClass = (date: any, dayInterval: number) => {
    const currentDate = moment().add('days', 1);
    // console.log(date);

    if (!date) {
      return '';
    }
    // return moment(date).format('YYYY-MM-DD');
    date = moment(date).toDate();
    dayInterval = dayInterval ? dayInterval : 0;
    let targetDate = moment(date).add('days', dayInterval);

    let highlightClass = '';
    if (currentDate.isSame(targetDate, 'd')) {
      highlightClass = 'light-green';
    }
    return highlightClass;
  }

  const getfilteredUsers = (usersData: any, userTypeId: number) => {
    const newData = usersData.filter((user: any) => {
      // console.log(user.userTypes);
      return user.userTypes.some((userType: any) => parseInt(userType.id, 10) === userTypeId)
      // return user.userTypes.some((userType: any) => userType.id === userTypeId)

    });
    // console.log(newData);
    return newData;
  }

  const onSubSelectChange = (e: any, jobOrderId: any, jobOrderUserType: string) => {
    // if (!getJobUserType(jobOrderId, jobOrderUserType)) {
      const jobUserTypeObj = {
        id: e.target.value,
        jobOrderId,
        jobOrderUserType,
        name: '',
        firstname: ''
      };
      if (actions.updateJobOrderUser !== undefined) {
        actions.updateJobOrderUser(jobUserTypeObj);
      }
      // console.log('yes setting user id now--------------------', jobUserTypeObj);
    // }
  }

  const getJobUserType = (jobOrderId: any, jobOrderUserType: string) => {
    const currentJobOrder = (filterFormSubmitted ? jobOrdersNew : jobOrdersData).filter((jobOrder: any) => jobOrder.id == jobOrderId)[0] || {};
    const { users } = currentJobOrder;

    // console.log('++++++++++++++++++++++++++++++++--------')
    // console.log(currentJobOrder);
    // console.log(users);
    if (users && users.length) {
      const jobUser = users.filter((jobUser: any) => jobUser.jobOrderUserType === jobOrderUserType);
      return jobUser.length ? jobUser[0].id : 0;
    }
    return 0;
    // currentJobOrder
    //   .filter((singleJob: any) => (
    //     singleJob.users.filter((jobUser: any) => jobUser.jobOrderUserType === jobOrderUserType)
    //   ));
    // console.log(currentJobOrder);
    // return 1;
  }


  const notesDefaultState = {
    id: 0,
    additionalInfo: '',
  };

  const listType: any[] = [];
  const defaultJobAction = {
    actionType: '',
    submitted: false,
    jobIds: listType
  };

  const [notesFormData, setNotesFormData] = useState(notesDefaultState);
  const [isNotesModalOpen, setIsNotesModalOpen] = React.useState(false);
  const [jobAction, setJobAction] = React.useState(defaultJobAction);
  const [disabledOpenJobAction, setDisabledOpenJobAction] = React.useState(false);
  const [disabledCloseJobAction, setDisabledCloseJobAction] = React.useState(false);

  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
    setNotesFormData(notesDefaultState);
  };

  const handleNotesModal = (e: any, notes: string) => {
    setNotesFormData({ ...notesFormData, additionalInfo: notes })
    setIsNotesModalOpen(true);
  };


  const getCurrentJobClasses = (jobOrder: any) => {
    let classes = '';
    if (jobOrder.ceilingFinishFogged) {
      classes += 'bg-green';
    } else if (jobOrder.jobStatus === 'hold') {
      classes += 'bg-yellow';
    }
    return classes;
  };

  const isActionCheckboxDisabled = (jobOrderId: any) => {
    if (!jobAction.jobIds.includes(jobOrderId) && jobAction.jobIds.length >= 5) {
      return true;
    }
    return false;
  };

  const isCurrentActionChecked = (jobOrderId: any) => {
    if (jobAction.jobIds.includes(jobOrderId)) {
      return true;
    }
    return false;
  }

  const onActionCheckboxChange = (e: Target, jobOrderId: any) => {

    if (jobAction.jobIds.length > 5) {
      return;
    }
    const jobIdsList = _.uniq([...jobAction.jobIds, jobOrderId]);
    if (!e.target.checked) {
      _.pull(jobIdsList, jobOrderId);
    }
    console.log(jobAction);
    setJobAction({ ...jobAction, jobIds: jobIdsList });
  };

  useEffect(() => {
    // const closedJobs = jobOrdersData.filter((singleJobOrder: any) => jobAction.jobIds.includes(singleJobOrder.id) && singleJobOrder.jobStatus === 'closed');
    // console.log(closedJobs);
    // if (closedJobs.length === jobAction.jobIds.length) {
    //   setDisabledOpenJobAction(false);
    //   console.log('yes', closedJobs);
    // } else {
    //   setDisabledOpenJobAction(true);
    // }
    if (!filterFormSubmitted) {
      const holdJobs = jobOrdersData.filter((singleJobOrder: any) => jobAction.jobIds.includes(singleJobOrder.id) && singleJobOrder.jobStatus === 'hold');
      console.log('hold jobs', holdJobs);
      if (holdJobs.length > 0) {
        console.log('so now?');
        setDisabledCloseJobAction(true);
      } else {
        setDisabledCloseJobAction(false);
      }
    }

  }, [jobAction]);

  const isCurrentActionInProgress = () => {
    return !!jobAction.submitted;
  }

  const handleActionBtnSubmit = async (e: any) => {
    e.preventDefault();

    if (jobAction.jobIds.length < 1) {
      return;
    }

    setJobAction({ ...jobAction, submitted: true });

    const actionValue = e.target.value;
    for (const currentJobId of jobAction.jobIds) {
      const currentJob = _.find(jobOrdersData, (singleJobOrder) => singleJobOrder.id == currentJobId);
      // console.log(currentJob);

      if (currentJob && actionValue) {
        const currentUpdatedJob = { ...currentJob, gigStatus: actionValue, pageTrack: 2};
        console.log(currentUpdatedJob);
        await actions.updateJobOrder(currentUpdatedJob);
      }
    }
    setTimeout(() => {

      if (filterFormSubmitted) {
        actions.searchJobOrders(filterFormData);
      } else if (actions.getAllGarageJobOrders !== undefined) {
        actions.getAllGarageJobOrders();
      }
      setJobAction({ ...jobAction, jobIds: [], submitted: false });
      setFilterFormSubmitted(false);

    }, 2000);
  };


  const DateCustomInput = ({onChange, placeholder, value, onClick, customClassName, groupClassName}: any) => (
    <>
      <div className={groupClassName ? `input-group ${groupClassName}` : 'input-group input-group-sm'}>
        <input
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            // onClick={onClick}
            className={customClassName}
        />
        <span className="input-group-addon btn-cs-hvr"  onClick={onClick}>
          <i className="far fa-calendar-alt"></i>
        </span>
      </div>
    </>
  );

  const { jobOrders: jobOrdersData } = jobOrders;
  // @ts-ignore
  const { jobOrders: { data: jobOrdersNew} } = jobOrders;
  const { users: usersData } = users;
  const { billingItemGroups: billingItemGroupsData } = billingItems;
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;


  const getGarageGroupBillingItems = () => {
    const garageGroupsList = ["gar 12'", "gar 54\"", "gar overs"];
    const garageBillingItemGroups = billingItemGroupsData && billingItemGroupsData.length > 0 ? billingItemGroupsData.filter((singleItem: any) => garageGroupsList.includes(singleItem.groupName.toLowerCase())) : [];
    return garageBillingItemGroups;
  };


  const defaultColumnFilters: { [key: string]: boolean } = {
    all: true,
    hanger: false,
    taper: false,
    sprayer: false,
    sander: false,
  };
  const [searchFilters, setSearchFilters] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState(defaultColumnFilters);

  const toggleSearchFilter = (e: any) => {
    e.preventDefault();
    const val = searchFilters === true ? false : true;
    setSearchFilters(val);
  };

  // Filter jobs
  const defaultFilterState: JobOrderFilter = {
    address: '',
    hangerId: 0,
    taperId: 0,
    sprayerId: 0,
    sanderId: 0,
    sGarageFilter: 1,
    dateFrom: '',
    dateTo: '',
    garage: true,
    jobStatus: '',
    gigStatus: '',
    submitted: false,
    pageTrack: 2,
  };
  const defaultTypingTimeout: any = null;
  const [filterFormData, setFilterFormData] = useState(defaultFilterState);
  const [typingTimeout, setTypingTimeout] = useState(defaultTypingTimeout);
  const [filterFormSubmitted, setFilterFormSubmitted] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = React.useState(false);

  const onFilterFormInputChange = (e: Target) => {
    clearTimeout(typingTimeout);
    setFilterFormSubmitted(true);
    const value = e.target.value;
    setFilterFormData({ ...filterFormData, [e.target.name]: e.target.value });
  };

  const onFilterFormDateChange = (date: any, name: string) => {
    setFilterFormSubmitted(true);
    setFilterFormData({ ...filterFormData, [name]: moment(date).format('YYYY-MM-DD') });
  };

  const onFilterFormChange = (e: Target) => {
    setFilterFormSubmitted(true);
    setFilterFormData({ ...filterFormData, [e.target.name]: e.target.value });
  };

  const handleGradeChange = async (e: any, currentJobOrder: any) => {
    const value = e.target.value;

    if (currentJobOrder && value) {
      const currentUpdatedJob = { ...currentJobOrder, grade: value };
      await actions.updateJobOrder(currentUpdatedJob);
    }
  };

  const handleGradeModalColumn = (e: any) => {
    setIsGradeModalOpen(true);
  };

  const closeModal = () => {
    setIsGradeModalOpen(false);
  };

  useEffect(() => {
    if (filterFormSubmitted){
      setJobAction({ ...jobAction, jobIds: [] });
      if (filterFormData.address !== '') {
        const delayDebounce = setTimeout(() => {
          actions.searchJobOrders(filterFormData, {...paginationOptions});
          setTypingTimeout(false);
        }, 1000);
        setTypingTimeout(delayDebounce);
      } else {
        console.log('Searching form data for ', filterFormData);
        actions.searchJobOrders(filterFormData, {...paginationOptions});
      }
    }
  }, [filterFormData]);

  const handleSelectedRow = (row: any) => {
    const schTblBody = document.getElementById('scheduleTableBody');
    schTblBody!.querySelectorAll('tr').forEach(function (elem) {
      elem.classList.remove('slctdRow');
    });
    const slctdRowID = 'tblRow'+row!.id;
    const slctdRow = document.getElementById(slctdRowID);
    slctdRow!.classList.add('slctdRow');
  };

  const onSearchFilterSelectionChange = (id: number, e: any) => {
    let selectedSearch = searchData.searchData.find((data:any) => data.id == id);
    if (!selectedSearch) return;
    filterFormData.address = selectedSearch.s_address;
    filterFormData.hangerId = selectedSearch.s_hanger_id;
    filterFormData.taperId = selectedSearch.s_taper_id;
    filterFormData.sprayerId = selectedSearch.s_sprayer_id;
    filterFormData.sanderId = selectedSearch.s_sander_id;
    filterFormData.sGarageFilter = selectedSearch.s_garage_filter;
    filterFormData.dateFrom = selectedSearch.s_closed_btw_date_from;
    filterFormData.dateTo = selectedSearch.s_closed_btw_date_to;

    // let newData = {
    //   address: selectedSearch.s_address,
    //   hangerId: selectedSearch.s_hanger_id,
    //   taperId: selectedSearch.s_taper_id,
    //   sprayerId: selectedSearch.s_sprayer_id,
    //   sanderId: selectedSearch.s_sander_id,
    // };
    // console.log('data final', newData);
    setFilterFormData(filterFormData => ({
      ...filterFormData,
    }));
    setFilterFormSubmitted(true);
    //setFilterFormData({ ...filterFormData, newData});
    setFilterFormData({ ...filterFormData, 'dateFrom': selectedSearch.s_closed_btw_date_from });
    setFilterFormData({ ...filterFormData, 'dateTo': selectedSearch.s_closed_btw_date_to });
    toggleSearchFilter(e);
    console.log('selected id', selectedSearch);
  }

  // @ts-ignore
  return (
    <>
      <div className="clear pad-40" />
      <div className="">
        <div className="col-md-12">
          <div className="card garage-container ap-container">
            <div className="card-header">
              <div className="pull-left">
                <h4 className="text_blue">
                  Garage Status Sheet
                </h4>
                <span>{moment().format('MM/DD/YYYY')}</span>
              </div>

              <div className="col-md-6">
                <select className="form-control input-sm saved-search-dropdown" name="filterSelection"
                  onChange={(e) => onSearchFilterSelectionChange(parseInt(e.target.value), e)}
                >
                  <option value={''}>Select a Criteria to filter data</option>
                  {  searchData.searchData?.length > 0 ? searchData.searchData.map((data) => (
                    <option key={data.id} value={data.id}>
                      { data.s_address && (data.s_address + ' - ')}
                      { data.s_hanger_name && (data.s_hanger_name + '-')}
                      { data.s_taper_name && (data.s_taper_name + '-')}
                      { data.s_sprayer_name && (data.s_sprayer_name + '-')}
                      { data.s_sander_name && (data.s_sander_name + '-')}
                      { data.s_closed_btw_date_from && (data.s_closed_btw_date_from + '-')}
                      { data.s_closed_btw_date_to && (data.s_closed_btw_date_to + '-')}
                      </option>
                  )) : (<></>)}
                </select>
                </div>

              <div className="pull-right mt-10">
                <button
                  type="button"
                  className="btn btn-default btn-sm"
                  onClick={(e) => toggleSearchFilter(e)}
                >
                  Search Filters
                </button>
              </div>

              <div className="clear pad-10"></div>
              <div className={searchFilters ? 'filter-container' : 'filter-container hidden'}>
                <form className="form-horizontal">
                  <div className="rows">
                    <div className="form-group col-md-5ths col-xs-6 mb-20">
                      <label className="control-label ">
                        Address
                      </label>
                      <div className="mr-5">
                        <input
                          type="text"
                          name="address"
                          value={filterFormData.address || ''}
                          className={`form-control input-sm`}
                          onChange={(e) => onFilterFormInputChange(e)}
                        />
                      </div>
                    </div>

                    {(columnFilters.all || columnFilters.hanger) && (
                      <div className="form-group col-md-5ths col-xs-6 mb-20">
                        <label className="control-label">
                          Hanger
                        </label>
                        <div className="mr-5">
                          <select
                            name="hangerId"
                            onChange={(e) => onFilterFormChange(e)}
                            className="form-control input-sm"
                          >
                            <option value={''}>Hanger</option>
                            {usersData.length > 0 ? usersData.map((singleUser) => (
                              <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {(columnFilters.all || columnFilters.taper) && (
                      <div className="form-group col-md-5ths col-xs-6 mb-20">
                        <label className="control-label">
                          Taper
                        </label>
                        <div className="mr-5">
                          <select
                            name="taperId"
                            onChange={(e) => onFilterFormChange(e)}
                            className="form-control input-sm"
                          >
                            <option value={''}>Taper</option>
                            {usersData.length > 0 ? usersData.map((singleUser) => (
                              <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* {(columnFilters.all || columnFilters.sprayer) && (
                      <div className="form-group col-md-5ths col-xs-6 mb-20">
                        <label className="control-label">
                          Sprayer
                        </label>
                        <div className="mr-5">
                          <select
                            className="form-control"
                            name="sprayerId"
                            onChange={(e) => onFilterFormChange(e)}
                          >
                            <option value={''}>Sprayer</option>
                            {usersData.length > 0 ? usersData.map((singleUser) => (
                              <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </div>
                      </div>
                    )} */}

                    {/* {(columnFilters.all || columnFilters.sprayer) && (
                      <div className="form-group col-md-5ths col-xs-6 mb-20">
                        <label className="control-label">
                          Sander
                        </label>
                        <div className="mr-5">
                          <select
                            className="form-control"
                            name="sanderId"
                            onChange={(e) =>onFilterFormChange(e)}
                          >
                            <option value={''}></option>
                            {usersData.length > 0 ? usersData.map((singleUser) => (
                              <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </div>
                      </div>
                    )} */}

                    <div className="form-group col-md-5ths col-xs-6 mb-20">
                      <div className="">
                        <label className="control-label">
                          Closed Between
                        </label>
                        <div className="mr-5">
                          <DatePicker
                            name="dateFrom"
                            selected={!!filterFormData.dateFrom ? moment(filterFormData.dateFrom).toDate() : null}
                            onChange={(date) => onFilterFormDateChange(date, 'dateFrom')}
                            customInput={<DateCustomInput customClassName={`form-control `} />}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-md-5ths col-xs-6 mb-20">
                      <div className="">
                        <label className="control-label">
                          And
                        </label>
                        <div className="mr-5">
                          <DatePicker
                            name="end"
                            selected={!!filterFormData.dateTo ? moment(filterFormData.dateTo).toDate() : null}
                            onChange={(date) => onFilterFormDateChange(date, 'dateTo')}
                            customInput={<DateCustomInput customClassName={`form-control `} />}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-md-5ths col-xs-6 mb-20 pull-left">
                      <label className="control-label"></label>
                      <div className="">
                        <div className="col-md-12">
                          <label className="control-label">
                            <input
                              type="radio"
                              name="gigStatus"
                              value=""
                              checked={filterFormData.gigStatus !== 'closed' ? true : false}
                              onChange={(e) => onFilterFormChange(e)}
                              className="mr-5i"
                            />
                            Open
                          </label>
                          <label className="control-label ml-10">
                            <input
                              type="radio"
                              name="gigStatus"
                              value="closed"
                              checked={filterFormData.gigStatus === 'closed' ? true : false}
                              onChange={(e) => onFilterFormChange(e)}
                              className="mr-5i"
                            />
                            Closed
                          </label>

                          <input type="hidden" name="sGarageFilter" value="" onChange={(e) => onFilterFormInputChange(e)} />
                            <button type="button"
                            className="btn btn-default btn-sm ml-30 save-search-btn"
                            onClick={(e) => onSaveSearch()}
                           > Save Search</button>

                        </div>
                      </div>
                    </div>

                  </div>
                </form>
              </div>


              <div className="row">
                <div className="form-group col-md-12 mb-20">
                  <div className="pull-left">
                    <button
                      name="closedAction"
                      value="closed"
                      disabled={isCurrentActionInProgress() || disabledCloseJobAction}
                      onClick={(e) => handleActionBtnSubmit(e)}
                      className="btn btn-default btn-sm mr-10"
                    >
                      Done
                    </button>
                    <button
                      name="holdAction"
                      value="hold"
                      className="btn btn-default btn-sm mr-10"
                      disabled={isCurrentActionInProgress()}
                      onClick={(e) => handleActionBtnSubmit(e)}
                    >
                      Hold
                    </button>
                    <button
                      name="activeAction"
                      value="active"
                      disabled={isCurrentActionInProgress()}
                      onClick={(e) => handleActionBtnSubmit(e)}
                      className="btn btn-default btn-sm mr-10"
                    >
                      UnHold
                    </button>
                    <button
                        name="openAction"
                        value="active"
                        disabled={isCurrentActionInProgress() || disabledOpenJobAction}
                        onClick={(e) => handleActionBtnSubmit(e)}
                        className={filterFormSubmitted && filterFormData.jobStatus === 'closed' ? 'btn btn-default btn-sm mr-10' : 'btn btn-default btn-sm mr-10 hidden'}
                      >
                        Open
                    </button>
                  </div>
                </div>
              </div>

              <div className="clear pad-5" />

              <div className="table-responsive">
                <table className="schedule-table table ap-table table-schedule table-bordered table-striped">
                  <thead>
                    <tr>
                      <th colSpan={2}>Sr.#</th>
                      <th className="">
                        Action
                      </th>
                      <th>
                        Ver
                      </th>
                      {getGarageGroupBillingItems().length ? getGarageGroupBillingItems().map((billingItemGroup, i) => (
                        <th key={i}>
                          {billingItemGroup.groupName}
                        </th>
                      )) : (
                          <></>
                        )}
                      <th className="w-150">
                        Address
                      </th>
                      <th className="w-100">
                        Stocked
                      </th>
                      <th className="w-150">
                        Hanger
                      </th>
                      <th className="w-120">
                        Hanger Date
                      </th>
                      <th className="w-150">
                        Taper
                      </th>
                      <th className="w-120">
                        Taper Date
                      </th>
                      <th className="w-60" onClick={(e) => handleGradeModalColumn(e)}>
                        Grade
                      </th>
                      <th className="w-100">
                        City
                      </th>
                      <th className="">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody id='scheduleTableBody'>
                    {(filterFormSubmitted ? jobOrdersNew?.length > 0 : jobOrdersData.length > 0) ? (filterFormSubmitted ? jobOrdersNew : jobOrdersData).map((jobOrder: any, i: any) => (
                      <tr id={`tblRow${jobOrder.id}`} key={jobOrder.id} onClick={()=>handleSelectedRow(jobOrder)}>
                        <td className={jobOrder.jobStatus === 'hold' ? 'bg-yellow' : ''}>
                          {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                        </td>
                        <td className={jobOrder.jobStatus === 'hold' ? 'bg-yellow' : ''}>
                          <input
                            type="checkbox"
                            name="checkboxAction"
                            value="1"
                            checked={isCurrentActionChecked(jobOrder.id)}
                            onChange={(e) => onActionCheckboxChange(e, jobOrder.id)}
                            disabled={isActionCheckboxDisabled(jobOrder.id)}
                          />
                        </td>
                        <td>
                          <a href={`/job-orders/${jobOrder.id}`} className="btn btn-default btn-sm btn-custom mr-10 ml-10">
                            Edit
                          </a>
                          {/* <button
                            type="button"
                            className="btn btn-default btn-sm btn-custom mr-10"
                            onClick={(e) => handleVerModal(e, jobOrder.id)}
                          >
                            Sheet Counts
                          </button> */}
                        </td>
                        <td>
                          {jobOrder.isVerified ? (<i className="fa fa-check fa-sm" />) : (<></>)}
                        </td>
                        {getGarageGroupBillingItems().length ? getGarageGroupBillingItems().map((billingItemGroup, i) => (
                          <td key={i}>
                            {getCurrentGroupCounts(billingItemGroup.id, jobOrder)}
                          </td>
                        )) : (
                            <></>
                          )}
                        <td className={getCurrentJobClasses(jobOrder)}>
                          <strong>{jobOrder.address}, {jobOrder.cityName}</strong>
                        </td>
                        <td>
                          {!!jobOrder.deliveryDate ? moment(jobOrder.deliveryDate).format('MM-DD-YYYY') : ''}
                        </td>
                        <td>
                          <select
                            name="hangerUserId"
                            value={getJobUserType(jobOrder.id, 'hanger')}
                            onChange={(e) => onSubSelectChange(e, jobOrder.id, 'hanger')}
                            className="form-control input-sm"
                          >
                            <option value=""></option>
                            {getfilteredUsers(usersData, 4).length > 0 ? getfilteredUsers(usersData, 4).map((singleUser: any) => (
                              <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </td>
                        <td>
                          {/* <div className="input-group"> */}
                            <DatePicker
                              name="start1"
                              selected={!!jobOrder.hangerStartDate ? moment(calculateDate(jobOrder.hangerStartDate, 0)).toDate() : null}
                              onChange={(date) => onDateChange(date, 'deliveryDate')}
                              customInput={<DateCustomInput customClassName={`form-control h-30 ${highlightBackgroundClass(jobOrder.hangerStartDate, 0)}`} groupClassName="addon input-group-sm" />}
                            />
                            {/* <span className="input-group-addon">
                              <i className="far fa-calendar-alt"></i>
                            </span>
                          </div> */}
                        </td>
                        <td>
                          <select
                            name="taperUserId"
                            value={getJobUserType(jobOrder.id, 'taper')}
                            onChange={(e) => onSubSelectChange(e, jobOrder.id, 'taper')}
                            className="form-control input-sm"
                          >
                            <option value=""></option>
                            {getfilteredUsers(usersData, 7).length > 0 ? getfilteredUsers(usersData, 7).map((singleUser: any) => (
                              <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </td>
                        <td>
                          {/* <div className="input-group"> */}
                            <DatePicker
                              name="start2"
                              selected={!!jobOrder.taperStartDate ? moment(calculateDate(jobOrder.taperStartDate, 0)).toDate() : null}
                              onChange={(date) => onDateChange(date, 'deliveryDate')}
                              customInput={<DateCustomInput customClassName={`form-control h-30 ${highlightBackgroundClass(jobOrder.taperStartDate, 0)}`} groupClassName="addon input-group-sm" />}
                            />
                            {/* <span className="input-group-addon">
                              <i className="far fa-calendar-alt"></i>
                            </span>
                          </div> */}
                        </td>
                        <td>
                          <select
                            name="grade"
                            value={jobOrder.grade || ''}
                            className="form-control input-sm"
                            onChange={(e) => handleGradeChange(e, jobOrder)}
                          >
                            <option value=""></option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                          </select>
                        </td>
                        <td>
                          {jobOrder.cityName}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-default btn-sm btn-custom"
                            onClick={(e) => handleNotesModal(e, jobOrder.additionalInfo)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                          <td colSpan={29} className="text-center">
                            No record found.
                        </td>
                        </tr>
                      )}
                  </tbody>
                </table>


                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                  { !_.isEmpty(jobOrdersData) && !filterFormSubmitted && (
                    <>
                      <div className="col-md-4">
                        <ReactPaginate
                          pageCount={Math.ceil(meta.total / itemPerPage)}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={(data) => getSchedulePaginated(data.selected + 1)}
                          previousLabel={'<'}
                          nextLabel={'>'}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          containerClassName={'pagination'}
                          activeClassName={'active'}
                        />
                      </div>
                      <div className="col-md-4" style={{textAlign: 'center'}}>
                        <span style={{fontSize: 'larger', fontWeight: 'bold'}}>{`Showing ${meta?.from} - ${meta?.to} records out of ${meta?.total}`}</span>
                      </div>
                      <div className="col-md-4">
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

                  { !_.isEmpty(jobOrdersNew) && filterFormSubmitted && (
                    <>
                      <div className="col-md-6">
                        <ReactPaginate
                          // @ts-ignore
                          pageCount={Math.ceil(jobOrdersData?.meta?.total / itemPerPage)}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={(data) => getSchedulePaginated(data.selected + 1)}
                          previousLabel={'<'}
                          nextLabel={'>'}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          containerClassName={'pagination'}
                          activeClassName={'active'}
                        />
                      </div>
                      <div className="col-md-3">
                        {/* @ts-ignore */}
                        <span style={{fontSize: 'larger', fontWeight: 'bold'}}>{`Showing ${jobOrdersData?.meta?.from} - ${jobOrdersData?.meta?.to} records out of ${jobOrdersData?.meta?.total}`}</span>
                      </div>
                      <div className="col-md-3">
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

                {jobOrdersData.length < 1}

                <VerModal
                  isVerModalOpen={isVerModalOpen}
                  verJobOrderId={verJobOrderId}
                  filterFormSubmitted={filterFormSubmitted}
                  closeVerModal={closeVerModal}
                />
                <SubModal
                  subUserTypeId={subUserTypeId}
                  isSubModalOpen={isSubModalOpen}
                  verJobOrderId={verJobOrderId}
                  filterFormSubmitted={filterFormSubmitted}
                  closeSubModal={closeSubModal}
                  handleInvoiceModal={handleInvoiceModal}
                />
                <InvoiceModal
                  subUserTypeId={subUserTypeId}
                  isInvoiceModalOpen={isInvoiceModalOpen}
                  filterFormSubmitted={filterFormSubmitted}
                  verJobOrderId={verJobOrderId}
                  closeInvoiceModal={closeInvoiceModal}
                />

                <ReactModal
                  isOpen={isNotesModalOpen}
                  onRequestClose={closeNotesModal}
                  style={notesModalStyles}
                  contentLabel="Email Purchase Order"
                  initHeight={400}
                  initWidth={500}
                >

                  <div className="clear pad-15"></div>
                  <h3>Notes</h3>
                  <form className="form-horizontal">
                    <div className="row">
                      <div className="col-md-12">
                        <textarea
                          rows={5}
                          name="additionalInfo"
                          value={notesFormData.additionalInfo || ''}
                          className={`form-control`}
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </ReactModal>

                <ReactModal
                  isOpen={isGradeModalOpen}
                  onRequestClose={closeModal}
                  style={notesModalStyles}
                  contentLabel="Email JIO"
                  initHeight={250}
                  initWidth={500}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Grade</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>A</th>
                        <th>Excellent Condition</th>
                      </tr>
                      <tr>
                        <th>B</th>
                        <th>Good Condition</th>
                      </tr>
                      <tr>
                        <th>C</th>
                        <th>Fair Condition</th>
                      </tr>
                      <tr>
                        <th>D</th>
                        <th>Give to Nick or Scaffolding Required</th>
                      </tr>
                      <tr>
                        <th>F</th>
                        <th>Need to Contact Builder</th>
                      </tr>
                    </tbody>
                  </table>
                </ReactModal>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

GaragePage.propTypes = {
  // jobOrders: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: ScheduleReduxProps) => ({
  jobOrders: state.jobOrders,
  users: state.users,
  billingItems: state.billingItems,
  searchData: state.searchData,
  houseLevelTypes: state.houseLevelTypes,
  purchaseOrders: state.purchaseOrders,
  meta: state.jobOrders.meta,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getAllJobOrders: bindActionCreators(JobOrderActions.getAllJobOrders, dispatch),
    searchJobOrders: bindActionCreators(JobOrderActions.searchJobOrders, dispatch),
    getJobOrder: bindActionCreators(JobOrderActions.getJobOrder, dispatch),
    addJobOrder: bindActionCreators(JobOrderActions.addJobOrder, dispatch),
    updateJobOrder: bindActionCreators(JobOrderActions.updateJobOrder, dispatch),
    deleteJobOrder: bindActionCreators(JobOrderActions.deleteJobOrder, dispatch),
    saveFilterSearch: bindActionCreators(JobOrderActions.saveFilterSearch, dispatch),
    getFilterSearch: bindActionCreators(JobOrderActions.getFilterSearch, dispatch),
    getHouseLevelStock: bindActionCreators(JobOrderActions.getHouseLevelStock, dispatch),
    getUsers: bindActionCreators(UserActions.getUsers, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
    getAllHouseLevelTypes: bindActionCreators(HouseLevelTypeActions.getAllHouseLevelTypes, dispatch),
    updateJobOrderUser: bindActionCreators(JobOrderActions.updateJobOrderUser, dispatch),
    addPurchaseOrder: bindActionCreators(PurchaseOrderActions.addPurchaseOrder, dispatch),
    getAllGarageJobOrders: bindActionCreators(JobOrderActions.getAllGarageJobOrders, dispatch),
    getAllBillingItemGroups: bindActionCreators(billingItemActions.getAllBillingItemGroups, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GaragePage);
