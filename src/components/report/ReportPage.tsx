import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import _, { lowerCase } from 'lodash';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import Select from 'react-select';
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as UserActions from '../../redux/actions/userActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import * as PurchaseOrderActions from '../../redux/actions/purchaseOrderActions';
import * as billingItemActions from '../../redux/actions/billingItemActions';
import * as userTypeActions from '../../redux/actions/userTypeActions';
import ReportTable from './ReportTable';
import PrintReport from '../common/PrintReport';


// import PropTypes from 'prop-types';
import {
  ReportReduxProps,
  ReportList,
  JobOrder,
  Target,
  ReportFilter,
} from '../../types/interfaces';


const ReportPage = ({
  jobOrders,
  users,
  billingItems,
  houseLevelTypes,
  purchaseOrders,
  userTypes,
  actions
}: ReportList) => {

  useEffect(() => {
    // Check for register error
    const classList = document.body.classList;
    if (!classList.length && !localStorage.getItem("token")) {
      classList.add('login_bg');
    } else {
      classList.remove('login_bg');
    }
  }, []);


  useEffect(() => {
    // if (actions.getAllJobOrders !== undefined) {
      // actions.getAllJobOrders();
    // }
    actions.getUsers();
    actions.getAllBillingItems();
    actions.getAllHouseLevelTypes();
    actions.getAllUserTypes();
    if (actions.getAllBillingItemGroups !== undefined) {
      actions.getAllBillingItemGroups();
    }
  }, []);

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
    billingItemsGroupsCount: [],
    jobStatus: '',
    gigStatus: '',

    status: 1,

    hangerStartDate: '',
    hangerEndDate: '', // one day after start
    scrapDate: '', // +1 day hanger end
    taperStartDate: '', // same as scrap date
    taperEndDate: '', // +2 days of scrap date
    sprayerDate: '', // +1 day of taper end date
    sanderDate: '', // +1 day of sprayer date
    paintDate: '', // +1 day of sander date
  };

  const defaultColumnFilters: { [key: string]: boolean } = {
    all: true,
    hanger: false,
    taper: false,
    sprayer: false,
    sander: false,
  };

  const listType: any[] = [];
  const defaultJobAction = {
    actionType: '',
    submitted: false,
    jobIds: listType
  };

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const [isVerModalOpen, setIsVerModalOpen] = React.useState(false);
  const [verJobOrderId, setVerJobOrderId] = React.useState(0);
  const [subUserTypeId, setSubUserTypeId] = React.useState(0);
  const [userTypeId, setUserTypeId] = React.useState(0);
  const [subUserType, setSubUserType] = React.useState('');
  const [isSubModalOpen, setIsSubModalOpen] = React.useState(false);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);
  const [searchFilters, setSearchFilters] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState(defaultColumnFilters);
  const [jobAction, setJobAction] = React.useState(defaultJobAction);
  const [disabledOpenJobAction, setDisabledOpenJobAction] = React.useState(false);
  const [disabledCloseJobAction, setDisabledCloseJobAction] = React.useState(false);

  const toggleSearchFilter = (e: any) => {
    e.preventDefault();
    const val = searchFilters === true ? false : true;
    setSearchFilters(val);
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
  };

  const handleInvoiceModal = async () => {
    const purchaseOrderObj = {
      userId: subUserTypeId,
      userTypeId,
      jobOrderId: verJobOrderId,
      userType: subUserType,
    };

    if (actions.addPurchaseOrder !== undefined && verJobOrderId && subUserTypeId) {
      await actions.addPurchaseOrder(purchaseOrderObj);
    }
    setIsInvoiceModalOpen(true);
  };

  const handleSubModal = async (e: any, jobOrderId: any, userTypeId: any) => {

    if (actions.getHouseLevelStock !== undefined && jobOrderId) {
      await actions.getHouseLevelStock(jobOrderId);
    }
    setIsSubModalOpen(true);
    setVerJobOrderId(jobOrderId);

    let jobOrderUserType = '';
    if (userTypeId === 4) {
      jobOrderUserType = 'hanger';
    } else if (userTypeId === 5) {
      jobOrderUserType = 'sprayer';
    } else if (userTypeId === 6) {
      jobOrderUserType = 'sander';
    } else if (userTypeId === 7) {
      jobOrderUserType = 'taper';
    }

    const jobOrderUserId = getJobUserType(jobOrderId, jobOrderUserType);
    setSubUserType(jobOrderUserType);
    setSubUserTypeId(jobOrderUserId);
    setUserTypeId(userTypeId);
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

  const clearData = () => {
    setSubmitted(false);
    setFormData({ ...defaultState });
  };

  const handleDelete = (e: any, id: number) => {
    e.preventDefault();
    actions.deleteJobOrder(id);
  };

  const handleEdit = (e: any, jobOrder: JobOrder) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...jobOrder });
  };

  const onFormChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheckboxChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked ? 1 : 0 });
  };

  const onDateChange = (date: any, name: string) => {
    // setFormData({ ...formData, [name]: moment(date).format('YYYY-MM-DD') });
  }

  const onMultiSelectChange = (value: any, name: string) => {
    if (value === null) {
      setFormData({ ...formData, [name]: [] });
    } else {
      setFormData({ ...formData, [name]: [...value] });
    }
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (formData.name) {
      if (!formData.id) {
        actions.addJobOrder(formData);
      } else {
        actions.updateJobOrder(formData);
      }
    }
  };

  const calculateDate = (date: any, dayInterval: number) => {
    if (!date) {
      return null;
    }
    const currrentDate = moment(date).format('YYYY-MM-DD');
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
    return '';
    if (!date) {
      return '';
    }
    const currentDate = moment().add('days', 1);
    date = moment(date).toDate();
    dayInterval = dayInterval ? dayInterval : 0;
    let targetDate = moment(date).add('days', dayInterval);
    let highlightClass = '';
    if (currentDate.isSame(targetDate, 'd')) {
      highlightClass = 'light-green';
    }
    return highlightClass;
  }

  const getfilteredUsers = () => {
    let userTypeId = 0;
    if (filterFormData.userType === 'hanger') {
      userTypeId = 4;
    } else if (filterFormData.userType === 'sprayer') {
      userTypeId = 5;
    } else if (filterFormData.userType === 'sander') {
      userTypeId = 6;
    } else if (filterFormData.userType === 'taper') {
      userTypeId = 7;
    }
    const newData = usersData.filter((user: any) => {
      return user.userTypes.some((userType: any) => parseInt(userType.id, 10) === userTypeId)
    });
    return newData;
  }

  const onSubSelectChange = (e: any, jobOrderId: any, jobOrderUserType: string) => {
    if (!getJobUserType(jobOrderId, jobOrderUserType)) {
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
    }
  }

  const getJobUserType = (jobOrderId: any, jobOrderUserType: string) => {
    const currentJobOrder = jobOrdersData.filter((jobOrder: any) => jobOrder.id === jobOrderId)[0] || {};
    const { users } = currentJobOrder;

    if (users && users.length) {
      const jobUser = users.filter((jobUser: any) => jobUser.jobOrderUserType === jobOrderUserType);
      return jobUser.length ? jobUser[0].id : 0;
    }
    return 0;
  }

  const getJobUserTypeName = (jobOrderId: any, jobOrderUserType: string) => {
    const currentJobOrder = jobOrdersData.filter((jobOrder: any) => jobOrder.id === jobOrderId)[0] || {};
    const { users } = currentJobOrder;

    if (users && users.length) {
      const jobUser = users.filter((jobUser: any) => jobUser.jobOrderUserType === jobOrderUserType);
      return jobUser.length ? jobUser[0].name : '';
    }
    return '';
  }

  const { jobOrders: jobOrdersData } = jobOrders;
  const { users: usersData } = users;
  const { billingItems: billingItemsData } = billingItems;
  const { billingItemGroups: billingItemGroupsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;


  const onColumnFilterChange = (e: any) => {
    console.log(columnFilters);
    const name = e.target.name;
    const val = columnFilters[name] === true ? false : true;
    // let filterObj: any = {};
    // if (name === 'hanger') {
    //   const filterObj = {
    //     all: false,
    //     hanger: columnFilters['hanger'] === true ? false : true,
    //     taper: columnFilters['taper'] === true ? false : true
    //   };
    //   setColumnFilters({ ...columnFilters, ...filterObj });
    // } else if (name === 'sprayer') {
    //   const filterObj = {
    //     all: false,
    //     sprayer: columnFilters['sprayer'] === true ? false : true,
    //     sander: columnFilters['sander'] === true ? false : true
    //   };
    //   setColumnFilters({ ...columnFilters, ...filterObj });
    // } else {
    //   const filterObj = {
    //     all: true,
    //     hanger: false,
    //     taper: false,
    //     sprayer: false,
    //     sander: false
    //   };
    //   setColumnFilters({ ...columnFilters, ...filterObj });
    // }
    // if (name === 'all') {
    //   setColumnFilters({ ...columnFilters, [e.target.name]: val });
    // } else {

    //   setColumnFilters({ ...columnFilters, all: false, [e.target.name]: val });
    // }

    // const filterObj = {
    //   all: false,
    //   hanger: false,
    //   taper: false,
    //   sprayer: false,
    //   sander: false,
    // };
    // setColumnFilters({ ...filterObj, [e.target.name]: val });

    if (name === 'all') {
      const filterObj = {
        all: true,
        hanger: false,
        taper: false,
        sprayer: false,
        sander: false
      };
      setColumnFilters({ ...columnFilters, ...filterObj });
    } else {
      const filterObj = {
        all: false,
        [e.target.name]: val
        // hanger: columnFilters['hanger'] === true ? false : true,
        // taper: columnFilters['taper'] === true ? false : true
      };
      setColumnFilters({ ...columnFilters, ...filterObj });
    }
  };

  const getCurrentGroupCounts = (groupId: any, jobOrder: any) => {
    // console.log(jobOrder.billingItemsGroupsCount);
    const group = jobOrder.billingItemsGroupsCount.filter((singleGroup: any) => singleGroup.groupId === groupId);
    // console.log(group);
    // if (group && group.length > 0) {
    //   return group[0].total;
    // }
    return group && group.length > 0 ? group[0].total : '';
  };

  const getCurrentJobClasses = (jobOrder: any) => {
    let classes = '';
    return classes;
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


    // const closedJobs = jobOrdersData.every((singleJobOrder: any) => singleJobOrder.jobStatus === 'closed' && jobIdsList.includes(singleJobOrder.id));
    // const closedJobs = jobIdsList.every((singleJobId: any) => singleJobOrder.jobStatus === 'closed' && jobIdsList.includes(singleJobOrder.id));
    // const currentJobs = _.find(jobOrdersData, (singleJobOrder: any) => singleJobOrder.jobStatus === 'closed');
    // const closedJobs = jobIdsList.every((singleJobId: any) => _.find(closedJobs, (singleClosedJob: any) => singleClosedJob) )
    // const closedJobs = jobOrdersData.filter((singleJobOrder: any) => singleJobOrder.jobStatus === 'closed' && jobIdsList.includes(singleJobOrder.id));



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

    const holdJobs = jobOrdersData.filter((singleJobOrder: any) => jobAction.jobIds.includes(singleJobOrder.id) && singleJobOrder.jobStatus === 'hold');
    console.log('hold jobs', holdJobs);
    if (holdJobs.length > 0) {
      console.log('so now?');
      setDisabledCloseJobAction(true);
    } else {
      setDisabledCloseJobAction(false);
    }
  }, [jobAction]);


  const isCurrentActionInProgress = () => {
    return !!jobAction.submitted;
  }

  const handleActionBtnSubmit = async (e: any) => {
    // e.preventDefault();

    // if (jobAction.jobIds.length < 1) {
    //   return;
    // }

    // const actionValue = e.target.value;

    // setJobAction({ ...jobAction, submitted: true });

    // for (const currentJobId of jobAction.jobIds) {
    //   const currentJob = _.find(jobOrdersData, (singleJobOrder) => singleJobOrder.id == currentJobId);
    //   // console.log(currentJob);

    //   if (currentJob && actionValue) {
    //     const currentUpdatedJob = { ...currentJob, jobStatus: actionValue};
    //     console.log(currentUpdatedJob);
    //     await actions.updateJobOrder(currentUpdatedJob);
    //   }
    // }
    // setTimeout(() => {
    //   if (filterFormSubmitted) {
    //     actions.searchJobOrders(filterFormData);
    //   } else if (actions.getAllJobOrders !== undefined) {
    //     actions.getAllJobOrders();
    //   }
    //   setJobAction({ ...jobAction, jobIds: [], submitted: false });
    //   setFilterFormSubmitted(false);
    // }, 2000);

  };

  const DateCustomInput = ({onChange, placeholder, value, onClick, customClassName}: any) => (
    <>
    <div className="input-group">
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

const defaultFilterState: ReportFilter = {
  reportType: '1',
  userId: '',
  userTypeList: [],
  userType: '',
  dateFrom: '',
  dateTo: '',
  jobStatus: 'open',
  gigStatus: '',
  submitted: true,
};
const defaultTypingTimeout: any = null;
const [filterFormData, setFilterFormData] = useState(defaultFilterState);
const [filterFormDataSubmitted, setFilterFormDataSubmitted] = useState(false);
const [typingTimeout, setTypingTimeout] = useState(defaultTypingTimeout);
const [filterFormSubmitted, setFilterFormSubmitted] = useState(false);
const [actionMsgModal, setActionMsgModal] = useState('');

const onFilterFormInputChange = (e: Target) => {
  clearTimeout(typingTimeout);
  const value = e.target.value;
  setFilterFormData({ ...filterFormData, [e.target.name]: e.target.value });
};

const onFilterFormSelectChange = (e: Target) => {
  const value = e.target.value;
  setFilterFormData({
    ...defaultFilterState,
    [e.target.name]: e.target.value,
    // submitted: false
  });
  setFilterFormDataSubmitted(false);
  setColumnFilters({ ...defaultColumnFilters });

};

const onFilterFormSingleSelectChange = (e: Target) => {
  const value = e.target.value;
  setFilterFormData({ ...filterFormData, [e.target.name]: e.target.value });
};

const onFilterFormRadioChange = (e: Target) => {
  const value = e.target.value;
  setFilterFormData({ ...filterFormData, [e.target.name]: e.target.value });
};

const onFilterFormDateChange = (date: any, name: string) => {
  setFilterFormData({ ...filterFormData, [name]: moment(date).format('YYYY-MM-DD') });
}

const onFilterMultiSelectChange = (value: any, name: string) => {
  const aa = getUserTypesList().map((singleType: any) => singleType.name);
  // console.log(value);
  // console.log('sooooooooooo', value);
  const filterObj: any = {
    all: false,
    hanger: false,
    taper: false,
    sprayer: false,
    sander: false
  };
  const userTypeListValues:any = [];

  // let userTypeVal = '';
  if (value !== null) {
    // if (typeof value === 'string') {
    //   userTypeVal = value.toLowerCase();
    // } else {
      value.forEach((singleVal: any) => {
        console.log(singleVal);
        const val = singleVal.toLowerCase();
        filterObj[val] = true;
        userTypeListValues.push(val);
      });
    // }
  }

  setColumnFilters({ ...columnFilters, ...filterObj });

  if (value === null) {
    setFilterFormData({ ...filterFormData, [name]: [] });
  } else {
    setFilterFormData({ ...filterFormData, [name]: [...userTypeListValues] });
  }
};

const onFilterFormChange = (e: Target) => {
  setFilterFormData({ ...filterFormData, [e.target.name]: e.target.value });
  const filterObj: any = {
    all: false,
    hanger: false,
    taper: false,
    sprayer: false,
    sander: false
  };
  let val:any = e.target.value;
  val = val.toLowerCase();
  filterObj[val] = true;
  setColumnFilters({ ...columnFilters, ...filterObj });
  console.log(val);
};

useEffect(() => {
  console.log(filterFormData);
  if ((filterFormData.reportType === '1' && filterFormData.userType !== '' && filterFormData.userId !== '' && filterFormData.dateFrom !== '' && filterFormData.dateTo !== '') ||
    ( filterFormData.reportType === '2' && filterFormData.userTypeList.length > 0 && filterFormData.dateFrom !== '' && filterFormData.dateTo !== '') ||
    filterFormData.reportType === '3'
    ) {
    // setFilterFormSubmitted(true);
    setFilterFormDataSubmitted(true);
    actions.getReportJobOrders(filterFormData);
  }

  // setJobAction({ ...jobAction, jobIds: [] });
  // if (filterFormData.address !== '') {
  //   const delayDebounce = setTimeout(() => {
  //     actions.searchJobOrders(filterFormData);
  //     setTypingTimeout(false);
  //   }, 1000);
  //   setTypingTimeout(delayDebounce);
  // } else {
  //   console.log('Searching form data for ', filterFormData);
  //   actions.searchJobOrders(filterFormData);
  // }
}, [filterFormData]);

  const getUserTypesList = () => {
    const excludeUserTypes = [1, 2, 3];
    const userTypesDataList = userTypesData.filter((userType: any) => !excludeUserTypes.includes(userType.id));
    return userTypesDataList;
  };

  const getUserTypesListValues = () => {
    const userTypesDataList = [
      'All',
      ...getUserTypesList().map((singleType: any) => singleType.name)
    ];
    return userTypesDataList;
  }

  const { userTypes: userTypesData } = userTypes;

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      background: '#fff',
      borderColor: '#9e9e9e',
      minHeight: '30px',
      // height: '30px',
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided: any, state: any) => ({
      ...provided,
      // height: '30px',
      padding: '0 6px'
    }),

    input: (provided: any, state: any) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: (state: any) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided: any, state: any) => ({
      ...provided,
      height: '30px',
    }),
  };

  return (
    <>
    <div className="clear pad-40" />
      <div className="">
        <div className="col-md-12">
          <div className="card reports-container">
            <div className="card-header">

              <div className="filter-container">
                <div className="">
                  <h4 className="text_blue pull-left">
                    Select Your Report Type
                  </h4>
                  <PrintReport
                    label={'Print'}
                    componentName={'ReportTable'}
                    formData={formData}
                    columnFilters={columnFilters}
                    filterFormData={filterFormData}
                    filterFormDataSubmitted={filterFormDataSubmitted}
                  />
                  <div className="col-md-5ths">
                    <div className="mr-5">
                      <select
                        className="form-control input-sm mt-5"
                        name="reportType"
                        onChange={(e) => onFilterFormSelectChange(e)}
                      >
                        <option value={'1'}>Individual Contractor Report</option>
                        <option value={'2'}>Contractor Type Report</option>
                        <option value={'3'}>Schedule Report</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="clear pad-10" />
                <form className="form-horizontal">
                  <div className="rows">

                    <div className="col-md-12">
                      <div className="row">
                        { filterFormData.reportType !== '3' && (
                          <div className="form-group col-md-5ths col-xs-6 mb-20">
                            <label className="control-label">
                              User Type
                            </label>
                            <div className="mr-5">
                              { filterFormData.reportType === '2' && (
                                <Select
                                  isMulti
                                  options={getUserTypesListValues()}
                                  getOptionLabel={(userType: any) => userType}
                                  getOptionValue={(userType: any) => userType}
                                  value={filterFormData.userTypeList}
                                  onChange={(value) => onFilterMultiSelectChange(value, 'userTypeList')}
                                  styles={customStyles}
                                />
                              ) }

                              { filterFormData.reportType === '1' && (
                                <select
                                  className="form-control input-sm"
                                  name="userType"
                                  onChange={(e) => onFilterFormChange(e)}
                                >
                                  <option value={''}></option>
                                  {getUserTypesList().length ? getUserTypesList().map((userType: any, i: any) => (
                                    <option key={i} value={userType.name.toLowerCase()}>{userType.name}</option>
                                  )) : (<></>)}
                                </select>
                              )}

                            </div>
                          </div>
                        )}


                        { filterFormData.reportType === '1' && (
                          <div className="form-group col-md-5ths col-xs-6 mb-20">
                            <label className="control-label">
                              User
                            </label>
                            <div className="mr-5">
                              <select
                                className="form-control input-sm"
                                name="userId"
                                onChange={(e) => onFilterFormSingleSelectChange(e)}
                              >
                                <option value={''}></option>
                                {getfilteredUsers().length > 0 ? getfilteredUsers().map((singleUser: any) => (
                                  <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                                )) : (<></>)}
                              </select>
                            </div>
                          </div>
                        )}


                        { (filterFormData.reportType === '1' || filterFormData.reportType === '2') && (
                          <>
                            <div className="form-group col-md-5ths col-xs-6 mb-20">
                              <div className="">
                                <label className="control-label">
                                  Date From
                                </label>
                                <div className="mr-5">
                                  <DatePicker
                                    name="dateFrom"
                                    selected={!!filterFormData.dateFrom ? moment(filterFormData.dateFrom).toDate() : null}
                                    onChange={(date) => onFilterFormDateChange(date, 'dateFrom')}
                                    customInput={<DateCustomInput customClassName={`form-control input-sm `} />}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="form-group col-md-5ths col-xs-6 mb-20">
                              <div className="">
                                <label className="control-label">
                                  Date To
                                </label>
                                <div className="mr-5">
                                  <DatePicker
                                    name="dateTo"
                                    selected={!!filterFormData.dateTo ? moment(filterFormData.dateTo).toDate() : null}
                                    onChange={(date) => onFilterFormDateChange(date, 'dateTo')}
                                    customInput={<DateCustomInput customClassName={`form-control input-sm `} />}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}


                        { (filterFormData.reportType === '1' || filterFormData.reportType === '2') && (
                          <>
                            <div className="form-group col-md-5ths col-xs-6 mb-20">
                              <label className="control-label"></label>
                              <div className="">
                                <div className="col-xs-12">
                                  <label className="control-label">
                                    <input
                                      type="radio"
                                      name="jobStatus"
                                      value="open"
                                      checked={filterFormData.jobStatus !== 'closed' ? true : false}
                                      onChange={(e) => onFilterFormRadioChange(e)}
                                      className="mr-5i"
                                    />
                                    Open
                                  </label>
                                  <label className="control-label ml-10">
                                    <input
                                      type="radio"
                                      name="jobStatus"
                                      value="closed"
                                      checked={filterFormData.jobStatus === 'closed' ? true : false}
                                      onChange={(e) => onFilterFormRadioChange(e)}
                                      className="mr-5i"
                                    />
                                    Closed
                                  </label>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>


              <div className="clear pad-5" />

              <div className="table-responsive">
                <ReportTable
                  formData={formData}
                  columnFilters={columnFilters}
                  filterFormDataSubmitted={filterFormDataSubmitted}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ReportPage.propTypes = {
// jobOrders: PropTypes.object.isRequired,
// actions: PropTypes.func.isRequired
// };


const mapStateToProps = (state: ReportReduxProps) => ({
  jobOrders: state.jobOrders,
  users: state.users,
  billingItems: state.billingItems,
  houseLevelTypes: state.houseLevelTypes,
  purchaseOrders: state.purchaseOrders,
  userTypes: state.userTypes,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getReportJobOrders: bindActionCreators(JobOrderActions.getReportJobOrders, dispatch),
    getAllJobOrders: bindActionCreators(JobOrderActions.getAllJobOrders, dispatch),
    searchJobOrders: bindActionCreators(JobOrderActions.searchJobOrders, dispatch),
    getJobOrder: bindActionCreators(JobOrderActions.getJobOrder, dispatch),
    addJobOrder: bindActionCreators(JobOrderActions.addJobOrder, dispatch),
    saveFilterSearch: bindActionCreators(JobOrderActions.saveFilterSearch, dispatch),
    updateJobOrder: bindActionCreators(JobOrderActions.updateJobOrder, dispatch),
    deleteJobOrder: bindActionCreators(JobOrderActions.deleteJobOrder, dispatch),
    
    getHouseLevelStock: bindActionCreators(JobOrderActions.getHouseLevelStock, dispatch),
    getUsers: bindActionCreators(UserActions.getUsers, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
    getAllHouseLevelTypes: bindActionCreators(HouseLevelTypeActions.getAllHouseLevelTypes, dispatch),
    updateJobOrderUser: bindActionCreators(JobOrderActions.updateJobOrderUser, dispatch),
    addPurchaseOrder: bindActionCreators(PurchaseOrderActions.addPurchaseOrder, dispatch),
    getAllBillingItemGroups: bindActionCreators(billingItemActions.getAllBillingItemGroups, dispatch),
    getAllUserTypes: bindActionCreators(userTypeActions.getAllUserTypes, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportPage);
