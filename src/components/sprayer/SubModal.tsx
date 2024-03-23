import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';

Modal.setAppElement('#root');
const emailModalStyles = {
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

const verModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '600px',
    overlfow: 'scroll',
    width: '700px',
    // border: 'none',
    // background: 'none',
  }
};

const SubModal = ({
  subUserType,
  subUserTypeId,
  isSubModalOpen,
  verJobOrderId,
  closeSubModal,
  jobOrders,
  billingItems,
  houseLevelTypes,
  users,
  ceilingFinishes,
  handleInvoiceModal,
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

    directions: [
      {
        id: 0,
        jobOrderId: verJobOrderId,
        userType: subUserType,
        directions: ''
      }
    ],
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
    // console.log('yes working here...');
  }, [
    jobOrders
  ]
  );



  const mailDefaultState = {
    id: 0,
    userId: 0,
    userType: subUserType ? subUserType : '',
    emailTo: '',
    emailMessage: '',
  };


  // console.log(verJobOrderId);
  // console.log(jobOrders);
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;
  const verJobOrderData = jobOrders.jobOrders.filter((jobOrder: any) => jobOrder.id == verJobOrderId);

  const singleJobOrderData = verJobOrderData.length ? verJobOrderData[0] : [];
  const { ceilingFinishes: ceilingFinishesData } = ceilingFinishes;

  const jobHouseLevels = verJobOrderData.length > 0 ? verJobOrderData[0].houseLevels : verDefaultState;
  const verDefault = jobHouseLevels.length > 0 ? jobHouseLevels : verDefaultState;
  const verificationDefault = verificationDefaultState;
  // console.log(verJobOrderData[0]);
  // console.log(verDefault);
  const [verFormData, setVerFormData] = useState(verDefault);
  const [verificationFormData, setVerificationFormData] = useState(verificationDefault);
  // const [isSubModalOpen, setIsSubModalOpen] = React.useState(false);
  const [subSubmitted, setSubSubmitted] = useState(false);
  const [subFormData, setSubFormData] = useState(defaultSubForm);


  const { users: usersData } = users;



  const [mailFormData, setMailFormData] = useState(mailDefaultState);
  const [isMailModalOpen, setIsMailModalOpen] = React.useState(false);
  const [mailSubmitted, setMailSubmitted] = useState(false);


  const closeMailModal = () => {
    setIsMailModalOpen(false);
    setMailSubmitted(false);
  };

  const handleMailModal = () => {

    if (actions.updateHouseLevelStock !== undefined) {
      // actions.updateJobOrder(subFormData);
      // actions.updateHouseLevelStock(verJobOrderId, verificationFormData);
    }
    closeMailModal();

    setIsMailModalOpen(true);
    const currentData = {
      id: verJobOrderId,
      userId: subUserTypeId
    };
    setMailFormData({ ...mailFormData, ...currentData });
  };

  const onMailFormChange = (e: any) => {
    setMailFormData({ ...mailFormData, [e.target.name]: e.target.value });
  };
  const handleMailSubmit = (e: any) => {
    e.preventDefault();
    setMailSubmitted(true);

    console.log(mailFormData);
    if (mailFormData.emailTo && mailFormData.emailMessage && actions.sendPurchaseOrderEmail !== undefined) {
      actions.sendPurchaseOrderEmail(mailFormData);
    }
    closeMailModal();

  };





  // console.log(usersData);


  const getfilteredCurrentUserName = (usersData: any) => {
    const newData = usersData
      // .filter((user: any) => {
      //   return user.userTypes.some((userType: any) => parseInt(userType.id, 10) === userTypeId);
      // }).
      .filter((singleUser: any) => singleUser.id == subUserTypeId);
    // console.log('88888888888888888888', subUserId);
    return newData.length ? newData[0].name : '';
  }



  const getJobOrderCeilingFinish = (ceilingFinishId: any) => {
    const ceilingFinish = ceilingFinishesData.filter((cf: any) => cf.id === parseInt(ceilingFinishId, 10));
    return (
      <>
        {ceilingFinish.length > 0 ? ceilingFinish[0].name : ''}
      </>
    );
  };


  const setFormDataState = () => {


    if (verJobOrderData && verJobOrderData.length) {
      setSubFormData({ ...subFormData, ...verJobOrderData[0] })
    }


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
              // console.log('before return Item -------');
              // console.log(xx);
              // console.log('--------------');


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


  const onSubFormChange = (e: any) => {
    setSubFormData({ ...subFormData, [e.target.name]: e.target.value });
  };

  const onSubFormDirectionChange = (e: any) => {
    const directionsList = [...subFormData.directions];
    const currentDirection = subFormData.directions.filter((direction: any) => direction.userType === subUserType);
    if (currentDirection.length) {
      const updatedDirections = directionsList.map((direction: any) => {
        if (direction.userType === subUserType) {
          direction.directions = e.target.value;
        }
        return direction;
      });
      setSubFormData({ ...subFormData, directions: [...updatedDirections] });
    } else {
      directionsList.push({
        id: 0,
        jobOrderId: verJobOrderId,
        userType: subUserType,
        directions: e.target.value
      });
      setSubFormData({ ...subFormData, directions: [...directionsList] });
    }
  };

  const getActiveTypeDirection = () => {
    // console.log(verJobOrderData);
    if (subFormData && subFormData.directions) {
      // console.log('0000000000000000000000');
      // console.log(singleJobOrderData.directions);
      // console.log(subUserType);
      // console.log('0000000000000000000000');
      const currentDirection = subFormData.directions.filter((direction: any) => direction.userType === subUserType);
      return currentDirection.length ? currentDirection[0].directions : '';
    }
    return '';
  }

  const closeModal = () => {
    // console.log('calling it', props.isSubModalOpen);
    // setIsSubModalOpen(false);
    closeSubModal();
    setSubSubmitted(false);
  };

  const handleSubModal = () => {
    // setIsMailModalOpen(true);
    // setVerFormData({ ...verFormData, id: jid });
  };

  const handleSubSubmit = (e: any) => {
    e.preventDefault();
    setSubSubmitted(true);
    // console.log(verificationFormData);

    // subFormData

    // console.log('submit data here');
    // console.log(subFormData);
    if (actions.updateHouseLevelStock !== undefined) {
      actions.updateJobOrder(subFormData);
      // actions.updateHouseLevelStock(verJobOrderId, verificationFormData);
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
    // console.log('item object is');
    // console.log(itemObj);
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
      items.push(<td style={{ width: '85px' }}>{renderBillingItemsHeader(i)}</td>);
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
      <>
        { getSelectedBillingItem(index)}
      </>
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

    // console.log('Row, column and value', rowIndex, index, value);
    // console.log(b);

    const y = b.filter(item => {
      return item.rowOrder == rowIndex && item.billingItems
        .some((billItem: any) => billItem.columnOrder == index)
    });
    // console.log('After filter');
    // console.log(y);


    if (y.length > 0) {
      // console.log('length found');
      // console.log(y);
      const x = b.map((item, i) => {
        if (i == rowIndex - 1) {
          item.billingItems
            .map((billItem) => {
              if (billItem.columnOrder == index) {
                billItem.remainingValue = value;
                // console.log('yes updating existing value', billItem);
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



  const renderBillingItemsTotalList = (rowIndex: number, billingItems: any, readOnly: boolean = false) => {
    const items = [];
    for (let i = 1; i <= 6; i++) {
      items.push(<>{renderBillingItemTotalValue(rowIndex, i, billingItems, readOnly)}</>);
    }
    return items;
  };

  const renderBillingItemTotalValue = (rowIndex: number, index: number, billingItems: any, readOnly: boolean) => {

    const value = billingItems.filter((item: any) => {
      return billingItemsData.
        some((singleItem: any) => item.columnOrder == index)
    });



    const itemValue = value.length ? value[0].totalValue : 0;
    // console.log('+++++++++++++++++++');
    // console.log(value);
    return (
      <td>{itemValue || 0}</td>
    );

  }


  const renderBillingItemsTotalListRow = () => {
    const items: any = [0, 0, 0, 0, 0, 0];
    verificationFormData.houseLevelStock.map((singleLevel: any, i: any) => {
      for (let i = 1; i <= 6; i++) {
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
        {items.map((item: any) => {
          return (<td>{item}</td>)
        })}
      </>
    );
  }

  return (
    <>
      <Modal
        isOpen={isSubModalOpen}
        onRequestClose={closeModal}
        style={verModalStyles}
        contentLabel="Verification"
      >


        <form className="form-horizontal" onSubmit={(e) => handleSubSubmit(e)}>





          <div className="table-responsive">

            <table style={{}}>
              <tbody>
                <tr style={{}}>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'black' }}>Schoenberger Drywall, Inc.</td>
                        </tr>
                        <tr>
                          <td>17180 Adelmann Street SE</td>
                        </tr>
                        <tr>
                          <td>Prior Lake, MN 55372</td>
                        </tr>
                        <tr>
                          <td>Phone: 952-447-1078</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr style={{ borderTop: '1px solid black', fontSize: '20px', color: 'black' }}>
                  <td colSpan={2} style={{ textAlign: 'center' }}>Sub-Contract</td>
                </tr>
                <tr style={{ borderBottom: '1px solid black', fontSize: '20px', color: 'black' }}>
                  <td colSpan={2} style={{ textAlign: 'center' }}>Purchase Order</td>
                </tr>



                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px', width: '300px' }} >
                    Sub Contractor:
                  </td>
                  <td style={{ width: '400px', paddingLeft: '10px' }}>
                    {getfilteredCurrentUserName(usersData)}
                  </td>
                </tr>
                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Job Address:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>{singleJobOrderData.address || ''}, {singleJobOrderData.cityName || ''}</td>
                </tr>
                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Ceining Finish:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>{getJobOrderCeilingFinish(singleJobOrderData.ceilingFinishId)}</td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Building Contractor:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>Key-Land Homes</td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Work Start Date:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>{moment(singleJobOrderData.hangerStartDate).format('dddd, MMMM DD, YYYY')}</td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Work to be Completed:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>{moment(singleJobOrderData.hangerEndDate).format('dddd, MMMM DD, YYYY')}</td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Verified Sheets:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>

                    <table style={{ border: '1px solid black' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid black' }}>
                          {renderBillingItemsSelectList()}
                        </tr>



                        {renderBillingItemsTotalListRow()}

                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderBottom: '1px solid black', borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Directions to the Job:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                    <textarea
                      className="form-control"
                      rows={5}
                      name="directions"
                      value={getActiveTypeDirection()}
                      onChange={(e) => onSubFormDirectionChange(e)}
                    ></textarea>
                  </td>
                </tr>

                <tr style={{}}>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    <div className="text-center">
                      <div className="clear pad-15"></div>
                      <button className="btn btn-default mr-5"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-info mr-5">
                        Save
                      </button>
                      <button
                        className="btn btn-info mr-5"
                        onClick={() => handleMailModal()}
                      >
                        Save &amp; Email
                      </button>
                      <button
                        className="btn btn-info"
                        onClick={() => handleInvoiceModal(verJobOrderId, 'hanger')}
                      >
                        Purchase Order
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>


          </div>

          {/* <div className="clear pad-15"></div> */}


        </form>

      </Modal>





      <Modal
        isOpen={isMailModalOpen}
        onRequestClose={closeMailModal}
        style={emailModalStyles}
        contentLabel="Email Purchase Order"
      >

        <div className="clear pad-15"></div>
        <h3>Email Purchase Order</h3>
        <form className="form-horizontal" onSubmit={(e) => handleMailSubmit(e)}>
          <div className="row">
            <div className="col-md-12">
              <label className="control-label">
                To:
                <span className="text_red">*</span>
              </label>
              <input
                type="text"
                name="emailTo"
                onChange={(e) => onMailFormChange(e)}
                className={`form-control ${mailSubmitted && !mailFormData.emailTo ? 'ap-required' : ''}`}
              />
            </div>
            <div className="clear pad-15"></div>
            <div className="col-md-12">
              <label className="control-label">
                Message:
              </label>
              <textarea
                rows={5}
                name="emailMessage"
                onChange={(e) => onMailFormChange(e)}
                className={`form-control ${mailSubmitted && !mailFormData.emailMessage ? 'ap-required' : ''}`}
              ></textarea>
            </div>
          </div>
          <div className="clear pad-15"></div>
          <div className="pull-right">
            <button className="btn btn-default mr-5"
              onClick={closeMailModal}
            >
              Close
            </button>
            <button type="submit" className="btn btn-info">
              Send
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
  users: state.users,
  ceilingFinishes: state.ceilingFinishes,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getJobOrder: bindActionCreators(JobOrderActions.getJobOrder, dispatch),
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
)(SubModal);

