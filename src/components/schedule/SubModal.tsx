import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';
import ReactModal from 'react-modal-resizable-draggable';
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import PrintSchedule from './PrintSchedule';
import _ from "lodash";

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
    height: '770px',
    overlfow: 'scroll',
    width: '700px',
    // border: 'none',
    // background: 'none',
  }
};

const SubModal = ({
  subUserType,
  subUserTypeId,
  filterFormSubmitted,
  isSubModalOpen,
  verJobOrderId,
  verJobOrderActiveType,
  closeSubModal,
  jobOrders,
  billingItems,
  houseLevelTypes,
  users,
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
    // actions.getAllBillingItems();
    // actions.getAllHouseLevelTypes();
  }, [
    // actions.getHouseLevelStock,
    // actions.getAllBillingItems,
    // actions.getAllHouseLevelTypes,
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
    contractorName: '',
  };


  // console.log(verJobOrderId);
  // console.log(jobOrders);
  const { billingItems: billingItemsData } = billingItems;
  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;
  const verJobOrderData = filterFormSubmitted && !_.isEmpty(jobOrders.jobOrders.data) && jobOrders.jobOrders.data.length > 0 ? jobOrders.jobOrders.data.filter((jobOrder: any) => jobOrder.id == verJobOrderId) : jobOrders.jobOrders.length > 0 && jobOrders.jobOrders.filter((jobOrder: any) => jobOrder.id == verJobOrderId);

  const singleJobOrderData = verJobOrderData.length ? verJobOrderData[0] : [];

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

  const getfilteredCurrentUserData = (usersData: any) => {
    console.log(usersData)
    const newData = usersData.filter((singleUser: any) => singleUser.id == subUserTypeId);
    return newData.length ? newData : '';
  }

  const handleMailModal = () => {

    let userData = getfilteredCurrentUserData(usersData);

    if (actions.updateHouseLevelStock !== undefined) {
      // actions.updateJobOrder(subFormData);
      // actions.updateHouseLevelStock(verJobOrderId, verificationFormData);
    }
    closeMailModal();

    setIsMailModalOpen(true);
    const currentData = {
      id: verJobOrderId,
      userId: subUserTypeId,
      emailTo: ((userData.length > 0) ? userData[0].email : ''),
      userType: subUserType,
      contractorName: singleJobOrderData.builderName,
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
    if (mailFormData.emailTo && actions.sendPurchaseOrderEmail !== undefined) {
      actions.sendPurchaseOrderEmail(mailFormData);
    }
    setMailFormData(mailDefaultState);
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




  const isFireBarrier = (id: any) => {
    const houseLevelList = houseLevelTypesData.filter((item: any) => item.id === id && item.isFireBarrier);
    return houseLevelList.length ? true : false;
  };

  const setFormDataState = () => {


    // if (verJobOrderData && verJobOrderData.length) {
    //   setSubFormData({ ...subFormData, ...verJobOrderData[0] })
    // }


    if (jobOrders.activeHouseLevelStock !== undefined) {

      if (jobOrders.activeHouseLevelStock.jobOrderId) {
        const x = { ...jobOrders.activeHouseLevelStock };
        const verificationData = verificationDefault;

        const hList = JSON.parse(JSON.stringify(verDefault));
        let hListFiltered = hList;
        if (subUserType !== 'hanger') {
          hListFiltered = hList.filter((singleHouseLevel: any) => !isFireBarrier(singleHouseLevel.houseLevelTypeId))
        }

        const y = JSON.parse(JSON.stringify(hListFiltered));
        // console.log('--------------------------');
        // console.log(subUserType);
        // console.log(y);
        // console.log('--------------------------');
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
    console.log(subFormData);
    if (actions.updateHouseLevelStock !== undefined) {
      actions.updateJobOrder(singleJobOrderData);
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
    const itemId = items.length > 0 ? items[0].billingItemId : 0;
    const itemName = billingItemsData.filter((item: any) => item.id == itemId);
    return itemName.length > 0 ? itemName[0] : '';
  }

  const renderBillingItemsHeader = (index: number) => {
    const dataFull = getSelectedBillingItem(index);
    if (dataFull !== '' && (dataFull[verJobOrderActiveType] == 1 || dataFull[verJobOrderActiveType] === undefined)) {
      return (
        <td style={{ width: '85px' }}>
          {dataFull.billingItemName}
        </td>
      )
    } else {
      return (
        <></>
      )
    }
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
        {houseName}
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
    for (let i = 1; i <= 8; i++) {
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
        <div key={index} className="col-md-2" style={{ width: '10.333333%', paddingLeft: '5px', paddingRight: '5px' }}>
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
        <div key={index} className="col-md-2" style={{ width: '10.333333%', paddingLeft: '5px', paddingRight: '5px' }}>
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
    for (let i = 1; i <= 8; i++) {
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
        {items.map((item: any, i: any) => {
          const dataFull = getSelectedBillingItem(i + 1);
          if (dataFull !== '' && (dataFull[verJobOrderActiveType] == 1 || dataFull[verJobOrderActiveType] == undefined)) {
            return (<td>{item}</td>);
          } else {
            return (<></>)
          }
        })}
      </>
    );
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

  return (
    <>
      <ReactModal
        isOpen={isSubModalOpen}
        onRequestClose={closeModal}
        style={verModalStyles}
        contentLabel="Verification"
        initHeight={770}
        initWidth={700}
      >


        <form className="form-horizontal f-14" onSubmit={(e) => handleSubSubmit(e)}>
          <div className="table-responsive">
            <table style={{}}>
              <tbody>
                <tr style={{}}>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ fontSize: 'large', fontWeight: 'bold', color: 'black' }}>Schoenberger Drywall, Inc.</td>
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
                <tr style={{ borderTop: '1px solid black', fontSize: '16x', color: 'black' }}>
                  <td colSpan={2} style={{ textAlign: 'center' }}>Sub-Contract</td>
                </tr>
                <tr style={{ borderBottom: '1px solid black', fontSize: '16px', color: 'black' }}>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    {singleJobOrderData.isVerified ? 'Purchase Order' : 'Purchase Order'}
                  </td>
                </tr>



                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px', paddingTop: '10px', width: '300px' }} >
                    {getSubUserTypeLabel() || ''} Sub Contractor:
                  </td>
                  <td style={{ width: '400px', paddingLeft: '10px', paddingBottom: '10px', paddingTop: '10px' }}>
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
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>{singleJobOrderData.ceilingFinishName || ''}</td>
                </tr>

                <tr style={{}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Building Contractor:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                    {singleJobOrderData.builderName}
                  </td>
                </tr>

                <tr style={{display: startDateValue ? 'table-row' : 'none'}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Work Start Date:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>{startDateValue}</td>
                </tr>

                <tr style={{display: endDateValue ? 'table-row' : 'none'}}>
                  <td style={{ borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px' }}>
                    Work to be Completed:
                  </td>
                  <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>{endDateValue}</td>
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
                      rows={3}
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
                      <button className="btn btn-default btn-sm mr-5"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-info btn-sm mr-5">
                        Save
                      </button>
                      <button
                        className="btn btn-info btn-sm mr-5"
                        onClick={() => handleMailModal()}
                      >
                        Save &amp; Email
                      </button>
                      {singleJobOrderData.isVerified ? (
                        <a
                          className="btn btn-info btn-sm"
                          onClick={() => handleInvoiceModal(verJobOrderId, 'hanger')}
                        >
                          Invoice
                        </a>
                      ) : (<></>)}

                      <PrintSchedule
                        label={'Print'}
                        className={"ml-5 btn-info btn-sm"}
                        componentName={'subModalPrint'}
                        verDefault={verDefault}
                        verificationFormData={verificationFormData}
                        filterFormSubmitted={filterFormSubmitted}
                        verJobOrderActiveType={verJobOrderActiveType}
                        subUserType={subUserType}
                        subUserTypeId={subUserTypeId}
                        subFormData={subFormData}
                        verJobOrderId={verJobOrderId}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>


          </div>

          {/* <div className="clear pad-15"></div> */}


        </form>

      </ReactModal>





      <ReactModal
        isOpen={isMailModalOpen}
        onRequestClose={closeMailModal}
        style={emailModalStyles}
        contentLabel="Email Purchase Order"
        initHeight={500}
        initWidth={700}
      >

        <div className="clear pad-15"></div>
        <h3>Email Purchase Order</h3>
        <form className="form-horizontal f-14" onSubmit={(e) => handleMailSubmit(e)}>
          <div className="row">
            <div className="col-md-12">
              <label className="control-label">
                To:
                <span className="text_red">*</span>
              </label>
              <input
                type="text"
                name="emailTo"
                value={mailFormData.emailTo || ''}
                onChange={(e) => onMailFormChange(e)}
                className={`form-control input-sm ${mailSubmitted && !mailFormData.emailTo ? 'ap-required' : ''}`}
              />
            </div>
            <div className="clear pad-15"></div>
            <div className="col-md-12">
              <label className="control-label">
                Message:
              </label>
              <textarea
                rows={3}
                name="emailMessage"
                onChange={(e) => onMailFormChange(e)}
                className={`form-control input-sm ${mailSubmitted && !mailFormData.emailMessage ? 'ap-required' : ''}`}
              ></textarea>
            </div>
          </div>
          <div className="clear pad-15"></div>
          <div className="pull-right">
            <button className="btn btn-default btn-sm mr-5"
              onClick={closeMailModal}
            >
              Close
            </button>
            <button type="submit" className="btn btn-info btn-sm">
              Send
            </button>
          </div>
        </form>
      </ReactModal>

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
)(SubModal);

