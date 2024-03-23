import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import History from '../common/History';
import * as garageFinishActions from '../../redux/actions/garageFinishActions';
import PropTypes from 'prop-types';
import {
  GarageFinishReduxProps,
  GarageFinishList,
  GarageFinish,
  Target,
} from '../../types/interfaces';
import ReactModal from 'react-modal-resizable-draggable';
import { TableHeader, Pagination, Search } from "../DataTable";
import { configs } from '../../types/Constants';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';

//Yellow code highliter 
const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('garagefinishListTableBody');
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

const GarageFinishPage = ({ garageFinishes, meta, actions }: GarageFinishList) => {
  // useEffect(() => {
    // actions.getAllGarageFinishes();
  // }, [actions.getAllGarageFinishes]);

  const defaultState = {
    id: 0, name: '', status: 1,
  };

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const clearData = () => {
    // setSubmitted(false);
    // setFormData({ ...defaultState });
    return History.push('/home');
  };

  const { garageFinishes: garageFinishesData } = garageFinishes;


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
        actions.deleteGarageFinish(confirmModalData.id);
        closeConfirmModal();
      }, 1000);
    } else {
      closeConfirmModal();
    }
  };


  const handleEdit = (e: any, garageFinish: GarageFinish) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...garageFinish });
  };

  const onFormChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    console.log(formData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (formData.name) {
      if (!formData.id) {
        actions.addGarageFinish(formData);
      } else {
        actions.updateGarageFinish(formData);
      }
    }
  };

    //Pagination Start
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);


    const defaultPaginationOptions = {
      offset: 0,
      limit: itemPerPage,
      currentPage: 1,
    };
    const [paginationOptions, setPaginationOptions] = useState(defaultPaginationOptions);

    const onPerPageChange = (e: any) => {
      const pageValue = parseInt(e.target.value, 10);
      setCurrentPage(1);
      setItemPerPage(pageValue);
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

    const getGarageFinishesPaginated = (selectedPage: number) => {
      const limit = itemPerPage;
      setCurrentPage(selectedPage);
      const options = { page: selectedPage, limit };
      actions.getGarageFinishList(options);
    };

    useEffect(() => {
      actions.getGarageFinishList({ ... paginationOptions })
    }, [actions.getGarageFinishList]);

    useEffect(() => {
      getGarageFinishesPaginated(currentPage);
    }, [itemPerPage])

  //Pagination End

    const showData = () => {
      if (garageFinishes.loading) {
        return (
          <tr>
            <td colSpan={10} className="text-center">
              Loading...
            </td>
          </tr>
        )
      }
      if (!_.isEmpty(garageFinishesData)) {
          return (
            <>
              {garageFinishesData.map((garageFinish: any, i:any) => (
                <tr key={garageFinish.id} id={`tblRow${garageFinish.id}`} onClick={()=>handleSelectedRow(garageFinish)}>
                <td>
                {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                </td>
                <td>
                  <strong>{garageFinish.name}</strong>
                </td>
                <td>
                  {garageFinish.status == 1 ? 'Active' : 'In-Active'}
                </td>
                <td>
                  {(garageFinish.name.toLowerCase() !== 'none') ? (

                    <>
                      <a
                      href="#"
                      title="Edit"
                      className="text_grey_d"
                      onClick={(e) => handleEdit(e, garageFinish)}
                    >
                      <i className="fa fa-edit fa-lg" />
                    </a>
                      <a
                        href="#"
                        title="Edit"
                        className="text_red"
                        onClick={(e) => handleConfirmModal(e, garageFinish.id)}
                      >
                        <i className="fa fa-times-circle fa-lg" />
                      </a>
                    </>

                  ): (<></>)}


                </td>
              </tr>
              ))}
            </>
          )
      }

      if (garageFinishes.error) {
        return <p>{ garageFinishes.error }</p>
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
                    Garage Finish
                    <br />
                    <small>Manage Garage Finish & details</small>
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
                  GarageFinish Details
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
                Garage Finishes
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
                        Status
                      </th>
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody id='garagefinishListTableBody'>
                    { showData() }
                  </tbody>
                </table>



                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                  { !_.isEmpty(garageFinishesData) && (
                    <>
                      <div className="col-md-4">
                        <ReactPaginate
                          pageCount={Math.ceil(meta.total / itemPerPage)}
                          pageRangeDisplayed={5} // 5
                          marginPagesDisplayed={2} // 2
                          onPageChange={(data) => getGarageFinishesPaginated(data.selected + 1)}
                          previousLabel={'<'}
                          nextLabel={'>'}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          containerClassName={'pagination'}
                          activeClassName={'active'}
                        />
                      </div>
                      <div className="col-md-4">
                        <span style={{fontSize: 'larger', fontWeight: 'bold'}}>{`Showing ${meta?.from} - ${meta?.to} records out of ${meta?.total}`}</span>
                      </div>
                      <div className="col-md-4">
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

GarageFinishPage.propTypes = {
  // garageFinishes: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: GarageFinishReduxProps) => ({
  garageFinishes: state.garageFinishes,
  meta: state.garageFinishes.meta,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getGarageFinishList: bindActionCreators(garageFinishActions.getGarageFinishList, dispatch),
    getAllGarageFinishes: bindActionCreators(garageFinishActions.getAllGarageFinishes, dispatch),
    getGarageFinish: bindActionCreators(garageFinishActions.getGarageFinish, dispatch),
    addGarageFinish: bindActionCreators(garageFinishActions.addGarageFinish, dispatch),
    updateGarageFinish: bindActionCreators(garageFinishActions.updateGarageFinish, dispatch),
    deleteGarageFinish: bindActionCreators(garageFinishActions.deleteGarageFinish, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GarageFinishPage);
