import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import _, { filter } from 'lodash';
import Select from 'react-select';
import History from './common/History';
import * as userActions from '../redux/actions/userActions';
import * as userTypeActions from '../redux/actions/userTypeActions';
import PropTypes from 'prop-types';
import { UserReduxProps, UserList, ExistingUser, UserType, Target } from '../types/interfaces';
import ReactModal from 'react-modal-resizable-draggable';
import { TableHeader, Pagination, Search } from "./DataTable";
import { configs } from '../types/Constants';
import ReactPaginate from 'react-paginate';

//Yellow code highliter 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSelectedRow = (row: any) => {
  const schTblBody = document.getElementById('usersListTableBody');
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

const UserPage = ({ users, userTypes, meta, actions }: UserList) => {
  useEffect(() => {
    // console.log('calling users', users);
    console.log('calling users', actions);
    // actions.getUsers();
    actions.getAllUserTypes();
  }, [actions.getAllUserTypes]);

  const defaultState: ExistingUser = {
    id: 0, name: '', firstname: '', email: '', password: '', phone: '', status: 1, userTypes: [],
  };

  const defaultColumnFilters: { [key: string]: boolean } = {
    all: true,
    supervisor: false,
    hanger: false,
    sprayer: false,
    sander: false,
    taper: false,
  };

  const [formData, setFormData] = useState(defaultState);
  const [isPassword, setIsPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchFilters, setSearchFilters] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState(defaultColumnFilters);

   // new code===
   const [isActive, setIsActive] = useState(true);

  const handleAdd = () => {
    // const itemsList = [...items, { id: uuidv4(), title: 'article 5', body: 'body 5' }];
    // setItems((items) => {
    //   items: [...items, { id: uuidv4(), title: 'article 5', body: 'body 5' }];
    // });
    // console.log(items);

    // setItems([ ...items, { id: uuidv4(), title: 'article 5', body: 'body 5' } ]);
  };

  const clearData = () => {
    setSubmitted(false);
    setFormData({ ...defaultState });
    setIsPassword(false);
    return History.push('/home');
  };

  const { users: usersData } = users;
  const { userTypes: userTypesData } = userTypes;


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
        actions.deleteUser(confirmModalData.id);
        closeConfirmModal();
      }, 1000);
    } else {
      closeConfirmModal();
    }
  };

  const handleEdit = (e: any, user: ExistingUser) => {
    e.preventDefault();
    setFormData({ ...defaultState, ...user });
  };

  const onUserTypeChange = (value: any) => {
    console.log(value);
    if (value === null) {
      setFormData({ ...formData, userTypes: [] });
    } else {
      setFormData({ ...formData, userTypes: [...value] });
    }
  };
  const onFormChange = (e: Target) => {
    console.log(e);
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };
  const onStatusChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
  };
  const onPasswordCheckChange = (e: Target) => {
    setIsPassword(isPassword ? false : true);
    console.log('yes changing ', isPassword);
  }


  const onSelect = (selectedList: any, selectedItem: any) => {
    //
    console.log(selectedItem);
    console.log(selectedList);
    const newList = [...selectedList, selectedItem];
    setFormData({ ...formData, userTypes: [...selectedList, ...selectedItem] });

    // const newList = people.filter((item) => item.id !== idToRemove);
  };

  const onRemove = (selectedList: any, removedItem: any) => {
    //
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setSubmitted(true);
    console.log('form submitted');
    console.log(formData);
    if (formData.name && formData.email && formData.userTypes.length && (!isPassword || (formData.password && isPassword))) {
      if (!formData.id) {
        actions.addUser(formData);
      } else {
        actions.updateUser(formData);
        
        setTimeout(function(){ window.location.reload(); }, 2000);
      }
    }
  };
  //Pagination Start
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(configs.url.PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [hasFilter, setHasFilter] = useState(false);
  const [filterArr, setFilterArr] = useState<any[]>([]);
  const [sorting, setSorting] = useState({ field: "", order: "" });


  const initialusersData: any = [];
  const [newUserData, setNewUserData] = useState(initialusersData);

  const changePerPage = (e: any) => {
    console.log(e.target.value);
    const pageValue = parseInt(e.target.value, 10);
    setItemPerPage(pageValue);

    // //Current Page slice
    let newSliceData = JSON.parse(JSON.stringify(usersData)).slice(
        (currentPage - 1) * pageValue,
        (currentPage - 1) * pageValue + pageValue
    );

    setNewUserData(newSliceData);
  }

  const onColumnFilterChange = (e:any) => {

    console.log(columnFilters);
    const name = e.target.name;
    const val = columnFilters[name] === true ? false : true;
    console.log(name,' => ',val);
    if (name === 'all') {
      const filterObj = {
        all: true,
        supervisor: false,
        hanger: false,
        taper: false,
        sprayer: false,
        sander: false
      };
      setColumnFilters({ ...columnFilters, ...filterObj });
     
      setFilterArr([]);
      setHasFilter(false);
    } else {
      setHasFilter(true);
      const filterObj = {
        all: false,
        [e.target.name]: val
      };
      setColumnFilters({ ...columnFilters, ...filterObj });

      let active = _.keys(_.pickBy(columnFilters));

      if(active.indexOf('all') > -1){
        active.splice(active.indexOf('all'), 1);
      }

      if(val){
        active.push(name);
      }else{
        active.splice(active.indexOf(name), 1);
      }
      setFilterArr(active);
      console.log("Active Data => ", filterArr);
      console.log("Check Active In Active =>", active);

    }
  };

  //Pagination End


  // Pagination start
  const defaultPaginationOptions: any = {
    // offset: 0,
    limit: itemPerPage,
    currentPage: 1,
    userTypes: [],
    searchText: ''
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
  
  const getUsersPaginated = (selectedPage: number) => {
    const limit = itemPerPage;
    setCurrentPage(selectedPage);
    const options = { page: selectedPage, limit, searchText: paginationOptions.searchText, is_active: isActive };
    if (!_.isEmpty(paginationOptions.userTypes)) {
      actions.getUserList({ ...options, userTypes: paginationOptions.userTypes });
    } else {
      actions.getUserList(options);
    }
      
    // actions.getUserList({ ... paginationOptions, page: selectedPage });
  };

  useEffect(() => {
    actions.getUserList({ ... paginationOptions })
  }, [actions.getUserList]);

  useEffect(() => {
    getUsersPaginated(currentPage);
  }, [itemPerPage])
  
  useEffect(() => {
    getUsersPaginated(currentPage);
  }, [paginationOptions])

  useEffect(() => {
    getUsersPaginated(1);
  }, [isActive]);

  const onColumnFilterChangeStatus = (e:any) => {
    const name = e.target.name;
    const val = name == "active";
    console.log(name,' => ',val);
    setIsActive(val);
    if (val) {
      window.location.reload();
    }
    return;
   
  };

  useEffect(() => {
    const userTypeListFilter = [];
    if (!_.isEmpty(filterArr)) {
      for (let singleUserType of filterArr) {
        if (singleUserType === 'supervisor') {
          userTypeListFilter.push(3);
        } else if (singleUserType === 'hanger') {
          userTypeListFilter.push(4);
        } else if (singleUserType === 'sprayer') {
          userTypeListFilter.push(5);
        } else if (singleUserType === 'sander') {
          userTypeListFilter.push(6);
        } else if (singleUserType === 'taper') {
          userTypeListFilter.push(7);
        }
      }
      // actions.getUserList({ ... paginationOptions, userTypes: userTypeListFilter })
    } else {
      // actions.getUserList({ ... paginationOptions })
    }
    console.log(userTypeListFilter);
    setPaginationOptions({ ...paginationOptions, userTypes: userTypeListFilter, searchText: search.toLowerCase() })

  }, [
    filterArr, search
    // users, usersData, currentPage, search, sorting
  ]);

  const showData = () => {
    if (users.loading) {
      return (
        <tr>
          <td colSpan={10} className="text-center">
            Loading...
          </td>
        </tr>
      )
    }
    if (!_.isEmpty(usersData)) {
        return (
          <>
            {usersData.map((user: any, i:any) => (
              <tr key={user.id} id={`tblRow${user.id}`} onClick={()=>handleSelectedRow(user)}>
                <td>
                  {(((currentPage >= 2) ? ((currentPage-1) * itemPerPage) + (i+1) :  (i+1)))}
                </td>
                <td>
                  <strong>{user.name}</strong>
                </td>
                <td>
                  {user.email}
                </td>
                <td>
                  {user.userTypes.length ? user.userTypes.map((userType:any) => userType.name).join(', ') : ''}
                </td>
                <td>
                    {user.status == 1 ? 'Active' : 'In-Active'}
                  </td>
                <td>
                  <a
                    href="#"
                    title="Edit"
                    className="text_grey_d"
                    onClick={(e) => handleEdit(e, user)}
                  >
                    <i className="fa fa-edit fa-lg" />
                  </a>
                  <a
                    href="#"
                    title="Edit"
                    className="text_red"
                    onClick={(e) => handleConfirmModal(e, user.id)}
                  >
                    <i className="fa fa-times-circle fa-lg" />
                  </a>
                </td>
              </tr>
            ))}
          </>
        )
    }
    
    if (users.error) {
      return <p>{ users.error }</p>
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
                    Users
                    <br />
                    <small>Manage users & details</small>
                  </h3>
                </div>
                <div className="col-md-9 mt-20 text-right">
                 
                </div>
              </div>
            </div>

            <div className="card-body">
              <form className="form-horizontal" onSubmit={(e) => handleSubmit(e)}>
                <h4 className="text_blue">
                  User Details
                </h4>
                <div className="clear pad-5" />
                <div className="row">
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Name :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input type="text" id="name" name="name" value={formData.name || ''} onChange={(e) => onFormChange(e)} className={`form-control ${submitted && !formData.name ? 'ap-required' : ''}`} />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Email :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input type="text" id="email" name="email" value={formData.email || ''} onChange={(e) => onFormChange(e)} className={`form-control ${submitted && !formData.email ? 'ap-required' : ''}`} />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Phone :
                    </label>
                    <div className="col-md-9">
                      <input type="text" className="form-control" id="phone" value={formData.phone || ''} name="phone" onChange={(e) => onFormChange(e)} />
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      User Type :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <Select
                        isMulti
                        options={userTypesData}
                        getOptionLabel={(option: any) => option.name}
                        getOptionValue={(option: any) => option.id}
                        // onChange={() => onUserTypeChange}
                        value={formData.userTypes}
                        onChange={(value) => onUserTypeChange(value)}
                        className={`${submitted && !formData.userTypes.length ? 'ap-required' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-20 text-left">
                    <div className="col-md-3 text-left">

                    </div>
                    <div className="col-md-9">
                      <label className="col-md-12 control-label text-left">
                        <input type="checkbox" name="isPassword" onChange={(e) => onPasswordCheckChange(e)} />
                        Create login credentials for this user
                    </label>
                    </div>
                  </div>
                </div>

                <div className={!isPassword ? 'row hidden' : 'row'}>
                  <div className="form-group col-md-6 mb-20">
                    <label className="col-md-3 control-label">
                      Password :
                      <span className="text_red">*</span>
                    </label>
                    <div className="col-md-9">
                      <input type="password" id="password" name="password" value={formData.password || ''} onChange={(e) => onFormChange(e)} className={`form-control ${submitted && !formData.password && isPassword ? 'ap-required' : ''}`} />
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
              <div>
                
                <div style={{float: 'right'}}>
                <div className="chk-filter-container pull-left mt-5">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group col-md-12 mb-20">
                          <label className="checkbox-inline">
                          <input type="checkbox" name="active" checked={isActive} onChange={(e) => onColumnFilterChangeStatus(e)} />
                            Active
                          </label>
                          <label className="checkbox-inline">
                          <input
                            type="checkbox"
                            name="inactive"
                            checked={!isActive}
                            onChange={(e) => onColumnFilterChangeStatus(e)}
                          />
                            Inactive
                          </label>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="text_blue">
                  Users
                </h4>
                <div style={{float: 'left'}}>
                <div className="chk-filter-container pull-left mt-5">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group col-md-12 mb-20">
                          <label className="checkbox-inline">
                            <input type="checkbox" name="all" value="1" checked={columnFilters.all} onChange={(e) => onColumnFilterChange(e)} />
                            All
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="supervisor" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.supervisor} />
                            Supervisor
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="hanger" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.hanger} />
                            Hanger
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="taper" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.taper} />
                            Taper
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="sprayer" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.sprayer} />
                              Sprayer
                          </label>
                          <label className="checkbox-inline">
                            <input type="checkbox" name="sander" value="1" onChange={(e) => onColumnFilterChange(e)} checked={!!columnFilters.sander} />
                            Sander
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{float: 'right'}}>
                <Search
                    onSearch={(value:any) => {
                    setSearch(value);
                    setCurrentPage(1);
                      }}
                />
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
                        Email
                      </th>
                      <th>
                        User Type
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody id='usersListTableBody'>
                    {showData()}
                  </tbody>
                </table>
                
                <div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
                  { !_.isEmpty(usersData) && (
                    <>
                      <div className="col-md-6">
                        <ReactPaginate
                          pageCount={Math.ceil(meta.total / itemPerPage)}
                          pageRangeDisplayed={5} // 5
                          marginPagesDisplayed={2} // 2
                          onPageChange={(data) => getUsersPaginated(data.selected + 1)}
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

UserPage.propTypes = {
  // users: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: UserReduxProps) => ({
  users: state.users,
  userTypes: state.userTypes,
  meta: state.users.meta,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getUserList: bindActionCreators(userActions.getUserList, dispatch),
    getUsers: bindActionCreators(userActions.getUsers, dispatch),
    addUser: bindActionCreators(userActions.addUser, dispatch),
    updateUser: bindActionCreators(userActions.updateUser, dispatch),
    deleteUser: bindActionCreators(userActions.deleteUser, dispatch),
    getAllUserTypes: bindActionCreators(userTypeActions.getAllUserTypes, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPage);
