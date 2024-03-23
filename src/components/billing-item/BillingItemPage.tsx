import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';
import ReactModal from 'react-modal-resizable-draggable';
import * as billingItemActions from '../../redux/actions/billingItemActions';
import PropTypes from 'prop-types';
import {
  BillingItemReduxProps,
  BillingItemList,
  BillingItem,
  Target,
} from '../../types/interfaces';
import { TableHeader, Pagination, Search } from "../DataTable";
import { configs } from '../../types/Constants';
import { appConfig } from '../../types/AppConfig';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';

//Yellow code highliter 
const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('billingitemListTableBody');
  schTblBody!.querySelectorAll('tr').forEach(function (elem) {
    elem.classList.remove('slctdRow');
  });
  const slctdRowID = 'tblRow'+row!.id;
  const slctdRow = document.getElementById(slctdRowID);
  slctdRow!.classList.add('slctdRow');
};

Modal.setAppElement('#root');
const confirmModalStyles = {
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

const formModalStyles = {
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

const BillingItemPage = ({ billingItems, meta, actions }: BillingItemList) => {

  const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);
  const defaultFilterOptions: any = {
    status: 1,
    sortBy: 'nameASC',
    name: '',
    offset: 0,
    limit: itemPerPage,
    currentPage: 1,
  };

  const [filterFormData, setFilterFormData] = useState(defaultFilterOptions);
  // const [typingTimeout, setTypingTimeout] = useState(defaultTypingTimeout);
  const [filterFormSubmitted, setFilterFormSubmitted] = useState(false);

  const onSortByChange = (e: any) => {
    const value = e.target.value;
    const options = { ...filterFormData, sortBy: value};
    setFilterFormData(options);
    // actions.getAllBillingItems({ ...options });
  };

  const onFilterFormInputChange = (e: any) => {
    clearTimeout(typingTimeout);
    const value = e.target.value;
    const options = { ...filterFormData, name: value};
    setFilterFormData(options);
    // actions.getAllBillingItems({ ...options });
  };

  // useEffect(() => {
  //   setFilterFormSubmitted(true);
  //   if (filterFormData.name !== '') {
  //     const delayDebounce = setTimeout(() => {
  //       actions.getAllBillingItems({ ...filterFormData });
  //       setTypingTimeout(false);
  //     }, 1000);
  //     setTypingTimeout(delayDebounce);
  //   } else {
  //     actions.getAllBillingItems({ ...filterFormData });
  //   }
  // }, [filterFormData]);


  // useEffect(() => {
  //   actions.getAllUnits();
  //   actions.getAllBillingItems({ ...filterFormData });
  //   actions.getAllBillingItemGroups();
  // }, []);

  const defaultState = {
    id: 0,
    billingItemName: '',
    unit: '',
    measurementUnit: '',
    height: 0,
    heightUnits: 0,
    heightUnitName: '',
    length: 0,
    lengthUnits: 0,
    lengthUnitName: '',
    width: '',
    sqft: 0,
    itemPrice: 0,
    fogType: 0,
    groupId: 0,
    groupName: '',
    status: 1,
    sprayer: 1,
    taper: 1,
    hanger: 1,
    sander: 1,
  };

  interface IcurrentItem {
    [key: string]: any
  }
  const defaultCurrentItem: IcurrentItem = {
    key: '',
    value: '',
    id: 0
  };

  const defaultTypingTimeout: any = null;
  const [formData, setFormData] = useState(defaultState);
  const [formBillingData, setFormBillingData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);
  const [currentItem, setCurrentItem] = useState(defaultCurrentItem);
  const [typingTimeout, setTypingTimeout] = useState(defaultTypingTimeout);
  const [processingInput, setProcessingInput] = useState(false);
  const [tableFormData, setTableFormData] = useState(defaultState);
  const [currentItemKey, setCurrentItemKey] = useState('');

  const clearData = () => {
    setSubmitted(false);
    setFormBillingData({ ...defaultState });
    closeModal();
  };

  const { billingItems: billingItemsData } = billingItems;
  const { units: unitsData } = billingItems;
  const { billingItemGroups: billingItemGroupsData } = billingItems;


  const defaultConfirmModal: any = {
    id: 0,
    status: false
  };
  const [confirmModalData, setconfirmModalData] = React.useState(defaultConfirmModal);

  const closeConfirmModal = () => {
    setconfirmModalData({ ...defaultConfirmModal });
  };

  const handleConfirmModal = (e: any, id: number) => {
    e.preventDefault();
    setconfirmModalData({ id, status: true});
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    if (confirmModalData.id) {
      setTimeout(() => {
        actions.deleteBillingItem(confirmModalData.id);
        closeConfirmModal();
      }, 1000);
    } else {
      closeConfirmModal();
    }
  };


  const handleEdit = (e: any, billingItem: BillingItem) => {
    console.log(billingItem);
    e.preventDefault();
    setIsFormModalOpen(true);
    setFormBillingData({ ...defaultState, ...billingItem });
  };
  const onFormChange = (e: Target) => {
    setFormBillingData({ ...formBillingData, [e.target.name]: e.target.value });
  };
  // const onFormChange = (e: Target) => {
  //   const newValue = e.target.value;
  //   let value = typeof newValue === 'function' ? newValue('') : newValue;
    
  //   const decimalCount = (value.match(/\./g) || []).length;
  //   if (decimalCount > 1) {
  //     // More than one decimal point
  //     value = value.slice(0, value.lastIndexOf('.'));
  //   } else if (decimalCount === 1 && value.split('.')[1].length > 2) {
  //     // More than two decimal places
  //     value = parseFloat(value).toFixed(2);
  //   }
  //   setFormBillingData({ ...formBillingData, [e.target.name]: value });
  // };
  

  const onFormChangeHeight= (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const decimalCount = (value.match(/\./g) || []).length;
      if (decimalCount > 1) {
        value = value.slice(0, value.lastIndexOf('.'));
      } else if (decimalCount === 1 && value.split('.')[1].length > 2) {
        value = parseFloat(value).toFixed(2);
      }
      setFormBillingData({ ...formBillingData, [e.target.name]: value });
  };
  const onFormChangeLength= (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const decimalCount = (value.match(/\./g) || []).length;
      if (decimalCount > 1) {
        value = value.slice(0, value.lastIndexOf('.'));
      } else if (decimalCount === 1 && value.split('.')[1].length > 2) {
        value = parseFloat(value).toFixed(2);
      }
      setFormBillingData({ ...formBillingData, [e.target.name]: value });
  };

  const onFormDropdownChange = (e: any, id = 0) => {
    setFormBillingData({ ...formBillingData, [e.target.name]: e.target.value });
  };

  const onDropdownChange = (e: any, id = 0) => {
    const currentBillingItem = billingItemsData.find((billingItem) => billingItem.id === id);
    if (currentBillingItem) {
      const value = e.target.name === 'measurementUnit' ? e.target.value : parseInt(e.target.value, 10);
      setCurrentItem({ key: e.target.name, value, id });
      setFormData({
        ...currentBillingItem, ...{
          [e.target.name]: value
        }
      });
      // if (e.target.name === 'heightUnits') {
      //   const length = currentBillingItem.lengthUnits === 1 ? parseFloat((currentBillingItem.length / 12).toFixed(2)) : currentBillingItem.length;
      //   const height = value === 1 ? parseFloat((currentBillingItem.height / 12).toFixed(2)) : currentBillingItem.height;
      //   const sqftValue: number = parseFloat((length * height).toFixed(2));
      //   setFormData({
      //     ...currentBillingItem, ...{
      //       [e.target.name]: value,
      //       sqft: sqftValue
      //     }
      //   });
      // } else if (e.target.name === 'lengthUnits') {
      //   const length = value === 1 ? parseFloat((currentBillingItem.length / 12).toFixed(2)) : currentBillingItem.length;
      //   const height = currentBillingItem.heightUnits === 1 ? parseFloat((currentBillingItem.height / 12).toFixed(2)) : currentBillingItem.height;
      //   const sqftValue: number = parseFloat((length * height).toFixed(2));
      //   setFormData({
      //     ...currentBillingItem, ...{
      //       [e.target.name]: value,
      //       sqft: sqftValue
      //     }
      //   });
      // } else {
      //   setFormData({ ...currentBillingItem, [e.target.name]: value });
      // }
    }
  };

  const onCheckboxChange = (e: Target, id: number) => {
    const currentBillingItem = billingItemsData.find((billingItem) => billingItem.id === id);
    if (currentBillingItem) {
      const value = e.target.checked ? 1 : 0;
      setCurrentItem({ key: e.target.name, value, id });;
      setFormData({ ...currentBillingItem, [e.target.name]: value });
    }
  };

  const getCurrentValue = (key: string, id: number) => {
    if (!currentItem.id) {
      return;
    }
    if (currentItem.key === key && currentItem.id === id) {
      return currentItem.value;
    }
    return;
  }

  const onTextInputChange = (e: any, id = 0) => {
    if (currentItemKey && (e.target.name !== currentItemKey || id !== currentItem.id)) {
      return;
    }
    const currentBillingItem = billingItemsData.find((billingItem) => billingItem.id === id);
    if (currentBillingItem) {
      clearTimeout(typingTimeout);
      const value = e.target.value;
      setCurrentItem({ key: e.target.name, value, id });
      setFormData({ ...currentBillingItem, [e.target.name]: value });
      setCurrentItemKey(e.target.name);
    }
  };


  const getCurrentItemValue = (key: string, billingItem: any) => {
    const value = formData.id && formData.id === billingItem.id ? _.get(formData, key, '') : _.get(billingItem, key, '');
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const onNumberInputChange = (e: any, id = 0) => {
    
    if (currentItemKey && (e.target.name !== currentItemKey || id !== currentItem.id)) {
      return;
    }
    const currentBillingItem = billingItemsData.find((billingItem) => billingItem.id === id);
    if (currentBillingItem) {
      clearTimeout(typingTimeout);
      let value = e.target.value;
      const decimalCount = (value.match(/\./g) || []).length;
      if (decimalCount > 1) {
        // More than one decimal point
        value = value.slice(0, value.lastIndexOf('.'));
      } else if (decimalCount === 1 && value.split('.')[1].length > 2) {
        // More than two decimal places
        value = parseFloat(value).toFixed(2);
      }
  
      // Check if the input has at least 3 characters before allowing the redirect
      if (value.length >= 3) {
        setCurrentItem({ key: e.target.name, value, id });
        setFormData({ ...currentBillingItem, [e.target.name]: value });
        setCurrentItemKey(e.target.name);
      } else {
        // If the input has less than 3 characters, wait for more input before updating state
        setFormData({ ...currentBillingItem, [e.target.name]: value });
      }
    }
  };

  
  useEffect(() => {
    if (!formData.id) {
      return;
    }
    const length = formData.lengthUnits === 1 ? parseFloat((formData.length / 12).toFixed(2)) : formData.length;
    const height = formData.heightUnits === 1 ? parseFloat((formData.height / 12).toFixed(2)) : formData.height;
    const sqftValue: number = parseFloat((length * height).toFixed(2));
    if (sqftValue && sqftValue !== formData.sqft) {
      setFormData({
        ...formData, ...{
          sqft: sqftValue
        }
      });
    }
    const delayDebounce = setTimeout(() => {
      if (sqftValue && sqftValue === formData.sqft) {
        // console.log('form submit state', formData);
        actions.updateBillingItem(formData);
        window.location.reload();
      }
      setCurrentItemKey('');
      setCurrentItem(defaultCurrentItem);
      setTypingTimeout(false);
    }, 3000);
    setTypingTimeout(delayDebounce);
  }, [formData.height, formData.length, formData.width, formData.itemPrice, formData.sqft]);



  
//   useEffect(() => {
//     if (formData.id) {
//       console.log('yes', formData);
//       actions.updateBillingItem(formData);
//       setCurrentItemKey('');
//       setCurrentItem(defaultCurrentItem);
//     }
//   }, [  formData.measurementUnit,  formData.lengthUnits,  formData.heightUnits,  formData.groupId,  formData.fogType,  // formData.sqft
// ]);
  
  

  useEffect(() => {
    if (tableFormData.id) {
      // actions.updateBillingItem(tableFormData);
    }
  }, [tableFormData]);

  const getCurrentSQFT = (billingItem: any) => {
    if (billingItem.measurementUnit !== 'SQFT') {
      return '';
    }
    if (formData.id && formData.id === billingItem.id) {
      return Number(formData.sqft).toFixed(2);
    }
    return Number(billingItem.sqft).toFixed(2);
  };
  // const getCurrentSQFT = (billingItem: any) => {

  //   if (billingItem.measurementUnit !== 'SQFT') {
  //     return '';
  //   }
  //   if (formData.id && formData.id === billingItem.id) {
  //     return formData.sqft;
  //   }
  //   return billingItem.sqft;
  // };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log('____________________________');
    console.log(formBillingData);
    console.log('____________________________');

    setSubmitted(true);
    if (formBillingData.billingItemName) {
      if (!formBillingData.id) {
        actions.addBillingItem(formBillingData);
      } else {
        actions.updateBillingItem(formBillingData);
      }
      closeModal();
    }
  };


  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const closeModal = () => {
    setIsFormModalOpen(false);
    setSubmitted(false);
  };

  const handleFormModal = () => {
    setIsFormModalOpen(true);
    // setMailFormData({ ...mailFormData, id: jid });
  };

  const onFormCheckboxChange = (e: any) => {
    setFormBillingData({ ...formBillingData, [e.target.name]: (e.target.checked ? 1 : 0)  });
  };


  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });



  const initialBillingItemsData: any = [];
  const [newBillingItemsData, setNewBillingItemsData] = useState(initialBillingItemsData);

  // useEffect(() => {
  //   // console.log("Total Data Length =>", jobOrdersData.length);
  //   setTotalItems(billingItemsData.length);

  //   //Current Page slice
  //   let newSliceData = JSON.parse(JSON.stringify(billingItemsData)).slice(
  //       (currentPage - 1) * itemPerPage,
  //       (currentPage - 1) * itemPerPage + itemPerPage
  //   );
  //   setNewBillingItemsData(newSliceData);
  //   console.log(newSliceData);

  // }, [
  //   billingItems, billingItemsData, currentPage, search, sorting
  // ]);

  const changePerPage = (e: any) => {
    const pageValue = parseInt(e.target.value, 10);
    setItemPerPage(pageValue);

    //Current Page slice
    let newSliceData = JSON.parse(JSON.stringify(billingItemsData)).slice(
        (currentPage - 1) * pageValue,
        (currentPage - 1) * pageValue + pageValue
    );

    setNewBillingItemsData(newSliceData);
  }

  //Pagination End

  const renderGroupItems = (singleGroup: any, i: number, billingItemGroupId: any, billingItemId: any) => {
    if (billingItemId === appConfig.billingItems.highSheets.id || billingItemId === appConfig.billingItems.garageHighSheets.id) {
      return (
        <option key={i} value={singleGroup.id}>{singleGroup.groupName}</option>
      );
    } else if (singleGroup.id !== appConfig.billingItems.highSheets.groupId && singleGroup.id !== appConfig.billingItems.garageHighSheets.groupId) {
      return (
        <option key={i} value={singleGroup.id}>{singleGroup.groupName}</option>
      );
    }
  }






  // Pagination start
  const defaultPaginationOptions = {
    offset: 0,
    limit: itemPerPage,
    currentPage: 1,
  };
  const [paginationOptions, setPaginationOptions] = useState(defaultPaginationOptions);

  const onPerPageChange = (e: any) => {
    const pageValue = parseInt(e.target.value, 10);
    setItemPerPage(pageValue);
    setCurrentPage(1);
    const paginationUl = document.querySelector('.pagination') as HTMLElement | null;
      const firstLi = paginationUl?.querySelector('li:nth-child(2)') as HTMLElement | null;
      if (paginationUl) {
        const liElements = paginationUl.querySelectorAll('li');
        liElements.forEach((li) => {
          li.classList.remove('active');
        });
        // if (firstLi) {
        //   firstLi.classList.add('active');
        // }
      }
  }

  const getBillingItemsPaginated = (selectedPage: number) => {
    const limit = itemPerPage;
    setCurrentPage(selectedPage);
    const options = { page: selectedPage, limit, name: filterFormData.name, sortBy: filterFormData.sortBy, status: filterFormData.status };
    actions.getBillingItemList(options);
  };

  useEffect(() => {
    setFilterFormSubmitted(true);
    if (filterFormData.name !== '') {
      const delayDebounce = setTimeout(() => {
        actions.getBillingItemList({ ...filterFormData });
        setTypingTimeout(false);
      }, 1000);
      setTypingTimeout(delayDebounce);
    } else {
      // actions.getAllBillingItems({ ...filterFormData });
      actions.getBillingItemList({ ... filterFormData });
    }
  }, [filterFormData]);


  useEffect(() => {
    actions.getAllUnits();
    actions.getBillingItemList({ ...filterFormData });
    actions.getAllBillingItemGroups();
  }, []);


  useEffect(() => {
    actions.getBillingItemList({ ... filterFormData })
  }, [actions.getBillingItemList]);

  useEffect(() => {
    getBillingItemsPaginated(currentPage);
  }, [itemPerPage])

  const showData = () => {
    if (billingItems.loading) {
      return (
        <tr>
          <td colSpan={10} className="text-center">
            Loading...
          </td>
        </tr>
      )
    }
    if (!_.isEmpty(billingItemsData)) {
        return (
          <>
            {billingItemsData.map((billingItem: any, i:any) => (
              <tr key={billingItem.id} id={`tblRow${billingItem.id}`} onClick={()=>handleSelectedRow(billingItem)}>
                <td>
                {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                </td>
                <td>
                  <select
                    className="form-control input-sm"
                    name="billingItemName"
                    value={billingItem.id}
                    disabled={true}
                  >
                    <option value={0}>Select</option>
                    {billingItemsData.length > 0 ? billingItemsData.map((singleBillingItem, i) => (
                      <option key={i} value={singleBillingItem.id}>{singleBillingItem.billingItemName}</option>
                    )) : (<></>)}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control input-sm"
                    name="measurementUnit"
                    value={getCurrentValue('measurementUnit', billingItem.id) || billingItem.measurementUnit && billingItem.measurementUnit.toString() || ''}
                    onChange={(e) => onDropdownChange(e, billingItem.id)}
                  >
                    <option value=''>Select</option>
                    <option value={'SQFT'}>SQFT</option>
                    <option value={'EACH'}>EACH</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="itemPrice"
                    value={billingItem.measurementUnit === 'SQFT' ? '' : getCurrentItemValue('itemPrice', billingItem)}
                    onChange={(e) => onNumberInputChange(e, billingItem.id)}
                    className={`form-control input-sm ${submitted && !formData.itemPrice ? '' : ''}`}
                    disabled={billingItem.measurementUnit === 'SQFT' ? true : false}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="height"
                    value={getCurrentItemValue('height', billingItem)}
                    onChange={(e) => onNumberInputChange(e, billingItem.id)}
                    className={`form-control input-sm ${submitted && !formData.height ? '' : ''}`} inputMode="decimal"
                  />
                </td>
                <td>
                  <select
                    className="form-control input-sm"
                    name="heightUnits"
                    value={getCurrentValue('heightUnits', billingItem.id) || billingItem.heightUnits && billingItem.heightUnits.toString() || '0'}
                    onChange={(e) => onDropdownChange(e, billingItem.id)}
                  >
                    {/* <option value={0}>Select</option> */}
                    {unitsData && unitsData.length > 0 ? unitsData.map((unit, i) => (
                      <option key={i} value={unit.id}>{unit.unitName}</option>
                    )) : (<></>)}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="length"
                    value={getCurrentItemValue('length', billingItem)}
                    onChange={(e) => onNumberInputChange(e, billingItem.id)}
                    className={`form-control input-sm ${submitted && !formData.length ? '' : ''}`} inputMode="decimal"
                  />
                </td>
                <td>
                  <select
                    className="form-control input-sm"
                    name="lengthUnits"
                    value={getCurrentValue('lengthUnits', billingItem.id) || billingItem.lengthUnits && billingItem.lengthUnits.toString() || '0'}
                    onChange={(e) => onDropdownChange(e, billingItem.id)}
                  >
                    {/* <option value={0}>Select</option> */}
                    {unitsData && unitsData.length > 0 ? unitsData.map((unit, i) => (
                      <option key={i} value={unit.id}>{unit.unitName}</option>
                    )) : (<></>)}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    name="width"
                    value={getCurrentItemValue('width', billingItem)}
                    onChange={(e) => onTextInputChange(e, billingItem.id)}
                    className={`form-control input-sm ${submitted && !formData.width ? '' : ''}`}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="sqft"
                    value={getCurrentSQFT(billingItem) || ''}
                    disabled={billingItem.measurementUnit === 'SQFT' ? false : true}
                    className={`form-control input-sm ${submitted && !formData.sqft ? '' : ''}`}
                  />
                </td>
                <td>
                  <select
                    className="form-control input-sm"
                    name="groupId"
                    value={getCurrentValue('groupId', billingItem.id) || billingItem.groupId && billingItem.groupId.toString() || '0'}
                    onChange={(e) => onDropdownChange(e, billingItem.id)}
                  >
                    <option value={0}>Select Group</option>
                    {billingItemGroupsData && billingItemGroupsData.length > 0 ? billingItemGroupsData.map((singleGroup, i) => (
                      renderGroupItems(singleGroup, i, (getCurrentValue('groupId', billingItem.id) || billingItem.groupId && billingItem.groupId || 0), billingItem.id || 0)
                    )) : (<></>)}
                  </select>
                </td>
                {/* <td>
                  <div className="col-md-12">
                    <label>
                      <input
                        type="checkbox"
                        name="fogType"
                        checked={!!billingItem.fogType}
                        onChange={(e) => onCheckboxChange(e, billingItem.id)}
                        className={`${submitted && !formData.fogType ? '' : ''}`}
                      />
                    </label>
                  </div>
                </td> */}
                <td>
                  <a
                    href="#"
                    title="Edit"
                    className="text_grey_d"
                    onClick={(e) => handleEdit(e, billingItem)}
                  >
                    <i className="fa fa-edit fa-lg" />
                  </a>
                  <a
                    href="#"
                    title="Edit"
                    className="text_red"
                    onClick={(e) => handleConfirmModal(e, billingItem.id)}
                  >
                    <i className="fa fa-times-circle fa-lg" />
                  </a>
                </td>
              </tr>
            ))}
          </>
        )
    }

    if (billingItems.error) {
      return <p>{ billingItems.error }</p>
    }
    return <p>Unable to get data</p>
  }

  return (
    <>
      <div className="clear pad-40" />
      <div className="container">
        <div className="row">
          <div className="card ap-container">
            <div className="card-header">
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    Inventory Items
                    <br />
                    <small>Manage Inventory Items &amp; details</small>
                  </h3>
                </div>
                <div className="col-md-9 mt-20 text-right">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm mr-5"
                    onClick={() => handleFormModal()}
                  >
                    Add Item
                  </button>
                  {/* <button type="button" className="btn btn-info mr-5">
                    <i className="fas fa-arrow-circle-left mr-5" />
                    Return to Dashboard
                  </button> */}
                  {/* <button type="button" className="btn btn-primary">
                    <i className="fas fa-save mr-5" />
                    Save
                  </button> */}
                </div>
              </div>
            </div>


            <div className="card-body">
              <ReactModal
                isOpen={isFormModalOpen}
                onRequestClose={closeModal}
                style={formModalStyles}
                contentLabel="Email JIO"
                initHeight={500}
                initWidth={800}
              >
                <form className="form-horizontal" onSubmit={(e) => handleSubmit(e)}>
                  <h4 className="text_blue">
                    Billing Item Details
                  </h4>
                  <div className="clear pad-5" />
                  <div className="row">
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Item Name :
                        <span className="text_red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="billingItemName"
                          value={formBillingData.billingItemName || ''}
                          onChange={(e) => onFormChange(e)}
                          className={`form-control input-sm ${submitted && !formBillingData.billingItemName ? 'ap-required' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        M.Unit :
                      </label>
                      <div className="col-md-9">
                        <select
                          className="form-control input-sm"
                          name="measurementUnit"
                          value={formBillingData.measurementUnit.toString() || '0'}
                          onChange={(e) => onFormDropdownChange(e)}
                        >
                          <option value={0}>Select</option>
                          {unitsData && unitsData.length > 0 ? unitsData.map((unit, i) => (
                            <option key={i} value={unit.id}>{unit.unitName}</option>
                          )) : (<></>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Height :
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="height"
                          value={getCurrentItemValue('height', formBillingData)}
                          onChange={(e) => onFormChangeHeight(e)}
                          step="0.01"
                          className={`form-control input-sm ${submitted && !formBillingData.height ? '' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Height Units :
                      </label>
                      <div className="col-md-9">
                        <select
                          className="form-control input-sm"
                          name="heightUnits"
                          value={formBillingData.heightUnits.toString() || ''}
                          onChange={(e) => onFormDropdownChange(e)}
                        >
                          <option value={0}>Select</option>
                          {unitsData && unitsData.length > 0 ? unitsData.map((unit, i) => (
                            <option key={i} value={unit.id}>{unit.unitName}</option>
                          )) : (<></>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Length :
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="length"
                          value={getCurrentItemValue('length', formBillingData)}
                          onChange={(e) => onFormChangeLength(e)}
                          step="0.01"
                          className={`form-control input-sm ${submitted && !formBillingData.length ? '' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Length Units :
                      </label>
                      <div className="col-md-9">
                        <select
                          className="form-control input-sm"
                          name="lengthUnits"
                          value={formBillingData.lengthUnits.toString() || '0'}
                          onChange={(e) => onFormDropdownChange(e)}
                        >
                          <option value={0}>Select</option>
                          {unitsData && unitsData.length > 0 ? unitsData.map((unit, i) => (
                            <option key={i} value={unit.id}>{unit.unitName}</option>
                          )) : (<></>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Width :
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="width"
                          value={formBillingData.width || ''}
                          onChange={(e) => onFormChange(e)}
                          className={`form-control input-sm ${submitted && !formBillingData.width ? '' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Group :
                      </label>
                      <div className="col-md-9">
                        <select
                          className="form-control input-sm"
                          name="groupId"
                          value={formBillingData.groupId.toString() || '0'}
                          onChange={(e) => onFormDropdownChange(e)}
                        >
                          <option value={0}>Select Group</option>
                          {billingItemGroupsData && billingItemGroupsData.length > 0 ? billingItemGroupsData.map((singleGroup, i) => (
                            renderGroupItems(singleGroup, i, formBillingData.groupId || 0, formBillingData.id || 0)
                          )) : (<></>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-group col-md-12 mb-20 text-center">

                      <label className="checkbox-inline">
                        <input type="checkbox" name="hanger" value={formBillingData.hanger || 0} onChange={(e) => onFormCheckboxChange(e)} checked={!!formBillingData.hanger} />
                        Hanger
                      </label>
                      <label className="checkbox-inline">
                        <input type="checkbox" name="taper" value={formBillingData.taper || 0} onChange={(e) => onFormCheckboxChange(e)} checked={!!formBillingData.taper} />
                        Taper
                      </label>
                      <label className="checkbox-inline">
                        <input type="checkbox" name="sprayer" value={formBillingData.sprayer || 0} onChange={(e) => onFormCheckboxChange(e)} checked={!!formBillingData.sprayer} />
                        Sprayer
                      </label>
                      <label className="checkbox-inline">
                        <input type="checkbox" name="sander" value={formBillingData.sander || 0} onChange={(e) => onFormCheckboxChange(e)} checked={!!formBillingData.sander} />
                        Sander
                        </label>
                    </div>
                    {/* <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Fog Type :
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="fogType"
                          value={formData.fogType || ''}
                          onChange={(e) => onFormChange(e)}
                          className={`form-control ${submitted && !formData.fogType ? '' : ''}`}
                        />
                      </div>
                    </div> */}
                  </div>

                  {/* <div className="row">
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Status :
                        <span className="text_red">*</span>
                      </label>
                      <div className="col-md-9">
                        <select
                          className="form-control"
                          name="status"
                          value={formData.status.toString() || '1'}
                          // onChange={(e) => onStatusChange(e)}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>In-Active</option>
                        </select>
                      </div>
                    </div>
                  </div> */}

                  <div className="row">
                    <div className="col-md-12 mt-20 text-right">
                      <button type="button" className="btn btn-info btn-sm mr-5" onClick={() => clearData()}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm">
                        <i className="fas fa-save mr-5" />
                        Save
                      </button>
                    </div>
                  </div>

                  <hr />
                </form>
              </ReactModal>

              {/* <h4 className="text_blue">
                Billing Items
              </h4> */}
              <div className="clear pad-5" />


              <div className="row">
                <div className="text-right">
                <div className="pull-left">
                    <div className="">
                      <label className="col-md-3 control-label mt-5">
                        Name :
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="name"
                          value={filterFormData.name || ''}
                          className={`form-control input-sm`}
                          onChange={(e) => onFilterFormInputChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pull-right">
                    <div className="">
                      <label className="col-md-3 control-label mt-5">
                        Order :
                      </label>
                      <div className="col-md-9">
                        <select
                          className={`form-control input-sm`}
                          name="sortBy"
                          value={filterFormData.sortBy || ''}
                          onChange={(e) => onSortByChange(e)}
                        >
                          <option value={'nameASC'}>Name (ASC)</option>
                          <option value={'nameDESC'}>Name (DESC)</option>
                          <option value={'groupASC'}>Group (ASC)</option>
                          <option value={'groupDESC'}>Group (DESC)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="table-responsive">
                <table className="table table-bordered table-striped ap-table">
                  <thead>
                    <tr>
                      <th>
                        Sr.#
                      </th>
                      <th className="w-200">
                        Billing Item
                      </th>
                      <th className="w-90">
                        M.Unit
                      </th>
                      <th className="w-60">
                        PPITM
                      </th>
                      <th className="w-60">
                        Height
                      </th>
                      <th className="w-90">
                        Height Units
                      </th>
                      <th className="w-60">
                        Length
                      </th>
                      <th className="w-90">
                        Length Units
                      </th>
                      <th className="w-60">
                        Width
                      </th>
                      <th className="w-60">
                        SQFT
                      </th>
                      <th className="w-90">
                        Grouping
                      </th>
                      {/* <th>
                        Fog Type
                      </th> */}
                      <th className="w-80">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody id='billingitemListTableBody'>
                    {showData()}
                  </tbody>
                </table>

                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                  { !_.isEmpty(billingItemsData) && (
                    <>
                      <div className="col-md-6">
                        <ReactPaginate
                          pageCount={Math.ceil(meta.total / itemPerPage)}
                          pageRangeDisplayed={5} // 5
                          marginPagesDisplayed={2} // 2
                          onPageChange={(data) => getBillingItemsPaginated(data.selected + 1)}
                          previousLabel={'<'}
                          nextLabel={'>'}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          containerClassName={'pagination'}
                          activeClassName={'active'}
                        />
                      </div>
                      <div className="col-md-6">
                        <select name="itemPerPage" value={itemPerPage} className="form-control input-sm" style={{ width: '80px', float: 'right' }} onChange={(e) => onPerPageChange(e)}>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="40">40</option>
                          <option value="50">50</option>
                          <option value="80">80</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>


      <ReactModal
        isOpen={confirmModalData.status}
        onRequestClose={closeConfirmModal}
        style={confirmModalStyles}
        contentLabel="Confirm Delete"
        initHeight={200}
        initWidth={500}
      >

        <div className="clear pad-15"></div>
        <h3>Confirm</h3>
        <form className="form-horizontal" onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            <div className="col-md-12">
              Do you want to delete the record?
            </div>
          </div>
          <div className="clear pad-15"></div>
          <div className="pull-right">
            <button className="btn btn-default btn-sm mr-5"
              onClick={closeConfirmModal}
            >
              No
            </button>
            <button className="btn btn-info btn-sm" onClick={handleDelete}>
              Yes
            </button>
          </div>
        </form>
      </ReactModal>
    </>
  );
};

BillingItemPage.propTypes = {
  // billingItems: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: BillingItemReduxProps) => ({
  billingItems: state.billingItems,
  meta: state.billingItems.meta
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getBillingItemList: bindActionCreators(billingItemActions.getBillingItemList, dispatch),
    getAllBillingItems: bindActionCreators(billingItemActions.getAllBillingItems, dispatch),
    getBillingItem: bindActionCreators(billingItemActions.getBillingItem, dispatch),
    addBillingItem: bindActionCreators(billingItemActions.addBillingItem, dispatch),
    updateBillingItem: bindActionCreators(billingItemActions.updateBillingItem, dispatch),
    deleteBillingItem: bindActionCreators(billingItemActions.deleteBillingItem, dispatch),
    getAllUnits: bindActionCreators(billingItemActions.getAllUnits, dispatch),
    getAllBillingItemGroups: bindActionCreators(billingItemActions.getAllBillingItemGroups, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BillingItemPage);
