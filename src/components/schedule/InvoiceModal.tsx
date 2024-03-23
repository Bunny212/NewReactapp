import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {bindActionCreators, Dispatch} from 'redux';
import Modal from 'react-modal';
import ReactModal from 'react-modal-resizable-draggable';
import _ from 'lodash';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {confirmAlert} from 'react-confirm-alert';
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import * as PurchaseOrderActions from '../../redux/actions/purchaseOrderActions';
import PrintSchedule from './PrintSchedule';
import 'react-confirm-alert/src/react-confirm-alert.css';

Modal.setAppElement('#root');
const emailModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '770px',
    overlfow: 'scroll',
    width: '50%',
  },
};

const invoiceModalStyles = {
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
  },
};

const InvoiceModal = ({
  subUserType,
  subUserTypeId,
  userTypeId,
  isInvoiceModalOpen,
  filterFormSubmitted,
  verJobOrderId,
  closeInvoiceModal,
  jobOrders,
  billingItems,
  houseLevelTypes,
  users,
  purchaseOrders,
  actions,
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
          columnOrder: 1,
        }],
      },
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
        columnOrder: 1,
      }],
    },
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
          totalValue: 0,
        }],
      },
    ],
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
    jobOrders,
  ]);


  const mailDefaultState = {
    id: 0,
    userId: 0,
    emailTo: '',
    emailMessage: '',
  };

  const invoiceMailDefaultState = {
    id: 0,
    userId: 0,
    emailTo: '',
    emailMessage: '',
    userType: '',
    contractor: '',
    jobAddress: '',
    builder: '',
  };

  const emptyList: any = [];

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
  // const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);
  const [subSubmitted, setSubSubmitted] = useState(false);
  const [subFormData, setSubFormData] = useState(defaultSubForm);

  // const [subFormData, setSubFormData] = useState(defaultSubForm);


  const { users: usersData } = users;
  const { activePurchaseOrder: activePurchaseOrderData } = purchaseOrders;

  const [isEditInvoice, setIsEditInvoice] = useState(false);
  const [editedItemsList, setEditedItemsList] = useState(emptyList);
  const [purchaseOrderFormData, setPurchaseOrderFormData] = useState(activePurchaseOrderData);


  const [mailFormData, setMailFormData] = useState(mailDefaultState);
  const [isMailModalOpen, setIsMailModalOpen] = React.useState(false);
  const [mailSubmitted, setMailSubmitted] = useState(false);
  const [isInvoiceMailModalOpen, setIsInvoiceMailModalOpen] = React.useState(false);
  const [invoiceMailSubmitted, setInvoiceMailSubmitted] = useState(false);
  const [invoiceMailFormData, setInvoiceMailFormData] = useState(invoiceMailDefaultState);


  useEffect(() => {
    // console.log('+++++++++++++++++++++++++++');
    // console.log(activePurchaseOrderData);
    // console.log('+++++++++++++++++++++++++++');

    setPurchaseOrderFormData({ ...purchaseOrderFormData, ...activePurchaseOrderData });
  }, [purchaseOrders.activePurchaseOrder]);

  const closeMailModal = () => {
    setIsMailModalOpen(false);
    setMailSubmitted(false);
  };

  const closeInvoiceMailModal = () => {
    setIsInvoiceMailModalOpen(false);
    setInvoiceMailSubmitted(false);
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
      userId: subUserTypeId,
    };
    setMailFormData({ ...mailFormData, ...currentData });
  };

  const onMailFormChange = (e: any) => {
    setMailFormData({ ...mailFormData, [e.target.name]: e.target.value });
  };

  const onInvoiceMailFormChange = (e: any) => {
    setInvoiceMailFormData({ ...invoiceMailFormData, [e.target.name]: e.target.value });
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

  const handleInvoiceMailSubmit = (e: any) => {
    e.preventDefault();
    setInvoiceMailSubmitted(true);

    console.log(invoiceMailFormData);
    // if (invoiceMailFormData.emailTo && invoiceMailFormData.emailMessage && actions.sendInvoiceEmail !== undefined) {
    if (invoiceMailFormData.emailTo && actions.sendInvoiceEmail !== undefined) {
      actions.sendInvoiceEmail(invoiceMailFormData);
    }
    setInvoiceMailFormData(invoiceMailDefaultState);
    closeInvoiceMailModal();
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
  };

  const getfilteredCurrentUserData = (usersData: any) => {
    console.log(usersData);
    const newData = usersData.filter((singleUser: any) => singleUser.id == subUserTypeId);
    return newData.length ? newData : '';
  };

  const setFormDataState = () => {
    if (verJobOrderData && verJobOrderData.length) {
      setSubFormData({ ...subFormData, ...verJobOrderData[0] });
    }


    if (jobOrders.activeHouseLevelStock !== undefined) {
      // console.log('sooooo', jobOrders.activeHouseLevelStock);
      // setFormData({...formData.houseLevels, ...defaultState.houseLevels})
      if (jobOrders.activeHouseLevelStock.jobOrderId) {
        const x = { ...jobOrders.activeHouseLevelStock };
        const verificationData = verificationDefault;
        const y = JSON.parse(JSON.stringify(verDefault)); // [...verificationDefault];

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
            }
            const xx = bi;
            // xx.itemValue = 0;
            xx.remainingValue = '';
            xx.totalValue = 0;
            // console.log('Existing Item -------');
            // console.log(existingItem);
            // console.log('--------------');
            return xx;
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
  };


  const onSubFormChange = (e: any) => {
    setSubFormData({ ...subFormData, [e.target.name]: e.target.value });
  };
  const onFormCheckboxChange = async (e: any) => {
    setPurchaseOrderFormData({ ...purchaseOrderFormData, [e.target.name]: e.target.checked ? 1 : 0 });
    if (actions.updatePurchaseOrder !== undefined) {
      purchaseOrderFormData[e.target.name] = e.target.checked ? 1 : 0;
      await actions.updatePurchaseOrder(purchaseOrderFormData);
    }
  };

  const closeModal = () => {
    // console.log('calling it', props.isInvoiceModalOpen);
    // setIsSubModalOpen(false);

    setIsEditInvoice(false);
    setEditedItemsList(emptyList);

    closeInvoiceModal();
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
      // actions.updateJobOrder(subFormData);

      // actions.updateHouseLevelStock(verJobOrderId, verificationFormData);
    }
    closeModal();
  };


  const getSelectedBillingItemField = (index: number, rowIndex: number) => {
    const x = { ...jobOrders.activeHouseLevelStock };


    const items = x.houseLevelStock.filter((item: any) => item.rowOrder == rowIndex && item.billingItems.some((singleItem: any) => singleItem.columnOrder == index)).map((item: any) => {
      const singleItem = { ...item };
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
  };
  const renderBillingItemsSelectList = () => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      items.push(<td style={{ width: '85px' }}>{renderBillingItemsHeader(i)}</td>);
    }
    return items;
  };

  const getSelectedBillingItem = (index: number) => {
    const items = verDefault.filter((item: any) => item.billingItems.some((singleItem: any) => singleItem.columnOrder == index)).map((item: any) => {
      const singleItem = { ...item };
      return singleItem.billingItems.filter((subItem: any) => subItem.columnOrder == index);
    }).flat();

    // console.log(items);
    // console.log('Billing items data');
    // console.log(billingItemsData);
    const itemId = items.length > 0 ? items[0].billingItemId : 0;
    const itemName = billingItemsData.filter((item: any) => item.id == itemId);
    // console.log(itemName);


    return itemName.length > 0 ? itemName[0].billingItemName : 'N/A';
  };

  const renderBillingItemsHeader = (index: number) => (
    <>
      { getSelectedBillingItem(index)}
    </>
  );


  const getSelectedHouseLevelType = (index: number) => {
    // const item = uniqueHouseLevelTypes.filter((item: any) => item.index == index);
    // return item && item.length ? item[0].value.toString() : '0';
  };
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
  };


  const onBillingItemInputChange = (e: any, rowIndex: number, index: number) => {
    const { value } = e.target;
    const b = [...verificationFormData.houseLevelStock];

    // console.log('Row, column and value', rowIndex, index, value);
    // console.log(b);

    const y = b.filter((item) => item.rowOrder == rowIndex && item.billingItems
      .some((billItem: any) => billItem.columnOrder == index));
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
  };


  const renderBillingItemsInputList = (rowIndex: number, billingItems: any, readOnly = false) => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      items.push(<>{renderBillingItemInput(rowIndex, i, billingItems, readOnly)}</>);
    }
    return items;
  };

  const renderBillingItemInput = (rowIndex: number, index: number, billingItems: any, readOnly: boolean) => {
    const value = billingItems.filter((item: any) => billingItemsData
      .some((singleItem: any) => item.columnOrder == index));

    if (readOnly) {
      const itemValue = value.length ? value[0].itemValue : '0';
      return (
        <div key={index} className="col-md-2" style={{ width: '10.333333%', paddingLeft: '5px', paddingRight: '5px' }}>
          <input
            type="text"
            name="billingItemId"
            value={itemValue || 0}
            readOnly={!!readOnly}
            // onChange={(e) => onBillingItemInputChange(e, rowIndex, index)}
            className="form-control input-sm"
          />
        </div>
      );
    }

    const itemValue = value.length ? value[0].remainingValue : '0';
    // console.log('+++++++++++++++++++');
    // console.log(value);
    return (
      <div key={index} className="col-md-2" style={{ width: '10.333333%', paddingLeft: '5px', paddingRight: '5px' }}>
        <input
          type="text"
          name="billingItemId"
          value={itemValue || 0}
          readOnly={!!readOnly}
          onChange={(e) => onBillingItemInputChange(e, rowIndex, index)}
          className="form-control input-sm"
        />
      </div>
    );
  };


  const renderBillingItemsTotalList = (rowIndex: number, billingItems: any, readOnly = false) => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      items.push(<>{renderBillingItemTotalValue(rowIndex, i, billingItems, readOnly)}</>);
    }
    return items;
  };

  const renderBillingItemTotalValue = (rowIndex: number, index: number, billingItems: any, readOnly: boolean) => {
    const value = billingItems.filter((item: any) => billingItemsData
      .some((singleItem: any) => item.columnOrder == index));


    const itemValue = value.length ? value[0].totalValue : 0;
    // console.log('+++++++++++++++++++');
    // console.log(value);
    return (
      <td>{itemValue || 0}</td>
    );
  };


  const handleEditInvoice = (e: any) => {
    e.preventDefault();
    setIsEditInvoice(true);
  };

  const updateGrandTotal = () => {
    if (purchaseOrderFormData.id) {
      const poData = purchaseOrderFormData;
      const poItemsData = purchaseOrderFormData.items || [];

      let total = 0;
      poItemsData.map((item: any, i: number) => {
        if (editedItemsList.includes(item.id)) {
          total += parseFloat(item.totalPrice);
        }
      });

      console.log(purchaseOrderFormData);
      console.log(total);
      console.log('999999999999999999999999');
      setPurchaseOrderFormData({ ...purchaseOrderFormData, total });
    }
  };

  const onItemUnitPriceChange = (e: any, id: any) => {
    let value = parseFloat(e.target.value);

    // Round the value to 2 decimal places and convert it back to a number
    value = parseFloat(value.toFixed(2));

    const poItemsData = purchaseOrderFormData.items || [];

    let total = 0;
    poItemsData.map((item: any, i: number) => {
        if (item.id == id) {
            item.unitPrice = value;
            item.totalPrice = (parseFloat(item.quantity) * value).toFixed(2);
        }
        total += parseFloat(item.totalPrice);
    });
    total = (isNaN(total) ? 0 : total);

    if (!editedItemsList.includes(id)) {
        setEditedItemsList([...editedItemsList, id]);
    }

    const updatedDiscount = parseFloat((total / 100 * purchaseOrderFormData.discountPercentage).toFixed(2));

    // Store the formatted value in state
    const formattedValue = value.toFixed(2);
    const poItemsFormattedData = poItemsData.map((item: any) => {
        if (item.id == id) {
            return {
                ...item,
                unitPriceFormatted: formattedValue,
            };
        }
        return item;
    });

    setPurchaseOrderFormData({
        ...purchaseOrderFormData,
        items: poItemsFormattedData,
        total,
        discount: updatedDiscount,
    });

    console.log(editedItemsList);
};

  

  const onItemQuantityChange = (e: any, id: any) => {
    // eslint-disable-next-line max-len
    const value = e.target.name == 'quantity' ? (parseInt(e.target.value, 10) < 0 ? 0 : parseInt(e.target.value, 10)) : e.target.value;

    const poItemsData = purchaseOrderFormData.items || [];

    let total = 0;
    poItemsData.map((item: any, i: number) => {
      if (item.id == id) {
        if (e.target.name == 'quantity') {
          item.quantity = value;
          item.totalPrice = (parseFloat(item.unitPrice) * value).toFixed(2);
        }


        if (e.target.name == 'billingItemName') {
          item.billingItemName = value;
        }
      }
      total += parseFloat(item.totalPrice);
    });
    if (!editedItemsList.includes(id)) {
      setEditedItemsList([...editedItemsList, id]);
    }
    const updatedDiscount = parseFloat((total / 100 * purchaseOrderFormData.discountPercentage).toFixed(2));

    setPurchaseOrderFormData({
      ...purchaseOrderFormData,
      items: poItemsData,
      total,
      discount: updatedDiscount,
    });

    console.log(editedItemsList);
  };

  const onDiscountPriceChange = (e: any) => {
    const value = parseFloat(e.target.value) < 0 ? 0 : parseFloat(e.target.value);
    console.log('-----------_____________');
    console.log(value);
    console.log(purchaseOrderFormData);

    // if (purchaseOrderFormData.total) {

    // }
    // let discountPercentage = purchaseOrderFormData.discountPercentage;
    // let discount = purchaseOrderFormData.discount;

    const poItemsData = purchaseOrderFormData.items || [];

    const discount = parseFloat((value / 100 * purchaseOrderFormData.total).toFixed(2));
    // const total = parseFloat((purchaseOrderFormData.total - discount).toFixed(2));
    console.log(discount);
    setPurchaseOrderFormData({
      ...purchaseOrderFormData,
      discountPercentage: value,
      discount,
      // total
    });
    // updateGrandTotal();
  };

  const getGrandTotal = () => {
    const total = purchaseOrderFormData.total || 0;
    const discount = purchaseOrderFormData.discount || 0;
    return parseFloat((total - discount).toFixed(2));
  };


  const handleUpdateInvoice = async (e: any) => {
    e.preventDefault();

    if (actions.updatePurchaseOrder !== undefined) {
      console.log('purchaseOrderFormData => ', purchaseOrderFormData);
      await actions.updatePurchaseOrder(purchaseOrderFormData);
      setIsEditInvoice(false);
      setEditedItemsList(emptyList);
    }
  };

  const onDropdownChange = (e: any, id: any) => {
    console.log('Value =>', e.target.value, ' Name => ', e.target.name);


    console.log('purchaseOrderFormData => ', purchaseOrderFormData.items);
    const currentBillingItem = purchaseOrderFormData.items.find((billingItem: any) => billingItem.billingItemId === id);
    console.log('currentBillingItem => ', currentBillingItem);
    currentBillingItem.billingItemId = e.target.value;
    // purchaseOrderFormData.items.push(currentBillingItem);
    setPurchaseOrderFormData({ ...purchaseOrderFormData, currentBillingItem });

    console.log('After Change => ', purchaseOrderFormData);
  };

  // useEffect(() => {
  //   console.log('333333333333333333 updated');

  //   setIsEditInvoice(false);
  //   setEditedItemsList(emptyList);

  //   // closeModa();
  //   // console.log('yes working here...');
  // }, [
  //   actions.updatePurchaseOrder
  // ]
  // );


  // console.log('-----------------this');
  // console.log(purchaseOrderFormData);
  // console.log('this is it------------------');
  const renderBillingItemsTotalListRow = () => {
    const items: any = [0, 0, 0, 0, 0, 0];
    const itemsList: any = [
      // { billingItemId: 0, value: 0, }
    ];
    verificationFormData.houseLevelStock.map((singleLevel: any, i: any) => {
      for (let i = 1; i <= 8; i++) {
        const value = singleLevel.billingItems.filter((item: any) => billingItemsData
          .some((singleItem: any) => item.columnOrder == i));
        const itemValue = value.length ? value[0].totalValue : 0;
        items.sort(fieldSorter(['columnOrder']));
        items[i - 1] = parseInt(items[i - 1], 10) + parseInt(itemValue, 10);

        if (value.length > 0) {
          itemsList.push({
            // value: items[i - 1],
            ...value[0],
          });
        }
      }
    });

    // console.log(itemsList);


    if (!(purchaseOrderFormData && purchaseOrderFormData.id !== undefined)) {
      return (<></>);
    }

    if (purchaseOrderFormData.isSystemOrder == 1) {
      // purchaseOrderFormData.items.sort(fieldSorter(['columnOrder']));
    }

    return (
      <>

        {purchaseOrderFormData && purchaseOrderFormData.items && purchaseOrderFormData.items
        //.filter((purchaseOrderItem: any) => purchaseOrderItem.quantity > 0)
        .map((purchaseOrderItem: any, i: any) => (
          <Draggable
            key={purchaseOrderItem.id}
            draggableId={purchaseOrderItem.id.toString()}
            index={i}
          >
            {(provided) => (
              <tr
                key={purchaseOrderItem.id}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                <td style={{ textAlign: 'center' }}>
                  {(isEditInvoice && purchaseOrderItem.billingItemId >= 1000) ? (
                    <>
                      <input type="text" name="billingItemName" value={purchaseOrderItem.billingItemName || ''} onChange={(e) => onItemQuantityChange(e, purchaseOrderItem.id)} className="form-control input-sm" onKeyDown={(e) => handleEnter(e)} />
                    </>
                  ) : (
                    <>
                      {purchaseOrderItem.billingItemName}
                    </>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {isEditInvoice ? (
                    <>
                      <div className="text-center">
                        <input
                          type="number"
                          name="quantity"
                          value={purchaseOrderItem.quantity || 0}
                          onChange={(e) => onItemQuantityChange(e, purchaseOrderItem.id)}
                          className="form-control input-sm w-80i invoice-input-number"
                          onKeyDown={(e) => handleEnter(e)}
                        />
                      </div>

                    </>
                  ) : (
                    <>
                      {purchaseOrderItem.quantity}
                    </>
                  )}


                </td>
                <td style={{ textAlign: 'center' }}>
                  {isEditInvoice ? (
                    <>
                      <div className="text-center">
                      <div className="text-center">
                          <input
                            type="number"
                            name="unitPrice"
                            value={purchaseOrderItem.unitPrice || 0}
                          // readOnly={readOnly ? true : false}
                            onChange={(e) => onItemUnitPriceChange(e, purchaseOrderItem.id)}
                            className="form-control input-sm w-80i invoice-input-number"
                            step="0.01"
                            onKeyDown={(e) => handleEnter(e)}
                            onBlur={(e) => {
                              const value = parseFloat(e.target.value) < 0 ? 0 : parseFloat(e.target.value);
                              const formattedValue = value.toFixed(2);
                              e.target.value = formattedValue;
                              onItemUnitPriceChange(e, purchaseOrderItem.id);
                            }}
                          />
                        </div>


                      </div>

                    </>
                  ) : (
                    <>
                      $
                      {purchaseOrderItem.unitPrice.toFixed(2)}
                    </>
                  )}

                </td>
                <td style={{ textAlign: 'center' }}>
                  $
                  {(isNaN(purchaseOrderItem.totalPrice) ? 0 : parseFloat(purchaseOrderItem.totalPrice).toFixed(2))}
                </td>
                <td style={{ textAlign: 'center', padding: '4px' }}>
                  {(isEditInvoice && purchaseOrderItem.billingItemId >= 1000) ? (
                    <>
                      <a
                        className="btn btn-danger btn-sm mr-5"
                        onClick={(e) => handleRemoveLastItem(e, purchaseOrderItem.id)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </a>
                    </>
                  ) : (<></>)}
                </td>
              </tr>
            )}
          </Draggable>
        ))}

      </>
    );
  };

  const handleEnter = (event: any) => {
    if (event.keyCode === 13) {
      const { form } = event.target;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };

  const fieldSorter = (fields: any) => function (a: any, b: any) {
    return fields
      .map((o: any) => {
        let dir = 1;
        if (o[0] === '-') {
          dir = -1;
          o = o.substring(1);
        }
        if (!parseInt(a[o]) && !parseInt(b[o])) {
          if (a[o] > b[o]) return dir;
          if (a[o] < b[o]) return -(dir);
          return 0;
        }
        return dir > 0 ? a[o] - b[o] : b[o] - a[o];
      })
      .reduce((p: any, n: any) => (p || n), 0);
  };

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
  };

  const saveAndEmailInvoice = (e: any) => {
    const userData = getfilteredCurrentUserData(usersData);

    console.log('Single user data => ', userData);

    setIsInvoiceMailModalOpen(true);

    const currentData = {
      id: verJobOrderId,
      userId: subUserTypeId,
      userType: subUserType,
      contractor: getfilteredCurrentUserName(usersData),
      jobAddress: (`${singleJobOrderData.address}, ${singleJobOrderData.cityName}`),
      builder: singleJobOrderData.builderName,
      emailTo: ((userData.length > 0) ? userData[0].email : ''),
    };

    setInvoiceMailFormData({ ...invoiceMailFormData, ...currentData });

    console.log('invoiceMailFormData => ', invoiceMailFormData);
  };

  const handleAddNewItem = (e: any) => {
    purchaseOrderFormData.items.sort(fieldSorter(['columnOrder']));

    const lastCount = purchaseOrderFormData.items.length;
    const lastRecord = purchaseOrderFormData.items[lastCount - 1];

    console.log('lastCount => ', lastCount);
    console.log('lastRecordInList => ', lastRecord);

    const newObj = {
      id: Math.floor(100000 + Math.random() * 900000),
      billingItemId: 1001,
      billingItemName: '',
      quantity: 0,
      originalPrice: 0,
      unitPrice: 0,
      totalPrice: 0,
      rowOrder: 1,
      columnOrder: (lastRecord.columnOrder + 1),
    };

    setPurchaseOrderFormData({ ...purchaseOrderFormData, items: [...purchaseOrderFormData.items, newObj] });

    console.log('after adding item => ', purchaseOrderFormData.items);
  };

  const handleRemoveLastItem = (e: any, id: any) => {
    console.log('handleRemoveLastItem', isInvoiceModalOpen, 'currnet Id => ', id);

    const removeIndex = purchaseOrderFormData.items.findIndex((item: any) => item.id === id);

    let remaining = 0;
    purchaseOrderFormData.items.map((item: any, i: number) => {
      if (item.id == id) {
        remaining = (purchaseOrderFormData.total - parseFloat(item.totalPrice));
      }
    });

    purchaseOrderFormData.items.splice(removeIndex, 1);
    setPurchaseOrderFormData({ ...purchaseOrderFormData, items: purchaseOrderFormData.items });

    const updatedDiscount = parseFloat((remaining / 100 * purchaseOrderFormData.discountPercentage).toFixed(2));
    setPurchaseOrderFormData({ ...purchaseOrderFormData, total: remaining, discount: updatedDiscount });
  };

  const onDragEnd = (e: any) => {
    console.log(e);
    if (isEditInvoice) {
      if (!e.destination) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const sorted = reorder(purchaseOrderFormData.items, e.source.index, e.destination.index);
      console.log(sorted);

      setPurchaseOrderFormData({ ...purchaseOrderFormData, items: [...sorted] });
      console.log('purchaseOrderFormData => ', purchaseOrderFormData);
    }
  };

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const regenerateInvoice = (e: any) => {
    e.preventDefault();
    confirmAlert({
      title: 'Confirm Re-Create',
      message: 'Do you really want to re-create this invoice?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const purchaseOrderObj = {
              userId: subUserTypeId,
              userTypeId,
              jobOrderId: verJobOrderId,
              userType: subUserType,
              isSystemOrder: 1,
              reCreate: 2,
            };

            if (actions.addPurchaseOrder !== undefined && verJobOrderId && subUserTypeId) {
              actions.addPurchaseOrder(purchaseOrderObj);
            }
          },
        },
        {
          label: 'No',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <>
      <ReactModal
        isOpen={isInvoiceModalOpen}
        onRequestClose={closeModal}
        style={invoiceModalStyles}
        contentLabel="Verification"
        initHeight={770}
        initWidth={770}
      >
        <div style={isEditInvoice ? { width: '100%', height: '100%', overflowY: 'scroll' } : {}}>

          <form className="form-horizontal f-14" onSubmit={(e) => handleSubSubmit(e)}>
            {!!(purchaseOrderFormData.isPaid && purchaseOrderFormData.isPaid == '1') && (
            <h1 className="paidCls">PAID</h1>
            ) }
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
                  <tr style={{ borderTop: '1px solid black', fontSize: '16px', color: 'black' }}>
                    <td colSpan={2} style={{ textAlign: 'center' }}>Invoice</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid black', fontSize: '16px', color: 'black' }}>
                    <td>
                    <div className="markPaidOCls" style={{ marginTop: "5px" }}>
                        <label className="checkbox-inline verifyCls">
                          <input type="checkbox" name="isPaid" value="1" checked={!!purchaseOrderFormData.isPaid} onChange={(e) => onFormCheckboxChange(e)} />
                          Mark as Paid
                        </label>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      Creation Date:
                      {' '}
                      {moment(purchaseOrderFormData.invoiceDate).format('dddd, MMMM DD, YYYY')}
                      {
                        purchaseOrderFormData.isPaid == 1 && (
                          <div>
                          Invoice Paid Date:
                          {' '}
                          {moment(purchaseOrderFormData.paidAt).format('dddd, MMMM DD, YYYY')}
                          </div>
                        )
                      }

                    </td>
                  </tr>
                  <tr>

                  </tr>


                  <tr style={{}}>
                    <td style={{
                      borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px', paddingTop: '10px', width: '300px',
                    }}
                    >
                      { getSubUserTypeLabel() || '' }
                      {' '}
                      Sub Contractor:
                    </td>
                    <td style={{
                      width: '400px', paddingLeft: '10px', paddingBottom: '10px', paddingTop: '10px',
                    }}
                    >
                      {getfilteredCurrentUserName(usersData)}
                    </td>
                  </tr>
                  <tr style={{}}>
                    <td style={{
                      borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px',
                    }}
                    >
                      Job Address:
                    </td>
                    <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                      {singleJobOrderData.address || ''}
                      ,
                      {' '}
                      {singleJobOrderData.cityName || ''}
                    </td>
                  </tr>
                  <tr style={{}}>
                    <td style={{
                      borderRight: '1px solid black', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', paddingBottom: '10px',
                    }}
                    >
                      Builder:
                    </td>
                    <td style={{ paddingLeft: '10px', paddingBottom: '10px' }}>{singleJobOrderData.builderName}</td>
                  </tr>

                  <tr style={{}}>

                    <td colSpan={2} style={{ paddingRight: '10px', paddingLeft: '10px', paddingBottom: '10px' }}>

                      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
                        <Droppable droppableId="Table">
                          {(provided) => (
                            <table {...provided.droppableProps} ref={provided.innerRef}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid black' }}>
                                  {/* {renderBillingItemsSelectList()} */}
                                </tr>

                                <tr style={{ borderBottom: '1px solid black' }}>
                                  <th style={{ textAlign: 'center' }}>SINo</th>
                                  <th style={{ textAlign: 'center' }}>Item Description</th>
                                  <th style={{ textAlign: 'center' }}>Quantity</th>
                                  <th style={{ textAlign: 'center' }}>Unit Price</th>
                                  <th style={{ textAlign: 'center' }}>Price</th>
                                  <th style={{ textAlign: 'center' }} />
                                </tr>
                              </thead>
                              <tbody>
                                {renderBillingItemsTotalListRow()}

                                {(isEditInvoice)
                                  ? (
                                    <tr>
                                      <td colSpan={6} style={{ textAlign: 'right', padding: '10px' }}>
                                        <a
                                          className="btn btn-warning btn-sm mr-5"
                                          onClick={(e) => handleAddNewItem(e)}
                                        >
                                          Add New Item
                                        </a>
                                      </td>
                                    </tr>
                                  ) : (<></>)}

                                <tr style={{ borderBottom: '1px solid black', borderTop: '1px solid black', padding: '10px' }}>
                                  <td colSpan={3} style={{ textAlign: 'right' }}>
                                    <strong>Discount:</strong>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {!isEditInvoice ? (
                                      <>
                                        {`${purchaseOrderFormData.discountPercentage} %` || '0.00 %'}
                                      </>
                                    ) : (
                                      <>
                                        <div className="text-center">
                                          <input
                                            type="number"
                                            name="discountPercentage"
                                            value={purchaseOrderFormData.discountPercentage || 0}
                                          // readOnly={readOnly ? true : false}
                                            onChange={(e) => onDiscountPriceChange(e)}
                                            className="form-control input-sm w-80i invoice-input-number"
                                          />
                                          %
                                        </div>
                                      </>
                                    )}

                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {purchaseOrderFormData && purchaseOrderFormData.discount ? (
                                      <>
                                        $
                                        {`( ${purchaseOrderFormData.discount} )` || '( $0.00 )'}
                                      </>
                                    ) : (
                                      <>( $0.00 )</>
                                    )}
                                  </td>
                                </tr>

                                <tr style={{}}>
                                  <td colSpan={4} style={{ textAlign: 'right' }}>
                                    <strong>Grand Total:</strong>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {purchaseOrderFormData && purchaseOrderFormData.total ? (
                                      <>
                                        $
                                        {getGrandTotal().toFixed(2) || 0.00}
                                      </>
                                    ) : (
                                      <>$0.00</>
                                    )}
                                  </td>
                                </tr>
                                {provided.placeholder}
                              </tbody>
                            </table>
                          )}
                        </Droppable>
                      </DragDropContext>


                    </td>
                  </tr>

                  <tr style={{}}>
                    <td colSpan={2} style={{ textAlign: 'center' }}>
                      <div className="text-center">
                        <div className="clear pad-15" />
                        {/* eslint-disable-next-line react/button-has-type */}
                        <button
                          className="btn btn-default btn-sm mr-5"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                        {isEditInvoice ? (
                          <>
                            {/* eslint-disable-next-line react/button-has-type */}
                            <button
                              className="btn btn-info btn-sm mr-5"
                              onClick={(e) => handleUpdateInvoice(e)}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            {/* eslint-disable-next-line react/button-has-type */}
                            <button
                              className="btn btn-info btn-sm mr-5"
                              onClick={(e) => handleEditInvoice(e)}
                            >
                              Edit
                            </button>
                          </>
                        )}
                        {/* eslint-disable-next-line react/button-has-type */}
                        <button
                          className="btn btn-success btn-sm mr-5"
                          onClick={(e) => saveAndEmailInvoice(e)}
                        >
                          Email This Invoice
                        </button>
                        <PrintSchedule
                          label="Print"
                          className="ml-5 btn-info btn-sm"
                          componentName="invoiceModalPrint"
                          verDefault={verDefault}
                          verificationFormData={verificationFormData}
                          filterFormSubmitted={filterFormSubmitted}
                          purchaseOrderFormData={purchaseOrderFormData}
                          subUserType={subUserType}
                          subUserTypeId={subUserTypeId}
                          verJobOrderId={verJobOrderId}
                        />
                        {/* eslint-disable-next-line react/button-has-type */}
                        <button
                          className="btn btn-warning btn-sm mr-5 ml-5"
                          onClick={(e) => regenerateInvoice(e)}
                        >
                          Re-Create
                        </button>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>


            </div>

            {/* <div className="clear pad-15"></div> */}


          </form>
        </div>

      </ReactModal>


      <ReactModal
        isOpen={isInvoiceMailModalOpen}
        onRequestClose={closeInvoiceMailModal}
        style={emailModalStyles}
        contentLabel="Email Invoice"
        initHeight={500}
        initWidth={500}
      >

        <div className="clear pad-15" />
        <h3>Email Invoice</h3>
        <form className="form-horizontal" onSubmit={(e) => handleInvoiceMailSubmit(e)}>
          <div className="row">
            <div className="col-md-12">
              <label className="control-label">
                To:
                <span className="text_red">*</span>
              </label>
              <input
                type="text"
                name="emailTo"
                value={invoiceMailFormData.emailTo || ''}
                onChange={(e) => onInvoiceMailFormChange(e)}
                className={`form-control input-sm ${invoiceMailSubmitted && !invoiceMailFormData.emailTo ? 'ap-required' : ''}`}
              />
            </div>
            <div className="clear pad-15" />
            <div className="col-md-12">
              <label className="control-label">
                Message:
              </label>
              <textarea
                rows={5}
                name="emailMessage"
                onChange={(e) => onInvoiceMailFormChange(e)}
                className={`form-control ${invoiceMailSubmitted && !invoiceMailFormData.emailMessage ? 'ap-required' : ''}`}
              />
            </div>
          </div>
          <div className="clear pad-15" />
          <div className="pull-right">
            <button
              className="btn btn-default mr-5"
              onClick={closeInvoiceMailModal}
            >
              Close
            </button>
            <button type="submit" className="btn btn-info">
              Send
            </button>
          </div>
        </form>
      </ReactModal>


      <ReactModal
        isOpen={isMailModalOpen}
        onRequestClose={closeMailModal}
        style={emailModalStyles}
        contentLabel="Email Purchase Order"
        initHeight={500}
        initWidth={500}
      >

        <div className="clear pad-15" />
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
                className={`form-control input-sm ${mailSubmitted && !mailFormData.emailTo ? 'ap-required' : ''}`}
              />
            </div>
            <div className="clear pad-15" />
            <div className="col-md-12">
              <label className="control-label">
                Message:
              </label>
              <textarea
                rows={5}
                name="emailMessage"
                onChange={(e) => onMailFormChange(e)}
                className={`form-control ${mailSubmitted && !mailFormData.emailMessage ? 'ap-required' : ''}`}
              />
            </div>
          </div>
          <div className="clear pad-15" />
          <div className="pull-right">
            <button
              className="btn btn-default mr-5"
              onClick={closeMailModal}
            >
              Close
            </button>
            <button type="submit" className="btn btn-info">
              Send
            </button>
          </div>
        </form>
      </ReactModal>

    </>
  );
};

const mapStateToProps = (state: any) => ({
  jobOrders: state.jobOrders,
  billingItems: state.billingItems,
  houseLevelTypes: state.houseLevelTypes,
  users: state.users,
  invoices: state.invoices,
  purchaseOrders: state.purchaseOrders,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    sendPurchaseOrderEmail: bindActionCreators(JobOrderActions.sendPurchaseOrderEmail, dispatch),
    sendInvoiceEmail: bindActionCreators(JobOrderActions.sendInvoiceEmail, dispatch),
    updateJobOrder: bindActionCreators(JobOrderActions.updateJobOrder, dispatch),
    getHouseLevelStock: bindActionCreators(JobOrderActions.getHouseLevelStock, dispatch),
    updateHouseLevelStock: bindActionCreators(JobOrderActions.updateHouseLevelStock, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
    getAllHouseLevelTypes: bindActionCreators(HouseLevelTypeActions.getAllHouseLevelTypes, dispatch),
    updatePurchaseOrder: bindActionCreators(PurchaseOrderActions.updatePurchaseOrder, dispatch),
    addPurchaseOrder: bindActionCreators(PurchaseOrderActions.addPurchaseOrder, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InvoiceModal);
