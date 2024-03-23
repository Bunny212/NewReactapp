import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import History from '../common/History';
import * as cityActions from '../../redux/actions/cityActions';
import PropTypes from 'prop-types';
import {
  CityReduxProps,
  CityList,
  City,
  Target,
  Action
} from '../../types/interfaces';
import { ThunkDispatch } from 'redux-thunk';
import ReactModal from 'react-modal-resizable-draggable';
import { TableHeader, Pagination, Search } from "../DataTable";
import ReactPaginate from 'react-paginate';
import { configs } from '../../types/Constants';
import _ from 'lodash';
// import { ToastContainer } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";

//Yellow code highliter 
const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('cityListTableBody');
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

const CityPage = ({ cities, meta, actions }: CityList) => {
  // useEffect(() => {
  //   actions.getAllCities();
  // }, [actions.getAllCities]);

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

  const { cities: citiesData } = cities;


  const handleEdit = (e: any, city: City) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...city });
  };

  const onFormChange = (e: Target) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    console.log(formData);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    if (formData.name) {
      if (!formData.id) {
        actions.addCity(formData);
      } else {
        console.log('start yes working');
        await actions.updateCity(formData);
        console.log('end yes working');
      }
    }
  };


  // const handleToggle = useCallback(() => {
    // Clear errors
    // actions.clearErrors();
    // console.log('yes its is now');
    // if (!(cities.loading && cities.error)) {
    //   console.log('yes its is now why!!!!!!!!!!!!!');
    //   setSubmitted(false);
    //   setFormData({ ...defaultState });
    // }
  //   console.log('yes callling now o.......')
  // }, [actions.addCity, actions.updateCity]);

  useEffect(() => {
    if (!cities.loading && !cities.error) {
      setSubmitted(false);
      setFormData({ ...defaultState });
    }
  }, [cities]);

  // useEffect(() => {
  //   actions.getAllCities();
  // }, [actions.getAllCities]);

  const renderNotifiations = () => {
    if (!cities.loading && cities.error) {
      return (
        <div className="alert alert-danger" role="alert">
          <a href="#" className="close" data-dismiss="alert">&times;</a>
          {cities.error.msg}
        </div>
      )
    } else if (submitted && !(cities.loading && cities.error)) {
      return (
      <div className="alert alert-success" role="alert">
        <a href="#" className="close" data-dismiss="alert">&times;</a>
        City updated successfully!
      </div>
      )
    }


    // {!cities.loading && cities.error ? (
    //   <div className="alert alert-danger" role="alert">
    //     <a href="#" className="close" data-dismiss="alert">&times;</a>
    //     {cities.error.msg}
    //   </div>
    // ) : (<></>)}
    // {submitted && !(cities.loading && cities.error) ? (
    //   <div className="alert alert-success" role="alert">
    //     <a href="#" className="close" data-dismiss="alert">&times;</a>
    //     City updated successfully!
    //   </div>
    // ) : (<></>)}
  }

  // console.log(error);
  // console.log(cities);

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
        actions.deleteCity(confirmModalData.id);
        closeConfirmModal();
      }, 1000);
    } else {
      closeConfirmModal();
    }
  };

  //Pagination Start
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });


  const initialcitiesData: any = [];
  const [cityData, setCityData] = useState(initialcitiesData);

  useEffect(() => {
    // console.log("Total Data Length =>", jobOrdersData.length);
    setTotalItems(citiesData.length);

    //Current Page slice
    let newSliceData = JSON.parse(JSON.stringify(citiesData)).slice(
        (currentPage - 1) * itemPerPage,
        (currentPage - 1) * itemPerPage + itemPerPage
    );
    setCityData(newSliceData);
    console.log(newSliceData);

  }, [
    cities, citiesData, currentPage, search, sorting
  ]);

  const changePerPage = (e: any) => {
    const pageValue = parseInt(e.target.value, 10);
    setItemPerPage(pageValue);

    //Current Page slice
    let newSliceData = JSON.parse(JSON.stringify(citiesData)).slice(
        (currentPage - 1) * pageValue,
        (currentPage - 1) * pageValue + pageValue
    );

    setCityData(newSliceData);
  }

  //Pagination End



  // Pagination start
  const showData = () => {
    if (cities.loading) {
      return (
        <tr>
          <td colSpan={5} className="text-center">
            Loading...
          </td>
        </tr>
      )
    }
    if (!_.isEmpty(citiesData)) {
      // console.log(meta);
        return (
          <>
            {citiesData.map((city: any, i:any) => (
              <tr key={city.id} id={`tblRow${city.id}`} onClick={()=>handleSelectedRow(city)}>
                <td>
                {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                </td>
                <td>
                  <strong>{city.name}</strong>
                </td>
                <td>
                  {city.status == 1 ? 'Active' : 'In-Active'}
                </td>
                <td>
                  <a
                    href="#"
                    title="Edit"
                    className="text_grey_d"
                    onClick={(e) => handleEdit(e, city)}
                  >
                    <i className="fa fa-edit fa-lg" />
                  </a>
                  <a
                    href="#"
                    title="Edit"
                    className="text_red"
                    onClick={(e) => handleConfirmModal(e, city.id)}
                  >
                    <i className="fa fa-times-circle fa-lg" />
                  </a>
                </td>
              </tr>
            ))}
          </>
        )
    }
    
    if (cities.error) {
      return <p>{ cities.error }</p>
    }
    return <p>Unable to get data</p>
  }

  const defaultPaginationOptions = {
    // perPage: itemPerPage,
    offset: 0,
    limit: itemPerPage,
    currentPage: 1,
  };

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
  
  useEffect(() => {
    getCitiesPaginated(currentPage);

  }, [itemPerPage])

  const [paginationOptions, setPaginationOptions] = useState(defaultPaginationOptions);

  useEffect(() => {
    actions.getCityList({ ... paginationOptions })
  }, [actions.getCityList]);

  const getCitiesPaginated = (selectedPage: number) => {
    console.log(selectedPage);
    const offset = (selectedPage - 1) * itemPerPage;
    const limit = itemPerPage;
    // (currentPage - 1) * pageValue,
    // (currentPage - 1) * pageValue + pageValue
    console.log(itemPerPage);
    setCurrentPage(selectedPage);

    const options = { page: selectedPage, limit };
    console.log(options);
    actions.getCityList(options);
    // setPaginationOptions()
  };

  
  return (
    <>
      <>
        <div className="clear pad-40" />
        <div>
          {/* { showData() } */}
          {/* { !_.isEmpty(citiesData) && (
            <>
              <ReactPaginate
                pageCount={Math.ceil(meta.total / itemPerPage)}
                pageRangeDisplayed={5} // 5
                marginPagesDisplayed={2} // 2
                onPageChange={(data) => getCitiesPaginated(data.selected + 1)}

                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                containerClassName={'pagination'}
                activeClassName={'active'}

                
              />
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
          )} */}
        </div>
      </>
      <div className="clear pad-40" />
      <div className="container">
        <div className="row">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    Cities
                    <br />
                    <small>Manage Cities &amp; details</small>
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
              {/* <ToastContainer /> */}
              {/* {renderNotifiations()} */}
              <form className="form-horizontal" onSubmit={(e) => handleSubmit(e)}>
                <h4 className="text_blue">
                  City Details
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
                Cities
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
                  <tbody id='cityListTableBody'>
                    { showData() }
                    {/* {cityData.length > 0 ? cityData.map((city: any, i:any) => (
                      <tr key={city.id}>
                        <td>
                        {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                        </td>
                        <td>
                          <strong>{city.name}</strong>
                        </td>
                        <td>
                          {city.status == 1 ? 'Active' : 'In-Active'}
                        </td>
                        <td>
                          <a
                            href="#"
                            title="Edit"
                            className="text_grey_d"
                            onClick={(e) => handleEdit(e, city)}
                          >
                            <i className="fa fa-edit fa-lg" />
                          </a>
                          <a
                            href="#"
                            title="Edit"
                            className="text_red"
                            onClick={(e) => handleConfirmModal(e, city.id)}
                          >
                            <i className="fa fa-times-circle fa-lg" />
                          </a>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No record found.
                        </td>
                        </tr>
                      )} */}
                  </tbody>
                </table>
                {citiesData.length < 1}
                {/* <ul className="pagination center-block">
                  <li><a href="#">«</a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#">»</a></li>
                </ul> */}


                  <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                    { !_.isEmpty(citiesData) && (
                      <>
                        <div className="col-md-6">
                          <ReactPaginate
                            pageCount={Math.ceil(meta.total / itemPerPage)}
                            pageRangeDisplayed={5} // 5
                            marginPagesDisplayed={2} // 2
                            onPageChange={(data) => getCitiesPaginated(data.selected + 1)}
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

CityPage.propTypes = {
  // cities: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: CityReduxProps, ownProps: City) => ({
  cities: state.cities,
  meta: state.cities.meta,
  // error: state.error,
  // loading: state.cities.loading,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, Action>, ownProps: City) => ({
  actions: {
    getAllCities: bindActionCreators(cityActions.getAllCities, dispatch),
    getCity: bindActionCreators(cityActions.getCity, dispatch),
    addCity: bindActionCreators(cityActions.addCity, dispatch),
    updateCity: bindActionCreators(cityActions.updateCity, dispatch),
    deleteCity: bindActionCreators(cityActions.deleteCity, dispatch),
    getCityList: bindActionCreators(cityActions.getCityList, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CityPage);
