import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';
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

const invoiceModalPrint = ({
  isinvoiceModalOpen,
  verJobOrderId,
  subUserType,
  filterFormSubmitted ,
  closeinvoiceModal,
  jobOrders,
  billingItems,
  houseLevelTypes,
  subUserTypeId,
  verDefault,
  verificationFormData,
  purchaseOrderFormData,
  users,
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

  // console.log(verJobOrderId);
  // console.log(jobOrders);
  const { users: usersData } = users;
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;
  const verJobOrderData = filterFormSubmitted && !_.isEmpty(jobOrders.jobOrders.data) ? jobOrders.jobOrders.data.filter((jobOrder: any) => jobOrder.id == verJobOrderId) : jobOrders.jobOrders.filter((jobOrder: any) => jobOrder.id == verJobOrderId);

  const singleJobOrderData = verJobOrderData.length ? verJobOrderData[0] : [];

  const jobHouseLevels = verJobOrderData.length > 0 ? verJobOrderData[0].houseLevels : verDefaultState;
  // const verDefault = jobHouseLevels.length > 0 ? jobHouseLevels : verDefaultState;
  const verificationDefault = verificationDefaultState;
  // console.log(verJobOrderData[0]);
  // console.log(verDefault);
  // const [verFormData, setVerFormData] = useState(verDefault);
  // const [verificationFormData, setVerificationFormData] = useState(verificationDefault);
  // const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);
  // const [subSubmitted, setSubSubmitted] = useState(false);
  // const [subFormData, setSubFormData] = useState(defaultSubForm);

  // const [subFormData, setSubFormData] = useState(defaultSubForm);


  // const { users: usersData } = users;
  // const { activePurchaseOrder: activePurchaseOrderData } = purchaseOrders;

  // const [isEditInvoice, setIsEditInvoice] = useState(false);
  // const [editedItemsList, setEditedItemsList] = useState(emptyList);
  // const [purchaseOrderFormData, setPurchaseOrderFormData] = useState(activePurchaseOrderData);


  // useEffect(() => {

  //   setPurchaseOrderFormData({ ...purchaseOrderFormData, ...activePurchaseOrderData });

  // }, [purchaseOrders.activePurchaseOrder])











  const getSelectedBillingItemField = (index: number, rowIndex: number) => {
    const x = { ...jobOrders.activeHouseLevelStock };
    const items = x.houseLevelStock.filter((item: any) => {
      return item.rowOrder == rowIndex && item.billingItems.some((singleItem: any) => singleItem.columnOrder == index)
    }).map((item: any) => {
      let singleItem = Object.assign({}, item);
      return item.rowOrder == rowIndex && singleItem.billingItems.filter((subItem: any) => subItem.columnOrder == index);
    }).flat();

    const itemObj = items.length > 0 ? items[0] : false;
    return itemObj;
  }


  const getSelectedBillingItem = (index: number) => {
    const items = verDefault.filter((item: any) => {
      return item.billingItems.some((singleItem: any) => singleItem.columnOrder == index)
    }).map((item: any) => {
      let singleItem = Object.assign({}, item);
      return singleItem.billingItems.filter((subItem: any) => subItem.columnOrder == index);
    }).flat();

    // console.log(items);
    // console.log('Billing items data');
    // console.log(billingItemsData);
    const itemId = items.length > 0 ? items[0].billingItemId : 0;
    const itemName = billingItemsData.filter((item: any) => item.id == itemId);
    // console.log(itemName);


    return itemName.length > 0 ? itemName[0].billingItemName : 'N/A';
  }

  const renderBillingItemsHeader = (index: number) => {
    return (
      <>
        { getSelectedBillingItem(index)}
      </>
    );
  }


  const getGrandTotal = () => {
    const total = parseFloat((purchaseOrderFormData.total - purchaseOrderFormData.discount).toFixed(2));
    return total;
  };


  const renderBillingItemsTotalListRow = () => {
    const items: any = [0, 0, 0, 0, 0, 0];
    const itemsList: any = [];
    verificationFormData.houseLevelStock.map((singleLevel: any, i: any) => {
      for (let i = 1; i <= 8; i++) {
        const value = singleLevel.billingItems.filter((item: any) => {
          return billingItemsData.
            some((singleItem: any) => item.columnOrder == i)
        });
        const itemValue = value.length ? value[0].totalValue : 0;
        items[i - 1] = parseInt(items[i - 1], 10) + parseInt(itemValue, 10);

        if (value.length > 0) {
          itemsList.push({
            ...value[0]
          });
        }
      }
    });


    if (!(purchaseOrderFormData && purchaseOrderFormData.id !== undefined)) {
      return (<></>);
    }

    return (
      <>
        {purchaseOrderFormData && purchaseOrderFormData.items && purchaseOrderFormData.items
           .filter((purchaseOrderItem: any) => purchaseOrderItem.quantity > 0 && purchaseOrderItem.unitPrice > 0)
           .map((purchaseOrderItem: any, i: any) => {
          return (
            <tr key={purchaseOrderItem.id}>
              <td style={{ textAlign: 'center', color: '#000', padding: '4px 2px 4px 2px', border: '1px solid #606060' }}>{i + 1}</td>
              <td style={{ textAlign: 'center', color: '#000', padding: '4px 2px 4px 2px', border: '1px solid #606060' }}>{purchaseOrderItem.billingItemName}</td>
              <td style={{ textAlign: 'center', color: '#000', padding: '4px 2px 4px 2px', border: '1px solid #606060' }}>{purchaseOrderItem.quantity}</td>
              <td style={{ textAlign: 'center', color: '#000', padding: '4px 2px 4px 2px', border: '1px solid #606060' }}>
                ${parseFloat(purchaseOrderItem.unitPrice).toFixed(2)}
              </td>
              <td style={{ textAlign: 'center', color: '#000', padding: '4px 2px 4px 2px', border: '1px solid #606060' }}>${ parseFloat(purchaseOrderItem.totalPrice).toFixed(2)}</td>
            </tr>)
        })}
      </>
    );
  }

  const getfilteredCurrentUserName = (usersData: any) => {
    const newData = usersData
      .filter((singleUser: any) => singleUser.id == subUserTypeId);
    return newData.length ? newData[0].name : '';
  }

  const getSubUserTypeLabel = () => {
    let userTypeLabel = '';
    if (subUserType === 'hanger') {
      userTypeLabel = 'Hanging';
    } else if (subUserType === 'taper') {
      userTypeLabel = 'Taping';
    } else if (subUserType === 'sprayer') {
      userTypeLabel = 'Spraying';
    } else if (subUserType === 'sander') {
      userTypeLabel = 'Sanding';
    }
    return userTypeLabel;
  }

  return (
    <>
      <div style={{ width: '97%', margin: '12px', padding: '5px', border: '1px solid #606060', fontFamily: 'Arial' }}>
        <div style={{ textAlign: 'center', borderBottom: '#000 1px solid', marginTop: '-10px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }}>Schoenberger Drywall, Inc.</h2>
          <p style={{ textAlign: 'center',  }}>17180 Adelmann St. SE<br />Prior Lake, MN 55372<br />Phone: 952-447-1078</p>
        </div>

        <div>
        <div style={{ padding: '0px', borderBottom: '#606060 1px solid' }}>
          <h3 style={{ textAlign: 'center', marginTop: '5px', fontSize: '20px' }}>INVOICE</h3>
        </div>
        <div style={{ padding: '5px 5px 0px 5px' }}>
          <div style={{ float: 'left' }}>
            <h3 style={{  marginTop: '5px', fontSize: '18px' }}>Payment Status: <b>{purchaseOrderFormData.isPaid == 1 ? "Paid": "Unpaid"}</b></h3>
            {purchaseOrderFormData.isPaid == 1 &&
            (<h3 style={{ marginTop: '5px', fontSize: '18px' }}>Invoice Paid Date: {moment(purchaseOrderFormData.paidAt).format('dddd, MMMM DD, YYYY')}</h3>
            )}
          </div>
          <h3 style={{ float: 'right', marginTop: '5px', fontSize: '18px' }}>Creation Date: {moment(purchaseOrderFormData.invoiceDate).format('dddd, MMMM DD, YYYY')}</h3>
        </div>

        <div style={{ borderBottom: '#606060 1px solid', paddingTop: '5px', paddingBottom: '0px' }}></div>

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
            <tr style={{ borderBottom: '1px solid #606060' }}>
              <td style={{ borderRight: '1px solid #606060', fontSize: '16px', color: 'blue', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                Building Contractor:
              </td>
              <td style={{ paddingLeft: '10px', paddingBottom: '10px', fontSize: '16px', color: '#000' }}>{singleJobOrderData.builderName}</td>
            </tr>
          </table>
        </div>


          <div>
            <div>
              <table style={{ borderCollapse: 'collapse', width: '100%', border: '#fff 0px solid' }}>

                <tr style={{ borderBottom: '1px solid #606060' }}>
                  <th style={{ textAlign: 'center', paddingRight: '5px', border: 'none', color: 'blue', width: '20px' }}>SINo</th>
                  <th style={{ textAlign: 'center', paddingRight: '5px', border: 'none', color: 'blue', width: '' }}>Item Description</th>
                  <th style={{ textAlign: 'center', paddingRight: '5px', border: 'none', color: 'blue', width: '21%' }}>Quantity</th>
                  <th style={{ textAlign: 'center', paddingRight: '5px', border: 'none', color: 'blue', width: '21%' }}>Unit Price</th>
                  <th style={{ textAlign: 'center', paddingRight: '5px', border: 'none', color: 'blue', width: '18%' }}>Price</th>
                </tr>
                <tr style={{ borderBottom: '1px solid #606060' }}>
                  {renderBillingItemsTotalListRow()}
                </tr>
                <tr style={{ borderBottom: '1px solid #606060' }}>
                  <td colSpan={3} style={{ textAlign: 'right', color: 'blue', padding: '4px 2px 4px 2px' }}>
                    <strong>Discount:</strong>
                  </td>
                  <td style={{ textAlign: 'center', padding: '4px 2px 4px 2px' }}>
                    {`${purchaseOrderFormData.discountPercentage} %` || `0.00 %`}
                  </td>
                  <td style={{ textAlign: 'center', padding: '4px 2px 4px 2px' }}>
                    {purchaseOrderFormData && purchaseOrderFormData.discount ? (
                      <>
                        ${`( ${purchaseOrderFormData.discount} )` || `( $0.00 )`}
                      </>
                    ) : (
                        <>{`( $0.00 )`}</>
                      )}
                  </td>
                </tr>

                <tr style={{}}>
                  <td colSpan={4} style={{ textAlign: 'right', color: 'blue', padding: '4px 2px 4px 2px' }}>
                    <strong>Grand Total:</strong>
                  </td>
                  <td style={{ textAlign: 'center', padding: '4px 2px 4px 2px' }}>
                    {purchaseOrderFormData && purchaseOrderFormData.total ? (
                      <>
                        ${getGrandTotal().toFixed(2) || 0.00}
                      </>
                    ) : (
                        <>$0.00</>
                      )}
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
    getHouseLevelStock: bindActionCreators(JobOrderActions.getHouseLevelStock, dispatch),
    updateHouseLevelStock: bindActionCreators(JobOrderActions.updateHouseLevelStock, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
    getAllHouseLevelTypes: bindActionCreators(HouseLevelTypeActions.getAllHouseLevelTypes, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(invoiceModalPrint);

