import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment'
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

import PropTypes from 'prop-types';
import {
  JobOrderReduxProps,
  JobOrderList,
  JobOrder,
  Target,
} from '../../types/interfaces';
import VerModal from './VerModal';
import SubModal from './SubModal';
import InvoiceModal from './InvoiceModal';
import { filter } from 'lodash';


const SprayerPage = ({
  jobOrders,
  builders,
  users,
  houseTypes,
  cities,
  deliveredBy,
  garageStalls,
  ceilingFinishes,
  garageFinishes,
  vaults,
  options,
  billingItems,
  houseLevelTypes,
  actions
}: JobOrderList) => {

  const { id } = useParams();

  useEffect(() => {
    const jid: number = id !== undefined ? +id : 0;


    actions.getAllBuilders();
    actions.getUsers();
    actions.getAllHouseTypes();
    actions.getAllCities();
    actions.getAllDeliveredBy();
    actions.getAllGarageStalls();
    actions.getAllCeilingFinishes();
    actions.getAllGarageFinishes();
    actions.getAllVaults();
    actions.getAllOptions();
    actions.getJobOrder(jid);
    actions.getAllJobOrders();
  }, [

    actions.getAllBuilders,
    actions.getUsers,
    actions.getAllHouseTypes,
    actions.getAllCities,
    actions.getAllDeliveredBy,
    actions.getAllGarageStalls,
    actions.getAllCeilingFinishes,
    actions.getAllGarageFinishes,
    actions.getAllVaults,
    actions.getAllOptions,
    actions.getAllJobOrders,
  ]
  );


  const setFormDataState = () => {
    if (jobOrders.activeJobOrder.id !== undefined) {
      setFormData({ ...defaultState, ...jobOrders.activeJobOrder });
    }

  }
  const jid: number = id !== undefined ? +id : 0;
  useEffect(() => {
    setFormDataState();
  }, [
    jobOrders.activeJobOrder
  ]
  );


  const defaultState = {
    id: 0,
    builderId: 0,
    builderName: '',
    supervisorId: 0,
    name: '',
    houseTypeId: 0,
    address: '',
    cityId: 0,
    cityName: '',

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

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const [isVerModalOpen, setIsVerModalOpen] = React.useState(false);
  const [verJobOrderId, setVerJobOrderId] = React.useState(0);
  const [subUserTypeId, setSubUserTypeId] = React.useState({ userTypeId: 0 });
  const [subUserType, setSubUserType] = React.useState('');
  const [isSubModalOpen, setIsSubModalOpen] = React.useState(false);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);


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
    setSubUserType(jobOrderUserType);
    setSubUserTypeId(jobOrderUserId);
    // setVerFormData({ ...verFormData, id: jid });
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

    if (!date) {
      return '';
    }
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
    const currentJobOrder = jobOrdersData.filter((jobOrder: any) => jobOrder.id == jobOrderId)[0] || {};
    const { users } = currentJobOrder;

    if (users && users.length) {
      const jobUser = users.filter((jobUser: any) => jobUser.jobOrderUserType === jobOrderUserType);
      return jobUser.length ? jobUser[0].id : 0;
    }
    return 0;
  }

  const { jobOrders: jobOrdersData } = jobOrders;
  const { builders: buildersData } = builders;
  const { users: usersData } = users;
  const { houseTypes: houseTypesData } = houseTypes;
  const { cities: citiesData } = cities;
  const { deliveredBy: deliveredByData } = deliveredBy;
  const { garageStalls: garageStallsData } = garageStalls;
  const { ceilingFinishes: ceilingFinishesData } = ceilingFinishes;
  const { garageFinishes: garageFinishesData } = garageFinishes;
  const { vaults: vaultsData } = vaults;
  const { options: optionsData } = options;
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;

  const getJobOrderCeilingFinish = (ceilingFinishId: any) => {
    const ceilingFinish = ceilingFinishesData.filter((cf) => cf.id === parseInt(ceilingFinishId, 10));
    return (
      <>
        {ceilingFinish.length > 0 ? ceilingFinish[0].name : ''}
      </>
    );
  };

  return (
    <>
      <div className="clear pad-40" />
      <div className="">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">

              <h4 className="text_blue">
                Sprayer / Sander
              </h4>
              <span>{moment().format('MM/DD/YYYY')}</span>



              <div className="clear pad-5" />

              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>
                      </th>
                      <th className="w-150">
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
                      {/* <th>
                        12'
                      </th>
                      <th>
                        54"
                      </th>
                      <th>
                        High
                      </th>
                      <th>
                        Gar
                      </th>
                      <th>
                        Gar H
                      </th> */}
                      <th>
                        Sprayer
                      </th>
                      <th>

                      </th>
                      <th className="w-140">
                        Date mm/dd/yy
                      </th>
                      <th>
                        Sander
                      </th>
                      <th>

                      </th>
                      <th className="w-140">
                        Date mm/dd/yy
                      </th>
                      <th className="w-140">
                        Scrape mm/dd/yy
                      </th>
                      <th className="w-140">
                        Paint mm/dd/yy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobOrdersData.length > 0 ? jobOrdersData.map((jobOrder, i) => (
                      <tr key={jobOrder.id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>
                          <a href={`/job-orders/${jobOrder.id}`} className="btn btn-default btn-custom mr-10 ml-10">
                            Edit
                          </a>
                          <button
                            type="button"
                            className="btn btn-default btn-custom mr-10"
                            onClick={(e) => handleVerModal(e, jobOrder.id)}
                          >
                            Ver
                          </button>
                          <input type="checkbox" />
                        </td>
                        <td>
                          <strong>{jobOrder.address}</strong>
                        </td>
                        <td>
                          {getJobOrderCeilingFinish(jobOrder.ceilingFinishId)}
                        </td>
                        <td>
                          {jobOrder.isVerified ? (<i className="fa fa-check fa-lg" />) : (<></>)}

                        </td>
                        {/* <td>
                          182s
                        </td>
                        <td>
                          58s
                        </td>
                        <td>
                          0s
                        </td>
                        <td>
                          32s
                        </td>
                        <td>
                          0s
                        </td> */}

                        <td>
                          <select
                            name="sprayerUserId"
                            value={getJobUserType(jobOrder.id, 'sprayer')}
                            onChange={(e) => onSubSelectChange(e, jobOrder.id, 'sprayer')}
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
                            onClick={(e) => handleSubModal(e, jobOrder.id, 5)}
                            disabled={!getJobUserType(jobOrder.id, 'sprayer') ? true : false}
                          />
                        </td>
                        <td>
                          <div className="input-group">
                            <DatePicker
                              name="kdstart"
                              selected={!!jobOrder.sprayerDate ? moment(calculateDate(jobOrder.sprayerDate, 0)).toDate() : null}
                              onChange={(date) => onDateChange(date, 'deliveryDate')}
                              className={`form-control h-30 ${highlightBackgroundClass(jobOrder.sprayerDate, 0)}`}
                            />
                            <span className="input-group-addon">
                              <i className="far fa-calendar-alt"></i>
                            </span>
                          </div>
                        </td>
                        <td>
                          <select
                            name="sanderUserId"
                            value={getJobUserType(jobOrder.id, 'sander')}
                            onChange={(e) => onSubSelectChange(e, jobOrder.id, 'sander')}
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
                            onClick={(e) => handleSubModal(e, jobOrder.id, 6)}
                          />
                        </td>
                        <td>
                          <div className="input-group">
                            <DatePicker
                              name="kdstart"
                              selected={!!jobOrder.sanderDate ? moment(calculateDate(jobOrder.sanderDate, 0)).toDate() : null}
                              onChange={(date) => onDateChange(date, 'deliveryDate')}
                              className={`form-control h-30 ${highlightBackgroundClass(jobOrder.sanderDate, 0)}`}
                            />
                            <span className="input-group-addon">
                              <i className="far fa-calendar-alt"></i>
                            </span>
                          </div>
                        </td>
                        <td>
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
                        </td>
                        <td>
                          <div className="input-group">
                            <DatePicker
                              name="kdstart"
                              selected={!!jobOrder.paintDate ? moment(calculateDate(jobOrder.paintDate, 0)).toDate() : null}
                              onChange={(date) => onDateChange(date, 'deliveryDate')}
                              className={`form-control h-30 ${highlightBackgroundClass(jobOrder.paintDate, 0)}`}
                            />
                            <span className="input-group-addon">
                              <i className="far fa-calendar-alt"></i>
                            </span>
                          </div>
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
                {jobOrdersData.length < 1}
                {/* <ul className="pagination center-block">
                  <li><a href="#">«</a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#">»</a></li>
                </ul> */}
                <VerModal
                  isVerModalOpen={isVerModalOpen}
                  verJobOrderId={verJobOrderId}
                  closeVerModal={closeVerModal}
                />
                <SubModal
                  subUserType={subUserType}
                  subUserTypeId={subUserTypeId}
                  isSubModalOpen={isSubModalOpen}
                  verJobOrderId={verJobOrderId}
                  closeSubModal={closeSubModal}
                  handleInvoiceModal={handleInvoiceModal}
                />
                <InvoiceModal
                  subUserTypeId={subUserTypeId}
                  isInvoiceModalOpen={isInvoiceModalOpen}
                  verJobOrderId={verJobOrderId}
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

SprayerPage.propTypes = {
  // jobOrders: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: JobOrderReduxProps) => ({
  jobOrders: state.jobOrders,
  builders: state.builders,
  users: state.users,
  houseTypes: state.houseTypes,
  cities: state.cities,
  deliveredBy: state.deliveredBy,
  garageStalls: state.garageStalls,
  ceilingFinishes: state.ceilingFinishes,
  garageFinishes: state.garageFinishes,
  vaults: state.vaults,
  options: state.options,
  billingItems: state.billingItems,
  houseLevelTypes: state.houseLevelTypes,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getAllJobOrders: bindActionCreators(JobOrderActions.getAllJobOrders, dispatch),
    getJobOrder: bindActionCreators(JobOrderActions.getJobOrder, dispatch),
    addJobOrder: bindActionCreators(JobOrderActions.addJobOrder, dispatch),
    updateJobOrder: bindActionCreators(JobOrderActions.updateJobOrder, dispatch),
    deleteJobOrder: bindActionCreators(JobOrderActions.deleteJobOrder, dispatch),
    getHouseLevelStock: bindActionCreators(JobOrderActions.getHouseLevelStock, dispatch),
    getAllBuilders: bindActionCreators(BuilderActions.getAllBuilders, dispatch),
    getUsers: bindActionCreators(UserActions.getUsers, dispatch),
    getAllHouseTypes: bindActionCreators(HouseTypeActions.getAllHouseTypes, dispatch),
    getAllCities: bindActionCreators(CityActions.getAllCities, dispatch),
    getAllDeliveredBy: bindActionCreators(DeliveredByActions.getAllDeliveredBy, dispatch),
    getAllGarageStalls: bindActionCreators(GarageStallActions.getAllGarageStalls, dispatch),
    getAllCeilingFinishes: bindActionCreators(CeilingFinishActions.getAllCeilingFinishes, dispatch),
    getAllGarageFinishes: bindActionCreators(GarageFinishActions.getAllGarageFinishes, dispatch),
    getAllVaults: bindActionCreators(VaultActions.getAllVaults, dispatch),
    getAllOptions: bindActionCreators(OptionActions.getAllOptions, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
    getAllHouseLevelTypes: bindActionCreators(HouseLevelTypeActions.getAllHouseLevelTypes, dispatch),
    updateJobOrderUser: bindActionCreators(JobOrderActions.updateJobOrderUser, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SprayerPage);
