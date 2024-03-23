import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';
import moment from 'moment'
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import PrintSchedule from './PrintSchedule';
import _ from "lodash";

const verModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '500px',
    overlfow: 'scroll',
    width: '70%',
  }
};

const SubModalPrint = ({
  isinvoiceModalOpen,
  verJobOrderId,
  filterFormSubmitted,
  subUserType,
  subUserTypeId,
  closeinvoiceModal,
  verJobOrderActiveType,
  jobOrders,
  billingItems,
  houseLevelTypes,
  users,
  verDefault,
  verificationFormData,
  purchaseOrderFormData,
  subFormData,
  actions
}: any) => {





  const defaultSubForm = {
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

    houseLevels: [
      {
        houseLevelTypeId: 0,
        rowOrder: 1,
        billingItems: [{
          billingItemId: 0,
          itemValue: '0',
          columnOrder: 1
        }]
      }
    ],

    options: [],
    additionalInfo: '',

    hangerStartDate: '',
    hangerEndDate: '',
    scrapDate: '',
    taperStartDate: '',
    taperEndDate: '',
    sprayerDate: '',
    sanderDate: '',
    paintDate: '',

    directions: '',
    jobStatus: '',
    gigStatus: '',
    status: 1,
  };


  const verDefaultState = [
    {
      houseLevelTypeId: 0,
      rowOrder: 1,
      billingItems: [{
        billingItemId: 0,
        itemValue: '0',
        columnOrder: 1
      }]
    }
  ];

  const verificationDefaultState = {
    jobOrderId: 0,
    houseLevelStock: [
      {
        houseLevelTypeId: 0,
        rowOrder: 1,
        billingItems: [{
          billingItemId: 0,
          itemValue: '0',
          columnOrder: 1,
          remainingValue: '0',
          totalValue: 0
        }]
      }
    ]
  };





  const mailDefaultState = {
    id: 0,
    userId: 0,
    emailTo: '',
    emailMessage: '',
  };

  const emptyList: any = [];

  const { users: usersData } = users;
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;
  const verJobOrderData = filterFormSubmitted && !_.isEmpty(jobOrders.jobOrders.data) ? jobOrders.jobOrders.data.filter((jobOrder: any) => jobOrder.id == verJobOrderId) : jobOrders.jobOrders.filter((jobOrder: any) => jobOrder.id == verJobOrderId);

  const singleJobOrderData = verJobOrderData.length ? verJobOrderData[0] : [];

  const jobHouseLevels = verJobOrderData.length > 0 ? verJobOrderData[0].houseLevels : verDefaultState;
  const verificationDefault = verificationDefaultState;



  const renderBillingItemsTotalListRow = () => {
    const items: any = [0, 0, 0, 0, 0, 0, 0, 0];
    verificationFormData.houseLevelStock.map((singleLevel: any, i: any) => {
      for (let i = 1; i <= 8; i++) {
        const value = singleLevel.billingItems.filter((item: any) => {
          return billingItemsData.
            some((singleItem: any) => item.columnOrder == i)
        });
        const itemValue = value.length ? value[0].totalValue : 0;
        items[i - 1] = parseInt(items[i - 1], 10) + parseInt(itemValue, 10);
      }
    });

    return (
      <>
       <tr>
        {items.map((item: any, i: any) => {
          const dataFull = getSelectedBillingItem(i + 1);
          console.log('data item', dataFull);
          if (dataFull !== '' && item > 0 && (dataFull[verJobOrderActiveType] == 1 || dataFull[verJobOrderActiveType] == undefined)) {
            return ( <th style={{ width: '85px', border: 'none', color: 'blue' }}>{dataFull.billingItemName}</th>);
          } else {
            return (<></>)
          }
        })}
      </tr>
      <tr>
        {items.map((item: any, i: any) => {
          const dataFull = getSelectedBillingItem(i + 1);
          console.log('data item', dataFull);
          if (dataFull !== '' && item > 0 && (dataFull[verJobOrderActiveType] == 1 || dataFull[verJobOrderActiveType] == undefined)) {
            return (<td style={{ textAlign: 'center', color: '#000', padding: '4px 2px 4px 2px', border: '1px solid #606060' }}>{item}</td>);
          } else {
            return (<></>)
          }
        })}
        </tr>

      </>
    );
  }


  const renderBillingItemsSelectList = () => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      items.push(<>{renderBillingItemsHeader(i)}</>);
    }
    return items;
  };
  
 
  const getSelectedBillingItem = (index: number) => {
    const items = verDefault.filter((item: any) => {
      return item.billingItems.some((singleItem: any) => singleItem.columnOrder == index)
    }).map((item: any) => {
      let singleItem = Object.assign({}, item);
      return singleItem.billingItems.filter((subItem: any) => subItem.columnOrder == index);
    }).flat();
    // console.log('raza here for you');
    // console.log(items);
    const itemId = items.length > 0 ? items[0].billingItemId : 0;
    const itemName = billingItemsData.filter((item: any) => item.id == itemId);
    return itemName.length > 0 ? itemName[0] : '';
  }

  const renderBillingItemsHeader = (index: number) => {
    const dataFull = getSelectedBillingItem(index);
    
    if (dataFull !== '' && (dataFull[verJobOrderActiveType] == 1 || dataFull[verJobOrderActiveType] === undefined)) {
      return (
        <th style={{ width: '85px', border: 'none', color: 'blue' }}>{dataFull.billingItemName}</th>
      )
    } else {
      return (
        <></>
      );
    }
  }

  const getfilteredCurrentUserName = (usersData: any) => {
    const newData = usersData
      .filter((singleUser: any) => singleUser.id == subUserTypeId);
    return newData.length ? newData[0].name : '';
  }

  let startDateValue = '';
  let endDateValue = '';
  const getSubUserTypeLabel = () => {
    let userTypeLabel = '';
    if (subUserType === 'hanger') {
      userTypeLabel = 'Hanging';
      startDateValue = moment(singleJobOrderData.hangerStartDate).format('dddd, MMMM DD, YYYY');
      endDateValue = moment(singleJobOrderData.hangerEndDate).format('dddd, MMMM DD, YYYY');
    } else if (subUserType === 'taper') {
      userTypeLabel = 'Taping';
      startDateValue = moment(singleJobOrderData.taperStartDate).format('dddd, MMMM DD, YYYY');
      endDateValue = moment(singleJobOrderData.taperEndDate).format('dddd, MMMM DD, YYYY');
    } else if (subUserType === 'sprayer') {
      userTypeLabel = 'Spraying';
      startDateValue = moment(singleJobOrderData.sprayerDate).format('dddd, MMMM DD, YYYY');
      endDateValue = '';
    } else if (subUserType === 'sander') {
      userTypeLabel = 'Sanding';
      startDateValue = moment(singleJobOrderData.sanderDate).format('dddd, MMMM DD, YYYY');
      endDateValue = '';
    }
    return userTypeLabel;
  }
  const getActiveTypeDirection = () => {
    if (subFormData && subFormData.directions) {
      const currentDirection = subFormData.directions.filter((direction: any) => direction.userType === subUserType);
      return currentDirection.length ? currentDirection[0].directions : '';
    }
    return '';
  }

  return (
    <>
      <div style={{ width: '97%', margin: '12px', padding: '5px', border: '1px solid #606060', fontFamily: 'Arial' }}>
        <div style={{ textAlign: 'center', borderBottom: '#000 1px solid', marginTop: '-10px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }}>Schoenberger Drywall, Inc.</h2>
          <p style={{ textAlign: 'center',  }}>17180 Adelmann St. SE<br />Prior Lake, MN 55372<br />Phone: 952-447-1078</p>
        </div>
        <div>
        <div style={{ padding: '5px 5px 0px 5px' }}>
          <h3 style={{ textAlign: 'center', marginTop: '5px', fontSize: '18px' }}>Sub-Contract</h3>
        </div>
        <div style={{ padding: '0px' }}>
          <h3 style={{ textAlign: 'center', marginTop: '0px', fontSize: '20px' }}>PURCHASE ORDER</h3>
        </div>

          <div style={{ borderBottom: '#606060 1px solid', paddingTop: '5px', paddingBottom: '0px' }}></div>

          <div>
            <div>
              <table style={{ borderCollapse: 'collapse', width: '100%', border: '#fff 0px solid' }}>
                <tr style={{}}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px', paddingTop: '10px', width: '220px' }} >
                    { getSubUserTypeLabel() || '' } Sub Contractor:
                  </td>
                  <td style={{ width: '400px', paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000', paddingTop: '10px' }}>
                    {getfilteredCurrentUserName(usersData)}
                  </td>
                </tr>
                <tr style={{}}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Job Address:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000' }}>{singleJobOrderData.address || ''}, {singleJobOrderData.cityName || ''}</td>
                </tr>
                <tr style={{}}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Ceining Finish:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000' }}>{singleJobOrderData.ceilingFinishName || ''}</td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Building Contractor:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000' }}>{singleJobOrderData.builderName}</td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Work Start Date:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000' }}>{startDateValue}</td>
                </tr>

                <tr style={{display: endDateValue ? 'table-row' : 'none'}}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Work to be Completed:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000' }}>{endDateValue}</td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Verified Sheets:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000' }}>

                    <table style={{ borderCollapse: 'collapse', width: '100%', border: '#fff 0px solid' }}>
                     
                        {renderBillingItemsTotalListRow()}
                    </table>
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #606060' }}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Directions to the Job:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000' }}>
                    <textarea
                      className="form-control"
                      rows={3}
                      name="directions"
                      value={getActiveTypeDirection()}
                    ></textarea>
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #606060' }}>
                  <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'center', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px', paddingTop: '30px' }}>
                    Signature
                  </td>
                  <td style={{ paddingLeft: '10px', textAlign: 'left', paddingBottom: '10px', paddingTop: '30px' }}>
                    <hr style={{ width: '250px', float: 'left' }} />
                  </td>
                </tr>

              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  jobOrders: state.jobOrders,
  billingItems: state.billingItems,
  houseLevelTypes: state.houseLevelTypes,
  users: state.users,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    sendPurchaseOrderEmail: bindActionCreators(JobOrderActions.sendPurchaseOrderEmail, dispatch),
    updateJobOrder: bindActionCreators(JobOrderActions.updateJobOrder, dispatch),
    getHouseLevelStock: bindActionCreators(JobOrderActions.getHouseLevelStock, dispatch),
    updateHouseLevelStock: bindActionCreators(JobOrderActions.updateHouseLevelStock, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
    getAllHouseLevelTypes: bindActionCreators(HouseLevelTypeActions.getAllHouseLevelTypes, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubModalPrint);

