import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import History from '../common/History';
import * as ceilingFinishActions from '../../redux/actions/ceilingFinishActions';
import PropTypes from 'prop-types';
import {
  CeilingFinishReduxProps,
  CeilingFinishList,
  CeilingFinish,
  Target,
} from '../../types/interfaces';
import ReactModal from 'react-modal-resizable-draggable';
import { TableHeader, Pagination, Search } from "../DataTable";
import { configs } from '../../types/Constants';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';

//Yellow code highliter 
const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('ceiling_finishesTableBody');
  schTblBody!.querySelectorAll('tr').forEach(function (elem) {
    elem.classList.remove('slctdRow');
  });
  const slctdRowID = 'tblRow'+row!.id;
  const slctdRow = document.getElementById(slctdRowID);
  slctdRow!.classList.add('slctdRow');
};


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

const CeilingFinishPage = ({ ceilingFinishes, meta, actions }: CeilingFinishList) => {
  // useEffect(() => {
  //   actions.getAllCeilingFinishes();
  // }, [actions.getAllCeilingFinishes]);

  const defaultState = {
    id: 0, name: '', definition: '', type: '', fogged: 0, status: 1,
  };

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const clearData = () => {
    // setSubmitted(false);
    // setFormData({ ...defaultState });
    return History.push('/home');
  };

  const { ceilingFinishes: ceilingFinishesData } = ceilingFinishes;


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
        actions.deleteCeilingFinish(confirmModalData.id);
        closeConfirmModal();
      }, 1000);
    } else {
      closeConfirmModal();
    }
  };

  const handleEdit = (e: any, ceilingFinish: CeilingFinish) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...ceilingFinish });
  };

  const onFormChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
  };

  const onCheckboxChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked ? 1 : 0 });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (formData.name && formData.definition && formData.type) {
      if (!formData.id) {
        actions.addCeilingFinish(formData);
      } else {
        actions.updateCeilingFinish(formData);
      }
    }
  };

      //Pagination Start
      const [totalItems, setTotalItems] = useState(0);
      const [currentPage, setCurrentPage] = useState(1);
      const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);
      const [search, setSearch] = useState("");
      const [sorting, setSorting] = useState({ field: "", order: "" });


      const initialCeilingFinishData: any = [];
      const [ceilingFinishData, setCeilingFinishData] = useState(initialCeilingFinishData);

      useEffect(() => {
        // console.log("Total Data Length =>", jobOrdersData.length);
        setTotalItems(ceilingFinishesData.length);

        //Current Page slice
        let newSliceData = JSON.parse(JSON.stringify(ceilingFinishesData)).slice(
            (currentPage - 1) * itemPerPage,
            (currentPage - 1) * itemPerPage + itemPerPage
        );
        setCeilingFinishData(newSliceData);
        console.log(newSliceData);

      }, [
        ceilingFinishes, ceilingFinishesData, currentPage, search, sorting
      ]);

      const changePerPage = (e: any) => {
      const pageValue = parseInt(e.target.value, 10);
      setItemPerPage(pageValue);

        //Current Page slice
        let newSliceData = JSON.parse(JSON.stringify(ceilingFinishesData)).slice(
            (currentPage - 1) * pageValue,
            (currentPage - 1) * pageValue + pageValue
        );

        setCeilingFinishData(newSliceData);
      }

      //Pagination End

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
    
    const getCeilingFinishesPaginated = (selectedPage: number) => {
      const limit = itemPerPage;
      setCurrentPage(selectedPage);
      const options = { page: selectedPage, limit };
      actions.getCeilingFinishList(options);
    };

    useEffect(() => {
      actions.getCeilingFinishList({ ... paginationOptions })
    }, [actions.getCeilingFinishList]);

    useEffect(() => {
      getCeilingFinishesPaginated(currentPage);
    }, [itemPerPage])

    const showData = () => {
      if (ceilingFinishes.loading) {
        return (
          <tr>
            <td colSpan={10} className="text-center">
              Loading...
            </td>
          </tr>
        )
      }
      if (!_.isEmpty(ceilingFinishesData)) {
          return (
            <>
              {ceilingFinishesData.map((ceilingFinish: any, i:any) => (
                <tr key={ceilingFinish.id} id={`tblRow${ceilingFinish.id}`} onClick={()=>handleSelectedRow(ceilingFinish)}>
                <td>
                {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                </td>
                <td>
                  <strong>{ceilingFinish.name}</strong>
                </td>
                <td>
                  <strong>{ceilingFinish.definition}</strong>
                </td>
                <td>
                  <strong>{ceilingFinish.type}</strong>
                </td>
                <td>
                  {ceilingFinish.fogged == 1 ? 'Yes' : 'No'}
                </td>
                <td>
                  {ceilingFinish.status == 1 ? 'Active' : 'In-Active'}
                </td>
                <td>
                  <a
                    href="#"
                    title="Edit"
                    className="text_grey_d"
                    onClick={(e) => handleEdit(e, ceilingFinish)}
                  >
                    <i className="fa fa-edit fa-lg" />
                  </a>
                  <a
                    href="#"
                    title="Edit"
                    className="text_red"
                    onClick={(e) => handleConfirmModal(e, ceilingFinish.id)}
                  >
                    <i className="fa fa-times-circle fa-lg" />
                  </a>
                </td>
              </tr>
              ))}
            </>
          )
      }
      
      if (ceilingFinishes.error) {
        return <p>{ ceilingFinishes.error }</p>
      }
      return <p>Unable to get data</p>
    }

  return (
    <>
      <div className="clear pad-40" />
      <div className="container">
        <div className="row">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    Ceiling Finishes
                    <br />
                    <small>Manage Ceiling Finish & details</small>
                  </h3>
                </div>
                <div className="col-md-9 mt-20 text-right">
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
              <form className="form-horizontal" onSubmit={(e) => handleSubmit(e)}>
                <h4 className="text_blue">
                  Ceiling Finish Details
                </h4>
                <div className="clear pad-5" />
                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Name :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Definition :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="definition"
                        value={formData.definition || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.definition ? 'ap-required' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Type :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="type"
                        value={formData.type || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.type ? 'ap-required' : ''}`}
                      />
                    </div>
                  </div>
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
                      <label className="control-label">
                        <input
                          type="checkbox"
                          name="fogged"
                          checked={!!formData.fogged}
                          onChange={(e) => onCheckboxChange(e)}
                          className={`mr-5i ${submitted && !formData.fogged ? '' : ''}`}
                        />
                        FOGGED
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mt-20 text-right">
                    <button type="button" className="btn btn-info mr-5" onClick={() => clearData()}>
                      {/* <i className="fas fa-arrow-circle-left mr-5" /> */}
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save mr-5" />
                      Save
                    </button>
                  </div>
                </div>

                <hr />
                {/* <div className="clear pad-15" /> */}

                {/* <div className="row">
                  <div className="col-md-6 col-md-offset-3">
                    <div className="row">
                      <div className="col-sm-6 mb-5">
                        <button type="button" className="btn btn-info btn-block btn-lg">
                          <i className="fas fa-arrow-circle-left mr-5" />
                          Return to Schedule
                        </button>
                      </div>
                      <div className="col-sm-6">
                        <button type="submit" className="btn btn-primary btn-block btn-lg">
                          <i className="fas fa-save mr-5" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
              </form>

              <h4 className="text_blue">
                Ceiling Finishes
              </h4>
              <div className="clear pad-5" />

              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>
                        Sr.#
                      </th>
                      <th>
                        Name
                      </th>
                      <th>
                        Definition
                      </th>
                      <th>
                        Type
                      </th>
                      <th>
                        FOGGED
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody id="ceiling_finishesTableBody">
                    {showData()}
                  </tbody>
                </table>
  

                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                  { !_.isEmpty(ceilingFinishesData) && (
                    <>
                      <div className="col-md-6">
                        <ReactPaginate
                          pageCount={Math.ceil(meta.total / itemPerPage)}
                          pageRangeDisplayed={5} // 5
                          marginPagesDisplayed={2} // 2
                          onPageChange={(data) => getCeilingFinishesPaginated(data.selected + 1)}
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

CeilingFinishPage.propTypes = {
  // ceilingFinishes: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: CeilingFinishReduxProps) => ({
  ceilingFinishes: state.ceilingFinishes,
  meta: state.ceilingFinishes.meta,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getCeilingFinishList: bindActionCreators(ceilingFinishActions.getCeilingFinishList, dispatch),
    getAllCeilingFinishes: bindActionCreators(ceilingFinishActions.getAllCeilingFinishes, dispatch),
    getCeilingFinish: bindActionCreators(ceilingFinishActions.getCeilingFinish, dispatch),
    addCeilingFinish: bindActionCreators(ceilingFinishActions.addCeilingFinish, dispatch),
    updateCeilingFinish: bindActionCreators(ceilingFinishActions.updateCeilingFinish, dispatch),
    deleteCeilingFinish: bindActionCreators(ceilingFinishActions.deleteCeilingFinish, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CeilingFinishPage);
