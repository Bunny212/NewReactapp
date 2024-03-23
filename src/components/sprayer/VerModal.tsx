import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';

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

const VerModal = ({
  isVerModalOpen,
  verJobOrderId,
  closeVerModal,
  jobOrders,
  billingItems,
  houseLevelTypes,
  actions
}: any) => {

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
    actions.getAllBillingItems();
    actions.getAllHouseLevelTypes();
  }, [
    // actions.getHouseLevelStock,
    actions.getAllBillingItems,
    actions.getAllHouseLevelTypes,
  ]);

  useEffect(() => {
    setFormDataState();
    console.log('yes working here...');
  }, [
    jobOrders
  ]
  );




  // console.log(verJobOrderId);
  // console.log(jobOrders);
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;
  const verJobOrderData = jobOrders.jobOrders.filter((jobOrder: any) => jobOrder.id == verJobOrderId);

  const jobHouseLevels = verJobOrderData.length > 0 ? verJobOrderData[0].houseLevels : verDefaultState;
  const verDefault = jobHouseLevels.length > 0 ? jobHouseLevels : verDefaultState;
  const verificationDefault = verificationDefaultState;
  // console.log(verJobOrderData[0]);
  // console.log(verDefault);
  const [verFormData, setVerFormData] = useState(verDefault);
  const [verificationFormData, setVerificationFormData] = useState(verificationDefault);
  // const [isVerModalOpen, setIsVerModalOpen] = React.useState(false);
  const [verSubmitted, setVerSubmitted] = useState(false);




  const setFormDataState = () => {
    if (jobOrders.activeHouseLevelStock !== undefined) {

      // console.log('sooooo', jobOrders.activeHouseLevelStock);
      // setFormData({...formData.houseLevels, ...defaultState.houseLevels})
      if (jobOrders.activeHouseLevelStock.jobOrderId) {
        const x = { ...jobOrders.activeHouseLevelStock };
        const verificationData = verificationDefault;
        const y = JSON.parse(JSON.stringify(verDefault)); //[...verificationDefault];

        y.map((billItem: any, i: any) => {
          // console.log('bill item');
          // console.log(billItem);
          const bii = billItem.billingItems.map((bi: any) => {
            const existingItem = getSelectedBillingItemField(bi.columnOrder, i + 1);
            if (existingItem) {
              const xx = bi;
              // xx.itemValue = existingItem.itemValue;
              xx.remainingValue = existingItem.remainingValue;
              xx.totalValue = existingItem.totalValue;
              console.log('before return Item -------');
              console.log(xx);
              console.log('--------------');


              return xx;
            } else {
              const xx = bi;
              // xx.itemValue = 0;
              xx.remainingValue = "";
              xx.totalValue = 0;
              // console.log('Existing Item -------');
              // console.log(existingItem);
              // console.log('--------------');
              return xx;
            }

          });
          // return bii;

          return billItem;
        });
        verificationData.houseLevelStock = y;
        verificationData.jobOrderId = verJobOrderId;
        // console.log('hereherehre');
        // console.log(y);
        // console.log(verificationData);

        setVerificationFormData({ ...verificationFormData, ...verificationData });
      }
    }
  }



  const closeModal = () => {
    // console.log('calling it', props.isVerModalOpen);
    // setIsVerModalOpen(false);
    closeVerModal();
    setVerSubmitted(false);
  };

  const handleVerModal = () => {
    // setIsMailModalOpen(true);
    // setVerFormData({ ...verFormData, id: jid });
  };

  const handleVerSubmit = (e: any) => {
    e.preventDefault();
    setVerSubmitted(true);
    console.log(verificationFormData);

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
    // const itemName = billingItemsData.filter((item: any) => item.id == itemId);

    // if (field == 'name') {

    // } else if (field == 'itemValue') {

    // } else if (field == 'remainingItemValue')
    // return itemName.length > 0 ? itemName[0].billingItemName : 'N/A';
  }
  const renderBillingItemsSelectList = () => {
    const items = [];
    for (let i = 1; i <= 6; i++) {
      items.push(<div className={i > 1 ? 'col-md-1' : 'col-md-offset-2 col-md-2'} style={{ width: '13.333333%' }}>{renderBillingItemsHeader(i)}</div>);
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
      <label>
        { getSelectedBillingItem(index)}
      </label>
    );
  }



  const getSelectedHouseLevelType = (index: number) => {
    // const item = uniqueHouseLevelTypes.filter((item: any) => item.index == index);
    // return item && item.length ? item[0].value.toString() : '0';
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
    const value = e.target.value;
    const b = [...verificationFormData.houseLevelStock];

    console.log('Row, column and value', rowIndex, index, value);
    console.log(b);

    const y = b.filter(item => {
      return item.rowOrder == rowIndex && item.billingItems
        .some((billItem: any) => billItem.columnOrder == index)
    });
    console.log('After filter');
    console.log(y);


    if (y.length > 0) {
      console.log('length found');
      console.log(y);
      const x = b.map((item, i) => {
        if (i == rowIndex - 1) {
          item.billingItems
            .map((billItem) => {
              if (billItem.columnOrder == index) {
                billItem.remainingValue = value;
                console.log('yes updating existing value', billItem);
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


  const renderBillingItemsInputList = (rowIndex: number, billingItems: any, readOnly: boolean = false) => {
    const items = [];
    for (let i = 1; i <= 6; i++) {
      items.push(<>{renderBillingItemInput(rowIndex, i, billingItems, readOnly)}</>);
    }
    return items;
  };

  const renderBillingItemInput = (rowIndex: number, index: number, billingItems: any, readOnly: boolean) => {

    const value = billingItems.filter((item: any) => {
      return billingItemsData.
        some((singleItem: any) => item.columnOrder == index)
    });

    if (readOnly) {
      const itemValue = value.length ? value[0].itemValue : '0';
      return (
        <div key={index} className="col-md-2" style={{ width: '13.333333%' }}>
          <input
            type="text"
            name="billingItemId"
            value={itemValue || 0}
            readOnly={readOnly ? true : false}
            // onChange={(e) => onBillingItemInputChange(e, rowIndex, index)}
            className={`form-control`}
          />
        </div>
      );
    } else {

      const itemValue = value.length ? value[0].remainingValue : '0';
      // console.log('+++++++++++++++++++');
      // console.log(value);
      return (
        <div key={index} className="col-md-2" style={{ width: '13.333333%' }}>
          <input
            type="text"
            name="billingItemId"
            value={itemValue || 0}
            readOnly={readOnly ? true : false}
            onChange={(e) => onBillingItemInputChange(e, rowIndex, index)}
            className={`form-control`}
          />
        </div>
      );
    }
  }



  return (
    <>
      <Modal
        isOpen={isVerModalOpen}
        onRequestClose={closeModal}
        style={verModalStyles}
        contentLabel="Verification"
      >
        <h3>JIO Submitted Data</h3>
        <form className="form-horizontal">
          <div className='row'>

            {renderBillingItemsSelectList()}
            {/* <div className={i > 1 ? 'col-md-1' : 'col-md-offset-2 col-md-2'} style={{ width: '13.333333%' }}> */}
          </div>

          <div className="form-group row">
            {verDefault.length > 0 ? verDefault.map((singleLevel: any, i: any) => (
              <>
                <div key={i} className="col-md-2">
                  {renderHouseLevelTypesHeading(singleLevel.rowOrder, singleLevel.houseLevelTypeId)}
                </div>
                {renderBillingItemsInputList(singleLevel.rowOrder, singleLevel.billingItems, true)}
                <div className="clear pad-5"></div>
              </>
            )) : (<>
              <div key={1} className="col-md-2">
                {/* {renderHouseLevelTypesSelect(1, 0)} */}
              </div>

              {/* {renderBillingItemsInputList(1, [])} */}
            </>)}
          </div>
        </form>


        <h3>Sheetrock Left on Site</h3>
        <form className="form-horizontal" onSubmit={(e) => handleVerSubmit(e)}>

          <div className='row'>

            {renderBillingItemsSelectList()}
            {/* <div className={i > 1 ? 'col-md-1' : 'col-md-offset-2 col-md-2'} style={{ width: '13.333333%' }}> */}
          </div>

          <div className="form-group row">
            {verificationFormData.houseLevelStock.length > 0 ? verificationFormData.houseLevelStock.map((singleLevel: any, i: any) => (
              <>
                <div key={i} className="col-md-2">
                  {renderHouseLevelTypesHeading(singleLevel.rowOrder, singleLevel.houseLevelTypeId)}
                </div>
                {renderBillingItemsInputList(singleLevel.rowOrder, singleLevel.billingItems)}
                <div className="clear pad-5"></div>
              </>
            )) : (<>
              <div key={1} className="col-md-2">
                {/* {renderHouseLevelTypesSelect(1, 0)} */}
              </div>

              {/* {renderBillingItemsInputList(1, [])} */}
            </>)}
          </div>

          <div className="clear pad-15"></div>
          <div className="pull-right">
            <button className="btn btn-default mr-5"
              onClick={closeModal}
            >
              Close
            </button>
            <button type="submit" className="btn btn-info">
              Save
            </button>
          </div>
        </form>
      </Modal>
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
    getJobOrder: bindActionCreators(JobOrderActions.getJobOrder, dispatch),
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

