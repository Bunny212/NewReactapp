import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import * as builderActions from '../../redux/actions/builderActions';
import { authHeader } from '../../helpers/authHeader';
import History from '../common/History';
import { configs } from '../../types/Constants';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import {
  BuilderReduxProps,
  BuilderList,
  Builder,
  Target,
} from '../../types/interfaces';
import ReactModal from 'react-modal-resizable-draggable';
import { TableHeader, Pagination, Search } from "../DataTable";
import ReactPaginate from 'react-paginate';
import _ from 'lodash';

const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('buildersTableBody');
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

const BuilderPage = ({ builders, meta, actions }: BuilderList, getState: Function) => {
  useEffect(() => {

    const url = configs.url.API_URL + '/cities';
    axios.get(url, authHeader(getState))
      .then(response => {
        setCitiesState(JSON.parse(JSON.stringify(response.data.data)));
        setLoadingState(false);
      });

      const statesUrl = configs.url.API_URL + '/states';
      axios.get(statesUrl, authHeader(getState))
        .then(response => {
          setCStatesState(JSON.parse(JSON.stringify(response.data)));
          setLoadingState(false);
        });


    // actions.getAllBuilders();
  }, [actions.getBuilderList]);

  const defaultState = {
    id: 0, name: '', address: '', city: '', state: '', zipcode: '', contactName: '', email: '', phone: '', status: 1,
  };

  const [formData, setFormData] = useState(defaultState);
  const [submitted, setSubmitted] = useState(false);
  const [citiesData, setCitiesState] = useState([]);
  const [cstatesData, setCStatesState] = useState([]);
  const [loading, setLoadingState] = useState(true);

  const clearData = () => {
    // setSubmitted(false);
    // setFormData({ ...defaultState });
    return History.push('/home');
  };

  const { builders: buildersData } = builders;


  const defaultConfirmModal: any = {
    id: 0,
    status: false
  };
  const [confirmModalData, setconfirmModalData] = React.useState(defaultConfirmModal);

  // new code===
  const [isActive, setIsActive] = useState(true);


// new code end===

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
        actions.deleteBuilder(confirmModalData.id);
        closeConfirmModal();
      }, 1000);
    } else {
      closeConfirmModal();
    }
  };

  const handleEdit = (e: any, builder: Builder) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...builder });
  };

  const onFormChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });

    // if (e.target.name == 'city') {
    //   const url = configs.url.API_URL + '/states/' + e.target.value;
    //   axios.get(url, authHeader(getState))
    //     .then(response => {
    //       setCStatesState(JSON.parse(JSON.stringify(response.data)));
    //       setLoadingState(false);
    //       console.log(response.data);
    //     });
    // }

    // console.log(e.target.name);
    // console.log(formData);
  };

  const getCityName = (cityId: any) => {
    const city = citiesData.filter((singleCity: any) => singleCity.id === parseInt(cityId, 10))
      .map((city: any) => city.name);
    return (
      <>
        {city.length > 0 ? city : ''}
      </>
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (formData.name && formData.city && formData.state) {
      if (!formData.id) {
        actions.addBuilder(formData);
      } else {
        actions.updateBuilder(formData);
        setTimeout(function(){ window.location.reload(); }, 1000);
      }
    }
  };

    //Pagination Start
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const initialBuilderData: any = [];
    const [builderData, setBuilderData] = useState(initialBuilderData);

    useEffect(() => {
      // console.log("Total Data Length =>", jobOrdersData.length);
      setTotalItems(buildersData.length);

      //Current Page slice
      let newSliceData = JSON.parse(JSON.stringify(buildersData)).slice(
          (currentPage - 1) * itemPerPage,
          (currentPage - 1) * itemPerPage + itemPerPage
      );
      setBuilderData(newSliceData);
      console.log(newSliceData);

    }, [
      builders, buildersData, currentPage, search, sorting
    ]);

    const changePerPage = (e: any) => {
      const pageValue = parseInt(e.target.value, 10);
      setItemPerPage(pageValue);
  
      //Current Page slice
      let newSliceData = JSON.parse(JSON.stringify(buildersData)).slice(
          (currentPage - 1) * pageValue,
          (currentPage - 1) * pageValue + pageValue
      );

      setBuilderData(newSliceData);
    }

    useEffect(() => {
      getBuildersPaginated(1);
    }, [isActive]);

    const onColumnFilterChange = (e:any) => {
      const name = e.target.name;
      const val = name == "active";
      console.log(name,' => ',val);
      setIsActive(val);
      if (val) {
        window.location.reload();
      }
      return;
     
    };
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
    
    const getBuildersPaginated = (selectedPage: number) => {
      const limit = itemPerPage;
      setCurrentPage(selectedPage);
      const options = { page: selectedPage, limit, is_active: isActive };
      actions.getBuilderList(options);
    };

    useEffect(() => {
      actions.getBuilderList({ ... paginationOptions })
    }, [actions.getBuilderList]);

    useEffect(() => {
      getBuildersPaginated(currentPage);
    }, [itemPerPage])

    

    const showData = () => {


      if (builders.loading) {
        return (
          <tr>
            <td colSpan={10} className="text-center">
              Loading...
            </td>
          </tr>
        )
      }
      if (!_.isEmpty(buildersData)) {
          return (
            <>
              {buildersData.filter(builder => {
                return builder.status === (isActive ? 1 : 0);
              }).map((builder: any, i: any) => (
                <tr className={(builder.status == 1) ? 'record active' : 'record inactive'} id={`tblRow${builder.id}`} key={builder.id} onClick={()=>handleSelectedRow(builder)}>
                  <td>
                  {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                  </td>
                  <td>
                    <strong>{builder.name}</strong>
                  </td>
                  <td>
                    <strong>{builder.address}</strong>
                  </td>
                  <td>
                    <strong>{getCityName(builder.city)}</strong>
                  </td>
                  <td>
                    <strong>{builder.stateName}</strong>
                  </td>
                  <td>
                    <strong>{builder.zipcode}</strong>
                  </td>
                  <td>
                    <strong>{builder.phone}</strong>
                  </td>
                  <td>
                    <strong>{builder.contactName}</strong>
                  </td>
                  <td>
                    {builder.status == 1 ? 'Active' : 'In-Active'}
                  </td>
                  <td>
                    <a
                      href="#"
                      title="Edit"
                      className="text_grey_d"
                      onClick={(e) => handleEdit(e, builder)}
                    >
                      <i className="fa fa-edit fa-lg" />
                    </a>
                    <a
                      href="#"
                      title="Edit"
                      className="text_red"
                      onClick={(e) => handleConfirmModal(e, builder.id)}
                    >
                      <i className="fa fa-times-circle fa-lg" />
                    </a>
                  </td>
                </tr>
              ))}
            </>
          )
      }
      
      if (builders.error) {
        return <p>{ builders.error }</p>
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
                    Builders
                    <br />
                    <small>Manage Builders & details</small>
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
                  Builder Details
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
                      Address :
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ''}
                        onChange={(e) => onFormChange(e)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      City :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      {/* <input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.city ? 'ap-required' : ''}`}
                      /> */}
                      <select
                        name="city"
                        value={formData.city || ''}
                        onChange={(e) => onStatusChange(e)}
                        className={`form-control ${submitted && !formData.city ? 'ap-required' : ''}`}
                      >
                        <option value={0}>select...</option>
                        {!loading ? citiesData.map((jd: any, i: any) => (
                          <option key={i} value={jd?.id}>{jd?.name}</option>
                        )) : (
                            <option value={0}>select...</option>
                          )}
                      </select>
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      State :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      {/* <input
                        type="text"
                        name="state"
                        value={formData.state || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.state ? 'ap-required' : ''}`}
                      /> */}
                      <select
                        name="state"
                        value={formData.state || ''}
                        onChange={(e) => onStatusChange(e)}
                        className={`form-control ${submitted && !formData.state ? 'ap-required' : ''}`}
                      >
                        <option value={0}>select...</option>
                        {!loading ? cstatesData.map((jd: any, i: any) => (
                          <option key={i} value={jd?.id}>{jd?.name}</option>
                        )) : (
                            <option value={0}>select...</option>
                          )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Zipcode :
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="zipcode"
                        value={formData.zipcode || ''}
                        onChange={(e) => onFormChange(e)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Contact Name :
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName || ''}
                        onChange={(e) => onFormChange(e)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Email :
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="email"
                        value={formData.email || ''}
                        onChange={(e) => onFormChange(e)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Phone :
                    </label>
                    <div className="col-md-9">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={(e) => onFormChange(e)}
                        className={`form-control ${submitted && !formData.phone ? 'ap-required' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Status :
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
                Builders
              </h4>
              <div style={{float: 'right'}}>
                <div className="chk-filter-container pull-left mt-5">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group col-md-12 mb-20">
                          <label className="checkbox-inline">
                          <input type="checkbox" name="active" checked={isActive} onChange={(e) => onColumnFilterChange(e)} />
                            Active
                          </label>
                          <label className="checkbox-inline">
                          <input
                            type="checkbox"
                            name="inactive"
                            checked={!isActive}
                            onChange={(e) => onColumnFilterChange(e)}
                          />
                            Inactive
                          </label>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                        Address
                      </th>
                      <th>
                        City
                      </th>
                      <th>
                        State
                      </th>
                      <th>
                        Zipcode
                      </th>
                      <th>
                        Phone
                      </th>
                      <th>
                        Contact Name
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody id='buildersTableBody'>
                    {showData()}
                  </tbody>
                </table>

                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                  { !_.isEmpty(buildersData) && (
                    <>
                      <div className="col-md-6">
                        <ReactPaginate
                          pageCount={Math.ceil(meta.total / itemPerPage)}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={(data) => getBuildersPaginated(data.selected + 1)}
                          previousLabel={'<'}
                          nextLabel={'>'}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          containerClassName={'pagination'}
                          activeClassName={'active'}
                         // forcePage={currentPage}
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

BuilderPage.propTypes = {
  // builders: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: BuilderReduxProps) => ({
  builders: state.builders,
  meta: state.builders.meta,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getBuilderList: bindActionCreators(builderActions.getBuilderList, dispatch),
    getAllBuilders: bindActionCreators(builderActions.getAllBuilders, dispatch),
    getBuilder: bindActionCreators(builderActions.getBuilder, dispatch),
    addBuilder: bindActionCreators(builderActions.addBuilder, dispatch),
    updateBuilder: bindActionCreators(builderActions.updateBuilder, dispatch),
    deleteBuilder: bindActionCreators(builderActions.deleteBuilder, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuilderPage);
