import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as UserActions from '../../redux/actions/userActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import * as PurchaseOrderActions from '../../redux/actions/purchaseOrderActions';
import * as billingItemActions from '../../redux/actions/billingItemActions';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';


// import PropTypes from 'prop-types';
import {
  ScheduleReduxProps,
  ScheduleList,
  JobOrder,
  Target,
  JobOrderFilter, BuilderReduxProps,
} from '../../types/interfaces';
import VerModal from './VerModal';
import SubModal from './SubModal';
import InvoiceModal from './InvoiceModal';
import momentBusinessDays from "moment-business-days";
import {configs} from "../../types/Constants";
import {stringify} from "querystring";

const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('scheduleTableBody');
  schTblBody!.querySelectorAll('tr').forEach(function (elem) {
    elem.classList.remove('slctdRow');
  });
  const slctdRowID = 'tblRow'+row!.id;
  const slctdRow = document.getElementById(slctdRowID);
  slctdRow!.classList.add('slctdRow');
};
const SchedulePage = ({
  jobOrders,
  meta,
  users,
  billingItems,
  houseLevelTypes,
  searchData,
  purchaseOrders,
  actions
}: ScheduleList) => {

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
    //   actions.getAllJobOrders({ ... paginationOptions });
    // }
    actions.getUsers();
    actions.getAllBillingItems();
    actions.getAllHouseLevelTypes();
    actions.getFilterSearch();
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
    pageTrack: 1,
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
  const [verJobOrderActiveType, setVerJobOrderActiveType] = React.useState('');
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
  const [paintDateStatus, setPaintDateStatus] = React.useState(false);
  const [jobOrderId, setJobOrderId] = React.useState(0);

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
      isSystemOrder: 1,
      reCreate: 1,
    };

    if (actions.addPurchaseOrder !== undefined && verJobOrderId && subUserTypeId) {
      await actions.addPurchaseOrder(purchaseOrderObj);
    }
    setIsSubModalOpen(false);
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

    setVerJobOrderActiveType(jobOrderUserType);

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

  const onSaveSearch =() => {
    console.log('form data', filterFormData);
    actions.saveFilterSearch(filterFormData);
    setTimeout(function(){ window.location.reload(); }, 1000);

  }

  const onDateChange = (date: any, name: string) => {
    if (!date) return;
    // let fieldObj: any = {};
    console.log(date, name);

    let convertdate = momentBusinessDays(date).businessAdd(1, 'days').format('YYYY-MM-DD');
    // fieldObj = getCalculatedDate(date);
    console.log(convertdate);
    setFormData({ ...formData, [name]: convertdate });
    console.log(formData);

    // setFormData({ ...formData, [name]: moment(date).format('YYYY-MM-DD') });
  };

  const getCalculatedDate = (date: any, fogged: boolean = false, dateFieldName: string, currentJobOrder: any) => {
    const fieldObj: any = {};
    const isFogged = currentJobOrder.ceilingFinishFogged;

    console.log(isFogged);

    // Start date
    // let startDate = momentBusinessDays(date).businessAdd(1, 'days').format('YYYY-MM-DD');
    // fieldObj.startDate = moment(startDate).format('YYYY-MM-DD');

    const sanderDateInterval = isFogged ? 8 : 7;
    let startDate = currentJobOrder.startDate;

    // Hanger start date
    let hangerStartDate = moment(currentJobOrder.hangerStartDate).format('YYYY-MM-DD');
    fieldObj.hangerStartDate = hangerStartDate;

    if(dateFieldName === 'hangerStartDate'){

      hangerStartDate = moment(date).format('YYYY-MM-DD');
      fieldObj.hangerStartDate = hangerStartDate;

    }

    // Hanger end date
    let hangerEndDate = momentBusinessDays(hangerStartDate).businessAdd(1, 'days').format('YYYY-MM-DD');
    if(dateFieldName !== 'taperEndDate'){
      if(dateFieldName !== 'taperStartDate'){
        if(dateFieldName !== 'sprayerDate'){
          if (dateFieldName !== 'sanderDate') {
            if(dateFieldName !== 'paintStartDate') {
              if(dateFieldName !== 'fogDate'){
                fieldObj.hangerEndDate = moment(hangerEndDate).format('YYYY-MM-DD');
              }
            }
          }
        }
      }
    }

    if(dateFieldName === 'hangerEndDate'){

      hangerEndDate = moment(date).format('YYYY-MM-DD');
      fieldObj.hangerEndDate = hangerEndDate;

    }


      // Sander date
      let sanderDate = momentBusinessDays(hangerStartDate).businessAdd(sanderDateInterval, 'days').format('YYYY-MM-DD');

    if(dateFieldName !== 'paintStartDate') {
      fieldObj.sanderDate = moment(sanderDate).format('YYYY-MM-DD');

      if (dateFieldName === 'sanderDate') {

        sanderDate = moment(date).format('YYYY-MM-DD');
        fieldObj.sanderDate = sanderDate;

      }
    }

    // Paint date
    // let paintStartDate = momentBusinessDays(sanderDate).businessAdd(1, 'days').format('YYYY-MM-DD');
    // fieldObj.paintStartDate = moment(paintStartDate).format('YYYY-MM-DD');
    //
    // if(dateFieldName === 'paintDate'){
    //
    //   paintStartDate = moment(date).format('YYYY-MM-DD');
    //   fieldObj.paintStartDate = paintStartDate;
    //
    // }


    // Taper start date
    let taperStartDate = moment(hangerEndDate).add(1, 'days').format('YYYY-MM-DD');

    if(dateFieldName !== 'taperEndDate'){
      if(dateFieldName !== 'sprayerDate'){
        if (dateFieldName !== 'sanderDate') {
          if(dateFieldName !== 'paintStartDate') {
            if(dateFieldName !== 'fogDate'){
              fieldObj.taperStartDate = moment(taperStartDate).format('YYYY-MM-DD');
            }
          }
        }
      }
    }

    if(dateFieldName === 'taperStartDate'){

      taperStartDate = moment(date).format('YYYY-MM-DD');
      fieldObj.taperStartDate = taperStartDate;

    }

    // Taper end date
    let taperEndDate = momentBusinessDays(taperStartDate).businessAdd(2, 'days').format('YYYY-MM-DD');

    if(dateFieldName !== 'sprayerDate'){
      if (dateFieldName !== 'sanderDate') {
        if(dateFieldName !== 'paintStartDate') {
          if(dateFieldName !== 'fogDate'){
           fieldObj.taperEndDate = moment(taperEndDate).format('YYYY-MM-DD');
          }
        }
      }
    }

    if(dateFieldName === 'taperEndDate'){

      taperEndDate = moment(date).format('YYYY-MM-DD');
      fieldObj.taperEndDate = taperEndDate;

    }

    // Sprayer start date
    let sprayerDate = momentBusinessDays(taperEndDate).businessAdd(1, 'days').format('YYYY-MM-DD');

    if (dateFieldName !== 'sanderDate') {
      if(dateFieldName !== 'paintStartDate') {
        fieldObj.sprayerDate = moment(sprayerDate).format('YYYY-MM-DD');
      }
    }

    if(dateFieldName === 'sprayerDate'){

      sprayerDate = moment(date).format('YYYY-MM-DD');
      fieldObj.sprayerDate = sprayerDate;

    }


    if (isFogged) {
      // Fog date
      let fogDate = momentBusinessDays(taperEndDate).businessAdd(1, 'days').format('YYYY-MM-DD');
      if(dateFieldName !== 'sprayerDate'){
        if(dateFieldName !== 'sanderDate'){
          if(dateFieldName !== 'paintStartDate') {
            fieldObj.fogDate = moment(fogDate).format('YYYY-MM-DD');
          }
        }
      }

      if(dateFieldName === 'fogDate'){

        fogDate = moment(date).format('YYYY-MM-DD');
        fieldObj.fogDate = fogDate;
      }

      if(dateFieldName !== 'sprayerDate'){
        if(dateFieldName !== 'sanderDate'){
          if(dateFieldName !== 'paintStartDate') {
            let newSpDate = momentBusinessDays(fogDate).businessAdd(1, 'days').format('YYYY-MM-DD');
            fieldObj.sprayerDate = moment(newSpDate).format('YYYY-MM-DD');
          }
        }
      }
    }

    if(dateFieldName !== 'paintStartDate') {
      // Override sanderDate
      sanderDate = momentBusinessDays(fieldObj.sprayerDate).businessAdd(1, 'days').format('YYYY-MM-DD');
      fieldObj.sanderDate = sanderDate;

      if (dateFieldName === 'sanderDate') {

        sanderDate = moment(date).format('YYYY-MM-DD');
        fieldObj.sanderDate = sanderDate;

      }
    }

    // Scrap date
    let scrapDate = momentBusinessDays(hangerEndDate).businessAdd(1, 'days').format('YYYY-MM-DD');
    fieldObj.scrapDate = moment(scrapDate).format('YYYY-MM-DD');

    if(dateFieldName === 'scrapDate'){

      scrapDate = moment(date).format('YYYY-MM-DD');
      fieldObj.scrapDate = scrapDate;

    }

    // Close date
    let closeDate = momentBusinessDays(startDate).businessAdd(6, 'days').format('YYYY-MM-DD');
    fieldObj.closeDate = moment(closeDate).format('YYYY-MM-DD');
    closeDate = fieldObj.closeDate;
    fieldObj.closeDate = closeDate;

    // Paint date
    // let paintDate = momentBusinessDays(sanderDate).businessAdd(1, 'days').format('YYYY-MM-DD');
    // fieldObj.paintStartDate = moment(paintDate).format('YYYY-MM-DD');

    if(dateFieldName === 'paintStartDate'){

      let paintDate = moment(date).format('YYYY-MM-DD');
      fieldObj.paintDate = paintDate;

      let paintStartDate = moment(date).format('YYYY-MM-DD');
      fieldObj.paintStartDate = paintStartDate;

    }

    return fieldObj;

  };

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
      newDate = moment(targetDate).format('YYYY-MM-DD');
    } else if (moment(targetDate).day() === 0) {
      newDate = moment(targetDate).format('YYYY-MM-DD');
    } else {
      newDate = moment(targetDate).format('YYYY-MM-DD');
    }
    return newDate;
  }

  const highlightBackgroundClass = (date: any, dayInterval: number) => {
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

  const getfilteredUsers = (usersData: any, userTypeId: number) => {
    const newData = usersData.filter((user: any) => {
      return user.userTypes.some((userType: any) => parseInt(userType.id, 10) === userTypeId)
    });
    return newData;
  }

  const onSubSelectChange = (e: any, jobOrderId: any, jobOrderUserType: string) => {
    // console.log(getJobUserType(jobOrderId, jobOrderUserType));
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
    // }
  };

  const isSanderDateOverShoot = (jobOrder: any) => {
    if (jobOrder.sanderDate && jobOrder.paintStartDate) {
      let sanderDate = moment(jobOrder.sanderDate).format('YYYY-MM-DD');
      let paintDate = moment(jobOrder.paintStartDate).format('YYYY-MM-DD');
      return sanderDate >= paintDate ? true : false;
    }
    return false;
  };

  const onSingleDateChange = async (date: any, jobOrderId: any, dateFieldName: string) => {

    const currentJobOrder = jobOrdersData.filter((jobOrder: any) => jobOrder.id === jobOrderId)[0] || {};

    console.log(currentJobOrder);

    let updatedDates = getCalculatedDate(date, false, dateFieldName, currentJobOrder);

    console.log(updatedDates);


    let paintStDate = moment(currentJobOrder.paintStartDate).format('YYYY-MM-DD');

    if(updatedDates.sanderDate >= paintStDate){
      setPaintDateStatus(true);
      console.log(jobOrderId, currentJobOrder.id);
      setJobOrderId(jobOrderId);
    }else{
      setPaintDateStatus(false);
      setJobOrderId(jobOrderId);
    }

    const newJobFormData = {
      ...currentJobOrder,
      ...updatedDates
    };

    console.log(newJobFormData);


    await actions.updateJobOrder(newJobFormData);

    if(dateFieldName === 'hangerStartDate' && actions.getAllJobOrders !== undefined) {
        // setTimeout(() => {
          actions.getAllJobOrders({ ... paginationOptions });
        // }, 3000);
      // }
      }

  };


  const getJobUserType = (jobOrderId: any, jobOrderUserType: string) => {
    // @ts-ignore
    const currentJobOrder = (filterFormSubmitted ? jobOrdersData?.data : jobOrdersData).filter((jobOrder: any) => jobOrder.id === jobOrderId)[0] || {};
    const { users } = currentJobOrder;

    if (users && users.length) {
      const jobUser = users.filter((jobUser: any) => jobUser.jobOrderUserType === jobOrderUserType);
      return jobUser.length ? jobUser[0].id : 0;
    }
    return 0;
  }
  const [filterFormSubmitted, setFilterFormSubmitted] = useState(false);
  const  { jobOrders: jobOrdersData } = jobOrders;
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
    //   console.log('yesclosedjob', closedJobs);
    // } else {
    //   setDisabledOpenJobAction(true);
    // }
    if (!filterFormSubmitted){
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

    const actionValue = e.target.value;

console.log('data in handler is', jobOrdersData, jobAction);
    const nonVerifiedJobs = [];
    //@ts-ignore
    var jobsModifiedData = jobOrdersData.data ? jobOrdersData.data : jobOrdersData;
    for (const currentJobId of jobAction.jobIds) {
      const currentJob = _.find(jobsModifiedData, (singleJobOrder) => singleJobOrder.id == currentJobId);
      if (currentJob && !currentJob.isVerified) {
        nonVerifiedJobs.push(currentJobId);
      }
    }

    if (actionValue === 'closed') {
      if (nonVerifiedJobs.length > 1) {
        toast.error('Cannot mark unverifed jobs as done');
        return;
      } else if (nonVerifiedJobs.length > 0) {
        toast.error('Cannot mark unverifed job as done');
        return;
      }
    }

    setJobAction({ ...jobAction, submitted: true });
    
    for (const currentJobId of jobAction.jobIds) {
      const currentJob = _.find(jobsModifiedData, (singleJobOrder) => singleJobOrder.id == currentJobId);
      if (currentJob && actionValue) {
        const currentUpdatedJob = { ...currentJob, jobStatus: actionValue, pageTrack: 1};
        console.log(currentUpdatedJob);
        await actions.updateJobOrder(currentUpdatedJob);
      }
    }
    setJobAction({ ...jobAction, submitted: false });

    // Reload the page
  //window.location.reload();
    // if(actionValue == 'active'){
    //   actions.searchJobOrders(filterFormData, {...paginationOptions});
    // }
    if (filterFormSubmitted){
      actions.searchJobOrders(filterFormData, paginationOptions);
    }else{
      window.location.reload();
      if (actions.getAllJobOrders !== undefined) {
        actions.getAllJobOrders(paginationOptions);
      }
    }
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

const defaultFilterState: JobOrderFilter = {
  address: '',
  hangerId: 0,
  taperId: 0,
  sprayerId: 0,
  sanderId: 0,
  sGarageFilter: 0,
  dateFrom: '',
  dateTo: '',
  garage: false,
  jobStatus: '',
  gigStatus: '',
  submitted: false,
  pageTrack: 1
};
const defaultTypingTimeout: any = null;
const [filterFormData, setFilterFormData] = useState(defaultFilterState);
const [typingTimeout, setTypingTimeout] = useState(defaultTypingTimeout);


// Pagination start
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);


  const defaultPaginationOptions = {
    offset: 0,
    limit: itemPerPage,
    currentPage: 1,
  };
  const [paginationOptions, setPaginationOptions] = useState(defaultPaginationOptions);

const onFilterFormInputChange = (e: Target) => {
  clearTimeout(typingTimeout);
  setFilterFormSubmitted(true);
  const value = e.target.value;
  setFilterFormData({ ...filterFormData, [e.target.name]: e.target.value });
};

const onFilterFormDateChange = (date: any, name: string) => {
  setFilterFormSubmitted(true);
  setFilterFormData({ ...filterFormData, [name]: moment(date).format('YYYY-MM-DD') });
}

const onFilterFormChange = (e: Target) => {
  setFilterFormSubmitted(true);
  setFilterFormData({ ...filterFormData, [e.target.name]: e.target.value });
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


  const getUsersByUserType = (userType: any) => {
    let userTypeId:any = '';
    if (userType === 'hanger') {
      userTypeId = 4;
    } else if (userType === 'sprayer') {
      userTypeId = 5;
    } else if (userType === 'sander') {
      userTypeId = 6;
    } else if (userType === 'taper') {
      userTypeId = 7;
    }
    const usersList = usersData.filter((user:any) => user.userTypes.some((userType: any) => userType.id == userTypeId));
    return usersList.length > 0 ? usersList : [];
  }



  const onPerPageChange = (e: any) => {
    let pageValue = parseInt(e.target.value, 10);
    setCurrentPage(1);
    setItemPerPage(pageValue);
  };

  const getSchedulePaginated = (selectedPage: number) => {
    const limit = itemPerPage;
    setCurrentPage(selectedPage);
    const options = { page: selectedPage, limit };

    if (filterFormSubmitted){
      actions.searchJobOrders(filterFormData, options);
    }else{
      if (actions.getAllJobOrders !== undefined) {
        actions.getAllJobOrders(options);
      }
    }
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

  useEffect(() => {
    if (actions.getAllJobOrders !== undefined) {
      actions.getAllJobOrders({...paginationOptions});
    }
  }, [actions.getAllJobOrders]);

  useEffect(() => {
    getSchedulePaginated(currentPage);
  }, [itemPerPage]);

  return (
    <>
      <div className="clear pad-40" />
      <div className="">
        <div className="col-md-12">
          <div className="card schedules-container ap-container">
            <div className="card-header">
              <div className="row pull-left">
              <div className="col-md-6">
                <h4 className="text_blue schedule-page-heading-h4">
                  Overall Schedule
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
              </div>
              <div className="pull-right mt-10">
              <a href="/delete-filters-page" className="filter-delete-class">Delete Filter</a>
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
                            className="form-control input-sm"
                            name="hangerId"
                            onChange={(e) => onFilterFormChange(e)}
                         
                          >
                            <option value={''}></option>
                            {getUsersByUserType('hanger').length > 0 ? getUsersByUserType('hanger').map((singleUser) => (
                              <option  selected={ filterFormData.hangerId == singleUser.id} key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
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
                            className="form-control input-sm"
                            name="taperId"
                            onChange={(e) => onFilterFormChange(e)}
                          >
                            <option value={''}></option>
                            {getUsersByUserType('taper').length > 0 ? getUsersByUserType('taper').map((singleUser) => (
                              <option key={singleUser.id} selected={ filterFormData.taperId == singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {(columnFilters.all || columnFilters.sprayer) && (
                      <div className="form-group col-md-5ths col-xs-6 mb-20">
                        <label className="control-label">
                          Sprayer
                        </label>
                        <div className="mr-5">
                          <select
                            className="form-control input-sm"
                            name="sprayerId"
                            onChange={(e) => onFilterFormChange(e)}
                          >
                            <option value={''}></option>
                            {getUsersByUserType('sprayer').length > 0 ? getUsersByUserType('sprayer').map((singleUser) => (
                              <option key={singleUser.id} selected={ filterFormData.sprayerId == singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {(columnFilters.all || columnFilters.sander) && (
                      <div className="form-group col-md-5ths col-xs-6 mb-20">
                        <label className="control-label">
                          Sander
                        </label>
                        <div className="mr-5">
                          <select
                            className="form-control input-sm"
                            name="sanderId"
                            onChange={(e) =>onFilterFormChange(e)}
                          >
                            <option value={''}></option>
                            {getUsersByUserType('sander').length > 0 ? getUsersByUserType('sander').map((singleUser) => (
                              <option key={singleUser.id} selected={ filterFormData.sanderId == singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                            )) : (<></>)}
                          </select>
                        </div>
                      </div>
                    )}

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
                            customInput={<DateCustomInput customClassName={`form-control`} />}
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
                            customInput={<DateCustomInput customClassName={`form-control`} />}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-md-3 mb-20">
                      <label className="control-label"></label>
                      <div className="">
                        <div className="col-md-12">
                          <label className="control-label">
                            <input
                              type="radio"
                              name="jobStatus"
                              value=""
                              checked={filterFormData.jobStatus !== 'closed' ? true : false}
                              onChange={(e) => onFilterFormChange(e)}
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
                    {/* <div className="form-group col-md-3 mb-20">
                      <div className="">
                        <label></label>
                        <div className="mr-5">
                          <label>
                            <input
                              type="radio"
                              name="jobStatus"
                              value="closed"
                              checked={filterFormData.jobStatus === 'closed' ? true : false}
                              onChange={(e) => onFilterFormChange(e)}
                              className=""
                            />
                            Closed
                          </label>
                        </div>
                      </div>
                    </div> */}

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
                      name="activeAction"
                      value="active"
                      disabled={isCurrentActionInProgress() || disabledOpenJobAction}
                      onClick={(e) => handleActionBtnSubmit(e)}
                      className="btn btn-default btn-sm mr-10"
                    >Re-Open</button> | &nbsp;&nbsp;&nbsp;&nbsp;
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
                   
                  </div>

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
              </div>

              <div className="clear pad-5" />

              <div className="table-responsive">
                <table className="schedule-table table ap-table table-schedule table-bordered table-striped">
                  <thead>
                    <tr>
                      <th colSpan={2}>Sr.#</th>
                      <th className="w-100">
                        Action
                      </th>
                      <th className="w-150">
                        Address
                      </th>
                      <th className="w-150">
                        Ceil Fin
                      </th>
                      <th>
                        Ver
                      </th>
                      {billingItemGroupsData && billingItemGroupsData.length ? billingItemGroupsData.map((billingItemGroup, i) => (
                        <th key={i}>
                          {billingItemGroup.groupName}
                        </th>
                      )) : (
                          <></>
                        )}
                      {(columnFilters.all || columnFilters.hanger) && (
                        <>
                          <th className="w-150">
                            Hanger
                          </th>
                          <th></th>
                          <th className="w-120">
                            Start mm/dd/yy
                          </th>
                          <th className="w-120">
                            End mm/dd/yy
                          </th>
                        </>
                      )}

                      {(columnFilters.all || columnFilters.taper) && (
                        <>
                          <th className="w-150">
                            Taper
                          </th>
                          <th></th>
                          <th className="w-120">
                            Start mm/dd/yy
                          </th>
                          <th className="w-120">
                            End mm/dd/yyy
                          </th>
                        </>
                      )}

                      {(columnFilters.all || columnFilters.sprayer) && (
                        <>
                          <th className="w-150">
                            Sprayer
                          </th>
                          <th></th>
                          <th className="w-120">
                            Fog Date mm/dd/yy
                          </th>
                          <th className="w-120">
                            Spray Date mm/dd/yy
                          </th>
                        </>
                      )}


                      {(columnFilters.all || columnFilters.sander) && (
                        <>
                          <th className="w-150">
                            Sander
                          </th>
                          <th>
                          </th>
                          <th className="w-120">
                            Date mm/dd/yy
                          </th>
                          <th className="w-120">
                              Paint mm/dd/yy
                          </th>
                        </>
                      )}

                    </tr>
                  </thead>
                  <tbody id='scheduleTableBody'>
                  {/* @ts-ignore */}
                  {(filterFormSubmitted ? jobOrdersData?.data?.length > 0 : jobOrdersData.length > 0) ? (filterFormSubmitted ? jobOrdersData?.data : jobOrdersData).map((jobOrder, i) => (
                      <tr id={`tblRow${jobOrder.id}`} key={jobOrder.id} className={(isSanderDateOverShoot(jobOrder) || (paintDateStatus && jobOrderId === jobOrder.id)) ? 'table-row-error' : ''} onClick={()=>handleSelectedRow(jobOrder)}>
                        <th className={jobOrder.jobStatus === 'hold' ? 'bg-yellow' : ''}>
                          {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                        </th>
                        <td className={jobOrder.jobStatus === 'hold' ? 'bg-yellow' : ''}>
                          <input
                            type="checkbox"
                            name="checkboxAction"
                            value="1"
                            className="test"
                            checked={isCurrentActionChecked(jobOrder.id)}
                            onChange={(e) => onActionCheckboxChange(e, jobOrder.id)}
                            disabled={isActionCheckboxDisabled(jobOrder.id)}
                          />
                        </td>
                        <td>
                          <a href={`/job-orders/${jobOrder.id}`} className="btn btn-default btn-sm btn-custom mr-10 ml-10">
                            Edit
                          </a>
                          <button
                            type="button"
                            className="btn btn-default btn-sm btn-custom mr-10"
                            onClick={(e) => handleVerModal(e, jobOrder.id)}
                          >
                            Ver
                          </button>
                        </td>
                        <td className={getCurrentJobClasses(jobOrder)}>
                          <strong>{jobOrder.address}, {jobOrder.cityName}</strong>
                        </td>
                        <td className={getCurrentJobClasses(jobOrder)}>
                          {jobOrder.ceilingFinishName || ''}
                        </td>
                        <td>
                          {jobOrder.isVerified ? (<i className="fa fa-check fa-sm" />) : (<></>)}
                        </td>

                        {billingItemGroupsData && billingItemGroupsData.length ? billingItemGroupsData.map((billingItemGroup, i) => (
                          <td key={i}>
                            {getCurrentGroupCounts(billingItemGroup.id, jobOrder)}
                          </td>
                        )) : (
                            <></>
                          )}

                        {(columnFilters.all || columnFilters.hanger) && (
                          <>
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
                              <input
                                type="button"
                                value="Sub"
                                className="btn btn-default btn-sm btn-custom"
                                onClick={(e) => handleSubModal(e, jobOrder.id, 4)}
                                disabled={!getJobUserType(jobOrder.id, 'hanger') ? true : false}
                              />
                            </td>
                            <td>
                              {/* <div className="input-group"> */}
                                <DatePicker
                                  name="hangerStartDate"
                                  selected={!!jobOrder.hangerStartDate ? moment(calculateDate(jobOrder.hangerStartDate, 0)).toDate() : null}
                                  onChange={(date) => onSingleDateChange(date, jobOrder.id, 'hangerStartDate')}
                                  customInput={<DateCustomInput customClassName={`form-control ${highlightBackgroundClass(jobOrder.hangerStartDate, 0)}`} groupClassName="addon input-group-sm" />}
                                />
                                {/* <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div> */}
                            </td>
                            <td>
                              {/* <div className="input-group"> */}
                                <DatePicker
                                  name="hangerEndDate"
                                  selected={!!jobOrder.hangerEndDate ? moment(calculateDate(jobOrder.hangerEndDate, 0)).toDate() : null}
                                  onChange={(date) => onSingleDateChange(date, jobOrder.id, 'hangerEndDate')}
                                  customInput={<DateCustomInput customClassName={`form-control h-30 ${highlightBackgroundClass(jobOrder.hangerEndDate, 0)}`} groupClassName="addon input-group-sm" />}
                                />
                                {/* <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div> */}
                            </td>
                          </>
                        )}


                        {(columnFilters.all || columnFilters.taper) && (
                          <>
                            {/* <td>
                              <div className="input-group">
                                <DatePicker
                                  name="scrap1"
                                  selected={!!jobOrder.scrapDate ? moment(calculateDate(jobOrder.scrapDate, 0)).toDate() : null}
                                  onChange={(date) => onDateChange(date, 'deliveryDate')}
                                  className={`form-control h-30 ${highlightBackgroundClass(jobOrder.scrapDate, 0)}`}
                                />
                                <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div>
                            </td> */}
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
                              <input
                                type="button"
                                value="Sub"
                                className="btn btn-default btn-sm btn-custom"
                                onClick={(e) => handleSubModal(e, jobOrder.id, 7)}
                                disabled={!getJobUserType(jobOrder.id, 'taper') ? true : false}
                              />
                            </td>
                            <td>
                              {/* <div className="input-group"> */}
                                <DatePicker
                                  name="start2"
                                  selected={!!jobOrder.taperStartDate ? moment(calculateDate(jobOrder.taperStartDate, 0)).toDate() : null}
                                  onChange={(date) => onSingleDateChange(date, jobOrder.id, 'taperStartDate')}
                                  customInput={<DateCustomInput customClassName={`form-control h-30 ${highlightBackgroundClass(jobOrder.taperStartDate, 0)}`} groupClassName="addon input-group-sm" />}
                                />
                                {/* <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div> */}
                            </td>
                            <td>
                              {/* <div className="input-group"> */}
                                <DatePicker
                                  name="taperEndDate"
                                  selected={!!jobOrder.taperEndDate ? moment(calculateDate(jobOrder.taperEndDate, 0)).toDate() : null}
                                  onChange={(date) => onSingleDateChange(date, jobOrder.id, 'taperEndDate')}
                                  customInput={<DateCustomInput customClassName={`form-control h-30 ${highlightBackgroundClass(jobOrder.taperEndDate, 0)}`} groupClassName="addon input-group-sm" />}
                                />
                                {/* <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div> */}
                            </td>
                          </>
                        )}




                        {/* <td>
                          <div className="input-group">
                            <DatePicker
                              name="kdstart"
                              selected={!!formData.deliveryDate ? null : null}
                              onChange={(date) => onDateChange(date, 'deliveryDate')}
                              className={`form-control h-30`}
                            />
                            <span className="input-group-addon">
                              <i className="far fa-calendar-alt"></i>
                            </span>
                          </div>
                        </td> */}


                        {(columnFilters.all || columnFilters.sprayer) && (
                          <>
                            <td>
                              <select
                                name="sprayerUserId"
                                value={getJobUserType(jobOrder.id, 'sprayer')}
                                onChange={(e) => onSubSelectChange(e, jobOrder.id, 'sprayer')}
                                className="form-control input-sm"
                              >
                                <option value=""></option>
                                {getfilteredUsers(usersData, 5).length > 0 ? getfilteredUsers(usersData, 5).map((singleUser: any) => (
                                  <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                                )) : (<></>)}
                              </select>
                            </td>
                            <td>
                              <input
                                type="button"
                                value="Sub"
                                className="btn btn-default btn-sm btn-custom"
                                onClick={(e) => handleSubModal(e, jobOrder.id, 5)}
                                disabled={!getJobUserType(jobOrder.id, 'sprayer') ? true : false}
                              />
                            </td>
                            <td>
                              {/* <div className="input-group"> */}
                                <DatePicker
                                  name="fogDate"
                                  selected={(!!jobOrder.fogDate && jobOrder.ceilingFinishFogged) ? moment(calculateDate(jobOrder.fogDate, 0)).toDate() : null}
                                  onChange={(date) => onSingleDateChange(date, jobOrder.id, 'fogDate')}
                                  customInput={<DateCustomInput customClassName={`form-control h-30`} groupClassName="addon input-group-sm" />}
                                />
                                {/* <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div> */}
                            </td>
                            <td>
                              {/* <div className="input-group"> */}
                                <DatePicker
                                  name="sprayerDate"
                                  selected={!!jobOrder.sprayerDate ? moment(calculateDate(jobOrder.sprayerDate, 0)).toDate() : null}
                                  onChange={(date) => onSingleDateChange(date, jobOrder.id, 'sprayerDate')}
                                  customInput={<DateCustomInput customClassName={`form-control h-30 ${highlightBackgroundClass(jobOrder.sprayerDate, 0)}`} groupClassName="addon input-group-sm" />}
                                />
                                {/* <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div> */}
                            </td>
                          </>
                        )}

                        {(columnFilters.all || columnFilters.sander) && (
                          <>
                            <td>
                              <select
                                name="sanderUserId"
                                value={getJobUserType(jobOrder.id, 'sander')}
                                onChange={(e) => onSubSelectChange(e, jobOrder.id, 'sander')}
                                className="form-control input-sm"
                              >
                                <option value=""></option>
                                {getfilteredUsers(usersData, 6).length > 0 ? getfilteredUsers(usersData, 6).map((singleUser: any) => (
                                  <option key={singleUser.id} value={singleUser.id}>{singleUser.name}</option>
                                )) : (<></>)}
                              </select>
                            </td>
                            <td>
                              <input
                                type="button"
                                value="sub"
                                className="btn btn-default btn-sm btn-custom"
                                onClick={(e) => handleSubModal(e, jobOrder.id, 6)}
                                disabled={!getJobUserType(jobOrder.id, 'sander') ? true : false}
                              />
                            </td>
                            <td>
                              {/* <div className="input-group"> */}
                                <DatePicker
                                  name="sanderDate"
                                  selected={!!jobOrder.sanderDate ? moment(calculateDate(jobOrder.sanderDate, 0)).toDate() : null}
                                  onChange={(date) => onSingleDateChange(date, jobOrder.id, 'sanderDate')}
                                  customInput={<DateCustomInput customClassName={`form-control h-30 ${highlightBackgroundClass(jobOrder.sanderDate, 0)}`} groupClassName="addon input-group-sm" />}
                                />
                                {/* <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div> */}
                            </td>
                            {/* <td>
                              <div className="input-group">
                                <DatePicker
                                  name="kdstart"
                                  selected={!!formData.deliveryDate ? null : null}
                                  onChange={(date) => onDateChange(date, 'deliveryDate')}
                                  className={`form-control h-30`}
                                />
                                <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div>
                            </td> */}
                            <td>
                              {/* <div className="input-group"> */}
                                <DatePicker
                                  name="paintDate"
                                  selected={!!jobOrder.paintStartDate ? moment(calculateDate(jobOrder.paintStartDate, 0)).toDate() : null}
                                  onChange={(date) => onSingleDateChange(date, jobOrder.id, 'paintStartDate')}
                                  customInput={<DateCustomInput customClassName={`form-control h-30 ${highlightBackgroundClass(jobOrder.paintDate, 0)}`} groupClassName="addon input-group-sm" />}
                                />
                                {/* <span className="input-group-addon">
                                  <i className="far fa-calendar-alt"></i>
                                </span>
                              </div> */}
                            </td>
                          </>
                        )}
                        

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
                      <div className="col-md-6">
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
                      <div className="col-md-3">
                        <span style={{fontSize: 'larger', fontWeight: 'bold'}}>{`Showing ${meta?.from} - ${meta?.to} records out of ${meta?.total}`}</span>
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

                  {/* @ts-ignore */}
                  { !_.isEmpty(jobOrdersData?.data) && filterFormSubmitted && (
                    <>
                      <div className="col-md-6">
                        <ReactPaginate
                          // @ts-ignore
                          pageCount={Math.ceil(jobOrdersData?.meta.total / itemPerPage)}
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
                <VerModal
                  isVerModalOpen={isVerModalOpen}
                  verJobOrderId={verJobOrderId}
                  verJobOrderActiveType={verJobOrderActiveType}
                  filterFormSubmitted={filterFormSubmitted}
                  closeVerModal={closeVerModal}
                />
                <SubModal
                  subUserType={subUserType}
                  subUserTypeId={subUserTypeId}
                  isSubModalOpen={isSubModalOpen}
                  filterFormSubmitted={filterFormSubmitted}
                  verJobOrderId={verJobOrderId}
                  verJobOrderActiveType={verJobOrderActiveType}
                  closeSubModal={closeSubModal}
                  handleInvoiceModal={handleInvoiceModal}
                />
                <InvoiceModal
                  subUserType={subUserType}
                  userTypeId={userTypeId}
                  subUserTypeId={subUserTypeId}
                  isInvoiceModalOpen={isInvoiceModalOpen}
                  filterFormSubmitted={filterFormSubmitted}
                  verJobOrderId={verJobOrderId}
                  verJobOrderActiveType={verJobOrderActiveType}
                  closeInvoiceModal={closeInvoiceModal}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// SchedulePage.propTypes = {
// jobOrders: PropTypes.object.isRequired,
// actions: PropTypes.func.isRequired
// };


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
    saveFilterSearch: bindActionCreators(JobOrderActions.saveFilterSearch, dispatch),
    getFilterSearch: bindActionCreators(JobOrderActions.getFilterSearch, dispatch), //save filter search
    updateJobOrder: bindActionCreators(JobOrderActions.updateJobOrder, dispatch),
    deleteJobOrder: bindActionCreators(JobOrderActions.deleteJobOrder, dispatch),
    getHouseLevelStock: bindActionCreators(JobOrderActions.getHouseLevelStock, dispatch),
    getUsers: bindActionCreators(UserActions.getUsers, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
    getAllHouseLevelTypes: bindActionCreators(HouseLevelTypeActions.getAllHouseLevelTypes, dispatch),
    updateJobOrderUser: bindActionCreators(JobOrderActions.updateJobOrderUser, dispatch),
    addPurchaseOrder: bindActionCreators(PurchaseOrderActions.addPurchaseOrder, dispatch),
    getAllBillingItemGroups: bindActionCreators(billingItemActions.getAllBillingItemGroups, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SchedulePage);
