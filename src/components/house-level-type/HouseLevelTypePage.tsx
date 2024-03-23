import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';
import ReactModal from 'react-modal-resizable-draggable';
import * as houseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import PropTypes from 'prop-types';
import {
  HouseLevelTypeReduxProps,
  HouseLevelTypeList,
  HouseLevelType,
  Target,
} from '../../types/interfaces';
import { configs } from '../../types/Constants';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';

//Yellow code highliter 
const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('houselevetypeListTableBody');
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

const HouseLevelTypePage = ({ houseLevelTypes, meta, actions }: HouseLevelTypeList) => {




  useEffect(() => {
    // actions.getAllHouseLevelTypes();
  }, []);

  const defaultState = {
    id: 0,
    houseTypeName: '',
    status: 1,
    isFireBarrier: 0,
    garage: 0,
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
  const [houseLevelTypeData, setHouseLevelTypeData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);
  const [currentItem, setCurrentItem] = useState(defaultCurrentItem);

  const clearData = () => {
    setSubmitted(false);
    setHouseLevelTypeData({ ...defaultState });
    closeModal();
  };

  const { houseLevelTypes: houseLevelTypesData } = houseLevelTypes;


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
        actions.deleteHouseLevelType(confirmModalData.id);
        closeConfirmModal();
      }, 1000);
    } else {
      closeConfirmModal();
    }
  };


  const handleEdit = (e: any, houseLevelType: HouseLevelType) => {
    e.preventDefault();
    setIsFormModalOpen(true);
    setHouseLevelTypeData({ ...defaultState, ...houseLevelType });
  };

  const onFormChange = (e: Target) => {
    setHouseLevelTypeData({ ...houseLevelTypeData, [e.target.name]: e.target.value });
  };

  const onStatusChange = (e: any) => {
    setHouseLevelTypeData({ ...houseLevelTypeData, [e.target.name]: parseInt(e.target.value, 10) });
  };

  const onCheckboxChange = (e: Target) => {
    setHouseLevelTypeData({ ...houseLevelTypeData, [e.target.name]: e.target.checked ? 1 : 0 });
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





  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log('____________________________');
    console.log(houseLevelTypeData);
    console.log('____________________________');

    setSubmitted(true);
    if (houseLevelTypeData.houseTypeName) {
      if (!houseLevelTypeData.id) {
        actions.addHouseLevelType(houseLevelTypeData);
      } else {
        actions.updateHouseLevelType(houseLevelTypeData);
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


  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);

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
  
  const getHouseLevelTypesPaginated = (selectedPage: number) => {
    const limit = itemPerPage;
    setCurrentPage(selectedPage);
    const options = { page: selectedPage, limit };
    actions.getHouseLevelTypeList(options);
  };

  useEffect(() => {
    actions.getHouseLevelTypeList({ ... paginationOptions })
  }, [actions.getHouseLevelTypeList]);

  useEffect(() => {
    getHouseLevelTypesPaginated(currentPage);
  }, [itemPerPage])

  const showData = () => {
    if (houseLevelTypes.loading) {
      return (
        <tr>
          <td colSpan={10} className="text-center">
            Loading...
          </td>
        </tr>
      )
    }
    if (!_.isEmpty(houseLevelTypesData)) {
        return (
          <>
            {houseLevelTypesData.map((houseLevelType: any, i:any) => (
              <tr key={houseLevelType.id} id={`tblRow${houseLevelType.id}`} onClick={()=>handleSelectedRow(houseLevelType)}>
                <td>
                  { houseLevelType.houseTypeName}
                </td>
                <td>
                  {houseLevelType.status == 1 ? 'Active' : 'In-Active'}
                </td>
                <td>
                  <a
                    href="#"
                    title="Edit"
                    className="text_grey_d"
                    onClick={(e) => handleEdit(e, houseLevelType)}
                  >
                    <i className="fa fa-edit fa-lg" />
                  </a>
                  <a
                    href="#"
                    title="Edit"
                    className="text_red"
                    onClick={(e) => handleConfirmModal(e, houseLevelType.id)}
                  >
                    <i className="fa fa-times-circle fa-lg" />
                  </a>
                </td>
              </tr>
            ))}
          </>
        )
    }
    
    if (houseLevelTypes.error) {
      return <p>{ houseLevelTypes.error }</p>
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
                    House Level Types
                    <br />
                    <small>Manage House level Types &amp; details</small>
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
                    House Level Details
                  </h4>
                  <div className="clear pad-5" />
                  <div className="row">
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        House Type Name :
                        <span className="text_red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          name="houseTypeName"
                          value={houseLevelTypeData.houseTypeName || ''}
                          onChange={(e) => onFormChange(e)}
                          className={`form-control input-sm ${submitted && !houseLevelTypeData.houseTypeName ? 'ap-required' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                        Status :
                      </label>
                      <div className="col-md-9">
                        <select
                          className="form-control"
                          name="status"
                          value={houseLevelTypeData.status.toString() || '1'}
                          onChange={(e) => onStatusChange(e)}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>In-Active</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                      </label>
                      <div className="col-md-9">
                        <label>
                          <input
                            type="checkbox"
                            name="isFireBarrier"
                            checked={!!houseLevelTypeData.isFireBarrier}
                            onChange={(e) => onCheckboxChange(e)}
                            className="mr-5"
                          />
                            Fire Barrier
                        </label>
                      </div>
                    </div>

                    <div className="form-group col-md-6 mb-20">
                      <label className="col-md-3 control-label">
                      </label>
                      <div className="col-md-9">
                        <label>
                          <input
                            type="checkbox"
                            name="garage"
                            checked={!!houseLevelTypeData.garage}
                            onChange={(e) => onCheckboxChange(e)}
                            className="mr-5"
                          />
                            Garage
                        </label>
                      </div>
                    </div>

                  </div>







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

              <div className="table-responsive">
                <table className="table table-bordered table-striped ap-table">
                  <thead>
                    <tr>
                      {/* <th>
                        <input type="checkbox" />
                      </th> */}
                      <th className="w-200">
                        House Type Name
                      </th>
                      <th className="w-90">
                        Status
                      </th>
                      <th className="w-80">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody id='houselevetypeListTableBody'>
                    {showData()}
                  </tbody>
                </table>
                
                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                  { !_.isEmpty(houseLevelTypesData) && (
                    <>
                      <div className="col-md-6">
                        <ReactPaginate
                          pageCount={Math.ceil(meta.total / itemPerPage)}
                          pageRangeDisplayed={5} // 5
                          marginPagesDisplayed={2} // 2
                          onPageChange={(data) => getHouseLevelTypesPaginated(data.selected + 1)}
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

HouseLevelTypePage.propTypes = {
  // houseLevelTypes: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: HouseLevelTypeReduxProps) => ({
  houseLevelTypes: state.houseLevelTypes,
  meta: state.houseLevelTypes.meta,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getHouseLevelTypeList: bindActionCreators(houseLevelTypeActions.getHouseLevelTypeList, dispatch),
    getAllHouseLevelTypes: bindActionCreators(houseLevelTypeActions.getAllHouseLevelTypes, dispatch),
    getHouseLevelType: bindActionCreators(houseLevelTypeActions.getHouseLevelType, dispatch),
    addHouseLevelType: bindActionCreators(houseLevelTypeActions.addHouseLevelType, dispatch),
    updateHouseLevelType: bindActionCreators(houseLevelTypeActions.updateHouseLevelType, dispatch),
    deleteHouseLevelType: bindActionCreators(houseLevelTypeActions.deleteHouseLevelType, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HouseLevelTypePage);
