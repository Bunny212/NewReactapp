import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';
import ReactModal from 'react-modal-resizable-draggable';
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import PrintSchedule from './PrintSchedule';
import _ from "lodash";




const VerModal = ({
                    isVerModalOpen,
                    verJobOrderId,
                    filterFormSubmitted,
                    closeVerModal,
                    jobOrders,
                    billingItems,
                    houseLevelTypes,
                    actions
                  }: any) => {

  const defaultModalWidth: any = '70%';
  const [varModalWidth, setVarModalWidth] = useState(defaultModalWidth);
  const verificationModalStyles = {
    content: {
      top: '0',
      left: '0'
    }
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

  useEffect(() => {
    // actions.getHouseLevelStock(verJobOrderId);
    // actions.getAllBillingItems();
    // actions.getAllHouseLevelTypes();
  }, [
    // actions.getHouseLevelStock,
    // actions.getAllBillingItems,
    // actions.getAllHouseLevelTypes,
  ]);

  useEffect(() => {
      setFormDataState();
      console.log('yes working here...');
    }, [
      jobOrders
    ]
  );


  const onEnterPressed = (e: any) => {
    var code = e.keyCode || e.which;
    if (code === 13 && isVerModalOpen) {
      e.preventDefault();
      console.log('enterPressed');

      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
      e.preventDefault();


      // const event = new KeyboardEvent('keypress', {
      //   key: 'tab',
      // });
    }
  }

  const getCurrentJobDetails = (key: string) => {
    const verJobOrderData = filterFormSubmitted && !_.isEmpty(jobOrders.jobOrders.data) && jobOrders.jobOrders.data.length > 0 ? jobOrders.jobOrders.data.filter((jobOrder: any) => jobOrder.id == verJobOrderId) : jobOrders.jobOrders.length > 0 && jobOrders.jobOrders.filter((jobOrder: any) => jobOrder.id == verJobOrderId);
    if (verJobOrderData.length) {
      return verJobOrderData[0][key];
    }
    return '';
  }

  // console.log(verJobOrderId);
  // console.log(jobOrders);
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;
  const verJobOrderData = filterFormSubmitted && !_.isEmpty(jobOrders.jobOrders.data) && jobOrders.jobOrders.data.length > 0 ? jobOrders.jobOrders.data.filter((jobOrder: any) => jobOrder.id == verJobOrderId) : jobOrders.jobOrders.length > 0 && jobOrders.jobOrders.filter((jobOrder: any) => jobOrder.id == verJobOrderId);

  const jobHouseLevels = verJobOrderData.length > 0 ? verJobOrderData[0].houseLevels : verDefaultState;
  const verDefault = jobHouseLevels.length > 0 ? jobHouseLevels : verDefaultState;
  const verificationDefault = verificationDefaultState;
  // console.log(verJobOrderData[0]);
  // console.log(verDefault);
  const [verFormData, setVerFormData] = useState(verDefault);
  const [verificationFormData, setVerificationFormData] = useState(verificationDefault);
  // const [isVerModalOpen, setIsVerModalOpen] = React.useState(false);
  const [verSubmitted, setVerSubmitted] = useState(false);
  const [verWidth, setVerWidth] = useState(window.innerWidth);




  const setFormDataState = () => {
    if (jobOrders.activeHouseLevelStock !== undefined) {
      if (jobOrders.activeHouseLevelStock.jobOrderId) {
        const x = { ...jobOrders.activeHouseLevelStock };
        const verificationData = verificationDefault;
        const y = JSON.parse(JSON.stringify(verDefault));

        y.map((billItem: any, i: any) => {
          const bii = billItem.billingItems.map((bi: any) => {
            const existingItem = getSelectedBillingItemField(bi.columnOrder, i + 1);
            if (existingItem) {
              const xx = bi;
              xx.remainingValue = existingItem.remainingValue;
              xx.totalValue = existingItem.totalValue;
              return xx;
            } else {
              const xx = bi;
              xx.remainingValue = "";
              xx.totalValue = 0;
              return xx;
            }

          });
          return billItem;
        });
        verificationData.houseLevelStock = y;
        verificationData.jobOrderId = verJobOrderId;
        setVerificationFormData({ ...verificationFormData, ...verificationData });
      }
    }
  }

  const closeModal = () => {
    closeVerModal();
    setVerSubmitted(false);
  };

  const handleVerSubmit = (e: any) => {
    e.preventDefault();
    setVerSubmitted(true);
    if (actions.updateHouseLevelStock !== undefined) {
      actions.updateHouseLevelStock(verJobOrderId, verificationFormData);
    }
    closeModal();
  };

  const getSelectedBillingItemField = (index: number, rowIndex: number) => {
    const x = { ...jobOrders.activeHouseLevelStock };
    const items = x.houseLevelStock.filter((item: any) => {
      return item.rowOrder == rowIndex && item.billingItems.some((singleItem: any) => singleItem.columnOrder == index)
    }).map((item: any) => {
      let singleItem = Object.assign({}, item);
      return item.rowOrder == rowIndex && singleItem.billingItems.filter((subItem: any) => subItem.columnOrder == index);
    }).flat();
    const itemObj = items.length > 0 ? items[0] : false;
    console.log('item object is');
    console.log(itemObj);
    return itemObj;
  }

  const renderBillingItemsSelectList = (columnCount: number = 8) => {
    const items = [];
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
        <td>
          <label>{getSelectedBillingItem(index)}</label>
        </td>
      )
    } else {
      return(<></>);
    }
  }

  const getSelectedHouseLevelType = (index: number) => {
  }
  const renderHouseLevelTypesHeading = (index: number, value: any) => {
    // const houseLevelTypes = houseLevelTypesData.filter(item => {
    //   return !uniqueHouseLevelTypes.
    //     some((singleItem: any) => singleItem.value == item.id && singleItem.index !== index
    //     )
    // });

    // console.log('house levels');
    // console.log(houseLevelTypesData);
    const houseLevelName = houseLevelTypesData.filter((item: any) => item.id == value);
    // console.log(houseLevelName);
    const houseName = houseLevelName.length > 0 ? houseLevelName[0].houseTypeName : 'N.A';
    // console.log(houseName);
    return (
      <label>
        { houseName}
        {/* { getSelectedHouseLevelType(index) } */}
      </label>
    );
  }



  const onBillingItemInputChange = (e: any, rowIndex: number, index: number) => {
    //const value = e.target.value;
    let { value } = e.target;
  value = parseInt(value);
    const b = [...verificationFormData.houseLevelStock];
    const y = b.filter(item => {
      return item.rowOrder == rowIndex && item.billingItems
        .some((billItem: any) => billItem.columnOrder == index)
    });
    if (y.length > 0) {
      const x = b.map((item, i) => {
        if (i == rowIndex - 1) {
          item.billingItems
            .map((billItem) => {
              if (billItem.columnOrder == index) {
                if (index === 9 || index === 10) {
                  billItem.remainingValue = value;
                  billItem.totalValue = value;
                  billItem.itemValue = value;
                } else {
                  billItem.remainingValue = value;
                }
              }
            });
        }
        return item;
      });
    } else {
      // console.log('length not found');
      // console.log(y);
      // const v = uniqueBillingItems.filter((vv: any) => vv.index == index);
      // console.log(v);
      // const x = b.map((item, i) => {
      //   const z = {
      //     billingItemId: v.length ? parseInt(v[0].value, 10) : 0,
      //     columnOrder: index,
      //     itemValue: value
      //   }
      //   if (i == rowIndex - 1) {
      //     console.log('yes pushing new value', z);
      //     item.billingItems.push(z);
      //   }
      //   return item;
      // });
    }
    setVerificationFormData({ ...verificationFormData, houseLevelStock: [...b] });
  }


  const getBillingItemsInputList = (multiplyer: number = 70) => {
    let itemsCount = 0;
    for (let i = 1; i <= 10; i++) {
      if (getSelectedBillingItem(i) !== '') {
        itemsCount++;
      }
    }

    return itemsCount * multiplyer;
  };

  useEffect(() => {
    //const itemsCountWidth = getBillingItemsInputList(100);
    //if (itemsCountWidth) {
    // console.log('yes counted', `${itemsCountWidth}px`);
    //let element = (document.getElementsByClassName('flexible-modal') as HTMLCollectionOf<HTMLElement>)[0];
    // let element:HTMLElement = document.getElementsByClassName('flexible-modal')[0] as HTMLElement;

    // const node = document.querySelector('flexible-modal') as HTMLElement;
    // if (element !== null {
    // if (element instanceof HTMLElement) {
    //   ReactDOM.findDOMNode(element)!.style.width = `${itemsCountWidth * 120}px`;
    // }
    // if (element) {
    //if(isVerModalOpen) {
    //  element.style.width = `${itemsCountWidth}px`;
    //}
    // }

    // setVarModalWidth(`${itemsCountWidth}px`);
    //}
    setVerWidth(window.innerWidth);
    console.log("verWidth => ", verWidth);
  }, [jobOrders.activeHouseLevelStock]);

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

    if (readOnly) {
      const itemValue = value.length ? value[0].itemValue : '0';
      return (
        <td key={index} style={{padding: '5px'}}>
          <input
            type="text"
            name="billingItemId"
            value={itemValue || 0}
            readOnly={readOnly ? true : false}
            // onChange={(e) => onBillingItemInputChange(e, rowIndex, index)}
            className={index == 9 || index == 10 ? `form-control input-sm bg-yellow` : `form-control input-sm`}
            onKeyPress={onEnterPressed}
          />
        </td>
      );
    } else {

      const itemValue = value.length ? value[0].remainingValue : '0';
      return (
        <td key={index} style={{padding: '5px'}}>
          <input
            type="text"
            name="billingItemId"
            value={itemValue || 0}
            readOnly={readOnly ? true : false}
            onChange={(e) => onBillingItemInputChange(e, rowIndex, index)}
            className={index == 9 || index == 10 ? `form-control input-sm bg-yellow` : `form-control input-sm`}
            onKeyPress={onEnterPressed}
          />
        </td>
      );
    }
  }


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
    verificationFormData.houseLevelStock.map((singleLevel) => {
      if (singleLevel.rowOrder == rowIndex) {
        singleLevel.billingItems.map((bItem) => {
          if (bItem.columnOrder == index) {
            const itemValue = value.length ? value[0].itemValue : 0;
            const cItemValue = parseInt(itemValue, 10) ? parseInt(itemValue, 10) : 0;
            const cRemainingValue = parseInt(bItem.remainingValue, 10) ? parseInt(bItem.remainingValue, 10) : 0;
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
        <td key={index} style={{padding: '5px'}}>
          <input
            type="text"
            name="billingItemId"
            value={updatedItemValue || 0}
            readOnly={readOnly ? true : false}
            className={index == 9 || index == 10 ? `form-control input-sm bg-yellow` : `form-control input-sm`}
            onKeyPress={onEnterPressed}
          />
        </td>
      );
    } else {
      const itemValue = value.length ? value[0].remainingValue : '0';
      return (
        <div key={index} className="col-md-2" style={{ width: '75px', paddingLeft: '5px', paddingRight: '5px' }}>
          <input
            type="text"
            name="billingItemId"
            value={itemValue || 0}
            readOnly={readOnly ? true : false}
            onChange={(e) => onBillingItemInputChange(e, rowIndex, index)}
            className={index == 9 || index == 10 ? `form-control input-sm bg-yellow` : `form-control input-sm`}
            onKeyPress={onEnterPressed}
          />
        </div>
      );
    }
  }

  return (
    <>
      <ReactModal
        isOpen={isVerModalOpen}
        onRequestClose={closeModal}
        // style={{ overlay: {}, content: {top: 0, left: 0} }}
        contentLabel="Verification"
        id="verification-modal"
        initHeight={`auto`}
        initWidth={verWidth > 430 ? `50%` : `96%`}
        className="Modal"
        overlayClassName="Overlay"
        preventScroll={true}
      >
        <div style={{width: '100%', height: '100%', overflowY: 'scroll'}}>
          <div className="text-center mb-10">
            <h4> {getCurrentJobDetails('address') || ''} ({getCurrentJobDetails('builderName') || ''})</h4>
          </div>
          <h4 className="mt-10 mb-5">JIO Submitted Data</h4>
          <hr />
          <form className="form-horizontal f-14">
            <table className={'table'}>
              <tr style={{border: 'none'}}>
                <td>&nbsp;&nbsp;&nbsp;</td>
                {renderBillingItemsSelectList()}
              </tr>

              {verDefault.length > 0 ? verDefault.map((singleLevel: any, i: any) => (
                <tr>
                  <td key={i}>
                    {renderHouseLevelTypesHeading(singleLevel.rowOrder, singleLevel.houseLevelTypeId)}
                  </td>
                  {renderBillingItemsInputList(singleLevel.rowOrder, singleLevel.billingItems, true)}
                </tr>
              )) : (<>
                <tr key={1}>
                </tr>
              </>)}
            </table>
          </form>

          <h3>Sheetrock Left on Site</h3>
          <hr/>
          <form className="form-horizontal f-14" onSubmit={(e) => handleVerSubmit(e)}>
            <table className={'table'}>
              <tr style={{border: 'none'}}>
                <td>&nbsp;&nbsp;&nbsp;</td>
                {renderBillingItemsSelectList(10)}
              </tr>

              {verificationFormData.houseLevelStock.length > 0 ? verificationFormData.houseLevelStock.map((singleLevel: any, i: any) => (
                <tr>
                  <td key={i}>
                    {renderHouseLevelTypesHeading(singleLevel.rowOrder, singleLevel.houseLevelTypeId)}
                  </td>
                  {renderBillingItemsInputList(singleLevel.rowOrder, singleLevel.billingItems, false, 10)}
                </tr>
              )) : (<>
                <tr key={1}>
                </tr>
              </>)}
            </table>

            <div className="text-center">
              <button className="btn btn-default btn-sm mr-5"
                      onClick={closeModal}
              >
                Close
              </button>
              <button type="submit" className="btn btn-info btn-sm">
                Save
              </button>
              <PrintSchedule
                label={'Print'}
                className={"ml-5 btn-sm"}
                componentName={'verModalPrint'}
                verDefault={verDefault}
                verificationFormData={verificationFormData}
                filterFormSubmitted={filterFormSubmitted}
                jobOrderAddress={getCurrentJobDetails('address')}
                jobOrderBuilderName={getCurrentJobDetails('builderName')}
              />
            </div>
          </form>

          <h4>Total</h4>
          <hr/>
          <form className="form-horizontal f-14">
            <table className={'table'}>
              <tr style={{border: 'none'}}>
                <td>&nbsp;&nbsp;&nbsp;</td>
                {renderBillingItemsSelectList(10)}
              </tr>

                {verDefault.length > 0 ? verDefault.map((singleLevel: any, i: any) => (
                  <tr>
                    <td key={i}>
                      {renderHouseLevelTypesHeading(singleLevel.rowOrder, singleLevel.houseLevelTypeId)}
                    </td>
                    {renderBillingItemsTotalInputList(singleLevel.rowOrder, singleLevel.billingItems)}
                  </tr>
                )) : (<></>)}
            </table>
          </form>
        </div>
      </ReactModal>
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
)(VerModal);

