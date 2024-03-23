import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import ReactModal from 'react-modal-resizable-draggable';
import _ from 'lodash';
import * as filterActions from '../../redux/actions/filterActions';
import {
  FilterReduxProps,
  FilterList,
  Filter,
  Action
} from '../../types/interfaces';

const confirmModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '500px',
    overflow: 'scroll',
    width: '70%',
  }
};

const FilterPage = ({ filters, actions }: FilterList) => {
  const [confirmModalData, setConfirmModalData] = useState({
    id: 0,
    status: false
  });

  const closeConfirmModal = () => {
    setConfirmModalData({ id: 0, status: false });
  };

  const handleConfirmModal = (id: number) => {
    setConfirmModalData({ id, status: true });
  };

  const handleDelete = () => {
    if (confirmModalData.id) {
      actions.deleteFilter(confirmModalData.id);
      closeConfirmModal();
    } else {
      closeConfirmModal();
    }
  };

  const showData = () => {
    if (!_.isEmpty(filters)) {
    }

    return <p>No data available</p>;
  };

  


  return (
    <>
      <div className="container">
        <div className="row">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-3">
                  <h3>
                    Filters
                    <br />
                    <small>Manage Filters</small>
                  </h3>
                </div>
              </div>
            </div>

            <div className="card-body">
              <h4 className="text_blue">Filter Details</h4>
              <div className="clear pad-5" />

              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showData()}
                  </tbody>
                </table>
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
                    <button
                      className="btn btn-default btn-sm mr-5"
                      onClick={closeConfirmModal}
                    >
                      No
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={handleDelete}
                    >
                      Yes
                    </button>
                  </div>
                </form>
              </ReactModal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: FilterReduxProps) => ({
  filters: {
    loading: state.filters.loading,
    error: state.filters.error,
    data: state.filters.filterItems, // Assuming filterItems is the correct property name
  },
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, Action>) => ({
  actions: {
    getAllFilters: () => dispatch(filterActions.getAllFilters()),
    getFilter: (id: number) => dispatch(filterActions.getFilter(id)),
    getFilterList: (options?: any) => dispatch(filterActions.getFilterList(options)),
    deleteFilter: (id: number) => dispatch(filterActions.deleteFilter(id)),
  },
});





export default connect(mapStateToProps, mapDispatchToProps)(FilterPage);