import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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

const VerModalPrint = ({
  isVerModalOpen,
  verJobOrderId,
  closeVerModal,
  jobOrders,
  billingItems,
  houseLevelTypes,
  filterFormSubmitted,
  verDefault,
  verificationFormData,
  jobOrderAddress,
  jobOrderBuilderName,
  actions
}: any) => {





  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;



  const renderBillingItemsSelectList = (columnCount: number = 8) => {
    const items = [];
    items.push(<th style={{ border: 'none', color: 'blue' }}>&nbsp;</th>);

    for (let i = 1; i <= columnCount; i++) {
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
    const itemId = items.length > 0 ? items[0].billingItemId : 0;
    const itemName = billingItemsData.filter((item: any) => item.id == itemId);
    return itemName.length > 0 ? itemName[0].billingItemName : '';
  }

  const renderBillingItemsHeader = (index: number) => {
    if (getSelectedBillingItem(index) !== '') {
      return (
        <th style={{ textAlign: 'center', paddingRight: '5px', color: 'blue', border: 'none' }}>
          { getSelectedBillingItem(index)}
        </th>
      )
    } else {
      return(
        <></>
      )
    }
  }

  const renderHouseLevelTypesHeading = (index: number, value: any) => {
    const houseLevelName = houseLevelTypesData.filter((item: any) => item.id == value);
    const houseName = houseLevelName.length > 0 ? houseLevelName[0].houseTypeName : 'N.A';
    return (
      <th style={{ textAlign: 'left', paddingRight: '5px', color: 'blue', border: 'none' }}>
        { houseName}
      </th>
    );
  }

  const renderBillingItemsInputList = (rowIndex: number, billingItems: any, readOnly: boolean = false, columnCount: number = 8) => {
    const items = [];
    for (let i = 1; i <= columnCount; i++) {
      items.push(<>{renderBillingItemInput(rowIndex, i, billingItems, readOnly)}</>);
    }
    return items;
  };


  const renderBillingItemInput = (rowIndex: number, index: number, billingItems: any, readOnly: boolean) => {

    const value = billingItems.filter((item: any) => {
      return billingItemsData.
        some((singleItem: any) => item.columnOrder == index)
    });
    if (getSelectedBillingItem(index) === '') {
      return (<></>);
    }

    let itemValue = value.length ? value[0].itemValue : '0';
    let itemTotalValue = value.length ? value[0].totalValue : '0';

    if (!readOnly) {
      itemValue = value.length ? value[0].remainingValue : '0';
    }
    if (index === 9 || index === 10) {
      itemValue = itemTotalValue;
    }
    return (
      <td key={index} style={{ textAlign: 'center', color: '#000', border: '1px solid #606060' }}>
        {itemValue || 0}
      </td>
    );
  };

  const renderBillingItemsTotalInputList = (rowIndex: number, billingItems: any, readOnly: boolean = true) => {
    const items = [];
    for (let i = 1; i <= 10; i++) {
      items.push(<>{renderBillingItemTotalInput(rowIndex, i, billingItems, readOnly)}</>);
    }
    return items;
  };

  const renderBillingItemTotalInput = (rowIndex: number, index: number, billingItems: any, readOnly: boolean) => {
    const value = billingItems.filter((item: any) => {
      return billingItemsData.
        some((singleItem: any) => item.columnOrder == index)
    });
    if (getSelectedBillingItem(index) === '') {
      return (<></>);
    }

    let updatedItemValue = 0;
    verificationFormData.houseLevelStock.map((singleLevel: any) => {
      if (singleLevel.rowOrder == rowIndex) {
        singleLevel.billingItems.map((bItem: any) => {
          if (bItem.columnOrder == index) {
            const itemValue = value.length ? value[0].itemValue : 0;
            const cItemValue = parseInt(itemValue, 10) ? parseInt(itemValue, 10) : 0;
            const cRemainingValue = parseInt(bItem.remainingValue, 10) ? parseInt(bItem.remainingValue, 10) : 0;
            // updatedItemValue = cItemValue - cRemainingValue;
            if (index === 9 || index === 10) {
              updatedItemValue = cRemainingValue;
            } else {
              updatedItemValue = cItemValue - cRemainingValue;
            }
          }
        });
      }
    });

    if (readOnly) {
      const itemValue = value.length ? value[0].totalValue : '0';
      return (
        <td key={index} style={{ textAlign: 'center', color: '#000', border: '1px solid #606060' }}>
          {updatedItemValue || 0}
        </td>
      );
    } else {
      const itemValue = value.length ? value[0].remainingValue : '0';
      return (
        <td key={index} style={{ textAlign: 'center', paddingRight: '5px', color: '#000' }}>
          {itemValue || 0}
        </td>
      );
    }
  }

  const getCurrentJobDetails = (key: string) => {
    console.log(jobOrders.jobOrders);
    const verJobOrderData = filterFormSubmitted && !_.isEmpty(jobOrders.jobOrders.data) ? jobOrders.jobOrders.data.filter((jobOrder: any) => jobOrder.id == verJobOrderId) : jobOrders.jobOrders.filter((jobOrder: any) => jobOrder.id == verJobOrderId);
    if (verJobOrderData.length) {
      console.log('noooooooooooo', verJobOrderData);
      return verJobOrderData[0][key];
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


        <div style={{ padding: '0px', borderBottom: '#606060 1px solid' }}>
          <h3 style={{ textAlign: 'center', marginTop: '5px', fontSize: '20px' }}>
            {jobOrderAddress || ''} ({jobOrderBuilderName || ''})
          </h3>
        </div>

        <div style={{ padding: '5px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', border: '#fff 0px solid' }}>
            <tr>
              <td colSpan={verDefault.length}>
                <h3 style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold', color: '#aa4444', marginTop: '5px' }}>Sheet Rock Stocked:</h3>
              </td>
            </tr>
            <tr>
              {renderBillingItemsSelectList(10)}
            </tr>
            {verDefault.length > 0 ? verDefault.map((singleLevel: any, i: any) => (
              <>
                <tr key={i}>
                  {renderHouseLevelTypesHeading(singleLevel.rowOrder, singleLevel.houseLevelTypeId)}
                  {renderBillingItemsInputList(singleLevel.rowOrder, singleLevel.billingItems, true)}
                </tr>
              </>
            )) : (<></>)}
            <tr>
              <td colSpan={verDefault.length}>
                <h3 style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold', color: '#aa4444', marginTop: '10px', marginBottom: '10px' }}>Sheetrock Left on Site:</h3>
              </td>
            </tr>
            {verificationFormData.houseLevelStock.length > 0 ? verificationFormData.houseLevelStock.map((singleLevel: any, i: any) => (
              <>
                <tr key={i}>
                  {renderHouseLevelTypesHeading(singleLevel.rowOrder, singleLevel.houseLevelTypeId)}
                  {renderBillingItemsInputList(singleLevel.rowOrder, singleLevel.billingItems, false, 10)}
                </tr>
              </>
            )) : (<></>)}


            <tr>
              <td colSpan={verDefault.length}>
                <h3 style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold', color: '#aa4444', marginTop: '10px', marginBottom: '10px' }}>Total:</h3>
              </td>
            </tr>
            {verDefault.length > 0 ? verDefault.map((singleLevel: any, i: any) => (
              <>
                <tr key={i}>
                  {renderHouseLevelTypesHeading(singleLevel.rowOrder, singleLevel.houseLevelTypeId)}
                  {renderBillingItemsTotalInputList(singleLevel.rowOrder, singleLevel.billingItems)}
                </tr>
              </>
            )) : (<></>)}

          </table>
        </div>

      </div>




    </>
  );
}

const mapStateToProps = (state: any) => ({
  jobOrders: state.jobOrders,
  billingItems: state.billingItems,
  houseLevelTypes: state.houseLevelTypes,
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
)(VerModalPrint);

