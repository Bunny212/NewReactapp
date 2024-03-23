import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment'
// import { useReactToPrint } from 'react-to-print';
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
// import Print from '../common/Print';

import PropTypes from 'prop-types';
import {
  JobOrderReduxProps,
  JobOrderList,
  JobOrder,
  Target,
} from '../../types/interfaces';


const DryWallPrint = ({
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

  // props.id
  // console.log('soooooo+++++++++++=', id);
  // console.log('---------', jobOrders);
  // console.log(props.id);

  useEffect(() => {
    // if(id !== undefined) {
    // console.log(jobOrders);
    const jid: number = id !== undefined ? +id : 0;
    //   actions.getJobOrder(jid);
    //   console.log('yes working');
    // }

    // actions.getAllJobOrders();
    // actions.getAllBuilders();
    // actions.getUsers();
    // actions.getAllHouseTypes();
    // actions.getAllCities();
    // actions.getAllDeliveredBy();
    // actions.getAllGarageStalls();
    // actions.getAllCeilingFinishes();
    // actions.getAllGarageFinishes();
    // actions.getAllVaults();
    // actions.getAllOptions();
    // actions.getJobOrder(jid);
  }, [
    // actions.getAllJobOrders,
    // actions.getAllBuilders,
    // actions.getUsers,
    // actions.getAllHouseTypes,
    // actions.getAllCities,
    // actions.getAllDeliveredBy,
    // actions.getAllGarageStalls,
    // actions.getAllCeilingFinishes,
    // actions.getAllGarageFinishes,
    // actions.getAllVaults,
    // actions.getAllOptions,
    // actions.getJobOrder,
  ]
  );

  // // interface ParamTypes {
  // //   id: string
  // // }
  // let { id } = useParams();
  // console.log(id);
  // // var jid: number = +id;
  // // console.log(this.props.params.id);

  const setFormDataState = () => {
    if (jobOrders.activeJobOrder.id !== undefined) {
      setFormData({ ...defaultState, ...jobOrders.activeJobOrder });
    }

  }
  const jid: number = id !== undefined ? +id : 0;
  useEffect(() => {
    // console.log(typeof id);
    // const jid = parseInt(id);
    // const jid: number = parseInt(id, 10);
    // const jid: number = id !== undefined ? +id : 0;
    // if(jid) {
    // //   const jid: number = +id;
    //   actions.getJobOrder(jid);
    // }
    setFormDataState();
    //   console.log('yes working');
    // }
  }, [
    jobOrders.activeJobOrder,
    // actions.updateJobOrder
    // actions.getJobOrder
  ]
  );

  // useEffect(() => {
  //   console.log('9999999999999999999999999999999999');
  //   if(jid) {
  //     actions.getJobOrder(jid);
  //     setFormDataState();
  //   }
  // }, [
  //     actions.updateJobOrder
  //   ]
  // );

  // console.log(id);
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
    additionalInfo: '',
    jobStatus: '',
    gigStatus: '',

    status: 1,
  };

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

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
    setFormData({ ...formData, [name]: moment(date).format('YYYY-MM-DD') });
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

  const getBuilderName = (builderId: any, buildersData: any) => {
    const builder = buildersData.filter((singleBuilder: any) => singleBuilder.id === builderId);
    const builderName = builder.length ? builder[0].name : '';
    return (
      <>
        {builderName}
      </>
    );
  };

  const getSupervisorName = (supervisorId: any, usersData: any) => {
    const supervisor = usersData.filter((singleUser: any) => singleUser.id === supervisorId);
    const supervisorName = supervisor.length ? supervisor[0].name : '';
    return (
      <>
        {supervisorName}
      </>
    );
  };

  const getCityName = (cityId: any, citiesData: any) => {
    const city = citiesData.filter((singleCity: any) => singleCity.id === cityId);
    const cityName = city.length ? city[0].name : '';
    return (
      <>
        {cityName}
      </>
    );
  };

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

  // const componentRef:any = useRef();

  // const handlePrintClick = () => {
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });
  // const handlePrint = 'test';
  // console.log('yes');
  // return handlePrint;
  // };
  // const Example = () => {


  // return (
  //   <div>
  //     <ComponentToPrint ref={componentRef} />
  //     <button onClick={handlePrint}>Print this out!</button>
  //   </div>
  // );
  // };

  return (
    <>
      <div style={{ width: '97%', margin: '12px', padding: '5px', border: '1px solid #606060', fontFamily: 'Arial' }}>
        <div style={{ textAlign: 'center', borderBottom: '#000 1px solid', marginTop: '-10px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }}>Schoenberger Drywall, Inc.</h2>
          <p style={{ textAlign: 'center',  }}>17180 Adelmann St. SE<br />Prior Lake, MN 55372<br />Phone: 952-447-1078<br /><a href="#" style={{ color: '#000' }}>repairs@schoenbergerdrywall.com</a></p>
        </div>

        <div style={{ padding: '0px', borderBottom: '#606060 1px solid' }}>
          <h3 style={{ textAlign: 'center', marginTop: '5px', fontSize: '20px' }}>
            SERVICE ORDER DRYWALL FINAL
          </h3>
        </div>

        <div style={{ padding: '5px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tr>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Customer Name: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000', border: '1px solid #606060' }}>
                {getBuilderName(formData.builderId, buildersData)}
              </td>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Today's Date: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000', border: '1px solid #606060' }}>
                {moment().format("MM/DD/YYYY")}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Requested By: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000', border: '1px solid #606060' }}>
                {getSupervisorName(formData.supervisorId, usersData)}
              </td>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Date Needed: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000', border: '1px solid #606060' }}>
                {!!formData.walkthroughDate ? moment(formData.walkthroughDate).format("MM/DD/YYYY") : null}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Job Address: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000', border: '1px solid #606060' }}>
                {formData.address || ''}, {formData.cityName || ''}
              </td>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>City: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000', border: '1px solid #606060' }}>
                {getCityName(formData.cityId, citiesData)}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Owner Name: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000', border: '1px solid #606060' }}>{formData.name || ''}</td>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Phone: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000', border: '1px solid #606060' }}></td>
            </tr>
          </table>
        </div>

        <div style={{ borderBottom: '#606060 1px solid', padding: '5px' }}>
          <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#aa4444', marginTop: '5px' }}>Billable Item:</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tr>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Yes: &nbsp;</td>
              <td style={{ textAlign: 'left', paddingLeft: '5px', color: '#000' }}><input type="checkbox" /></td>
              <td style={{ textAlign: 'right', paddingRight: '10px', color: '#000' }}></td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000' }}></td>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>No: &nbsp;</td>
              <td style={{ textAlign: 'left', paddingLeft: '5px', color: '#000' }}><input type="checkbox" /></td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Quote / Bid: &nbsp;</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000' }}></td>
              <td style={{ textAlign: 'right', paddingRight: '10px', color: '#000' }}>Time &amp; Materials</td>
              <td style={{ textAlign: 'left', padding: '5px', color: '#000' }}></td>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Extras: &nbsp;</td>
              <td style={{ textAlign: 'left', paddingLeft: '10px', color: '#000' }}>Materials Supplied</td>
            </tr>
          </table>
        </div>


        <div style={{ borderBottom: '#606060 1px solid', padding: '5px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tr>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Bill To: &nbsp;</td>
              <td style={{ textAlign: 'left', paddingLeft: '10px', color: '#000' }}></td>
              <td style={{ textAlign: 'right', paddingRight: '10px', color: '#000' }}> &nbsp;</td>
              <td style={{ textAlign: 'left', paddingLeft: '10px', color: '#000' }}></td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right', paddingRight: '5px', color: 'blue', width: '21%', fontWeight: 'bold' }}>Comments: &nbsp;</td>
              <td style={{ textAlign: 'left', paddingLeft: '10px', color: '#000' }}></td>
              <td style={{ textAlign: 'right', paddingRight: '10px', color: '#000' }}>Lock Box &nbsp;</td>
              <td style={{ textAlign: 'left', paddingLeft: '10px', color: '#000' }}></td>
            </tr>
          </table>
        </div>
        <div style={{ borderBottom: '#606060 1px solid', padding: '5px', height: '140px' }}>
          <h3 style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold', color: '#aa4444', marginTop: '5px' }}>Service Wanted / Instructions / Location:</h3>
          <h2 style={{ textAlign: 'center', fontWeight: 500, color: '#999', fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>DRYWALL FINAL</h2>
        </div>
        <div style={{ borderBottom: '#606060 1px solid', padding: '5px', height: '140px' }}>
          <h3 style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold', color: '#aa4444', marginTop: '5px' }}>Materials Needed:</h3>
        </div>
        <div style={{ borderBottom: '#606060 1px solid', padding: '5px', height: '140px' }}>
          <h3 style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold', color: '#aa4444', marginTop: '5px' }}>Date Scheduled &amp; Technician:</h3>
        </div>
        <div style={{ padding: '10px', height: '140px' }}>
          <h3 style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold', color: '#aa4444', marginTop: '5px' }}>Date Completed:</h3>
        </div>
      </div>
    </>
  );
};

DryWallPrint.propTypes = {
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
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DryWallPrint);
