import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import _, { lowerCase } from 'lodash';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import Select from 'react-select';
import * as JobOrderActions from '../../redux/actions/jobOrderActions';
import * as UserActions from '../../redux/actions/userActions';
import * as BillingItemActions from '../../redux/actions/billingItemActions';
import * as HouseLevelTypeActions from '../../redux/actions/houseLevelTypeActions';
import * as PurchaseOrderActions from '../../redux/actions/purchaseOrderActions';
import * as billingItemActions from '../../redux/actions/billingItemActions';
import * as userTypeActions from '../../redux/actions/userTypeActions';


// import PropTypes from 'prop-types';
import {
  ReportReduxProps,
  ReportList,
  JobOrder,
  Target,
  ReportFilter,
} from '../../types/interfaces';


const ReportTablePrint = ({
  jobOrders,
  users,
  billingItems,
  houseLevelTypes,
  purchaseOrders,
  userTypes,
  formData,
  columnFilters,
  filterFormData,
  filterFormDataSubmitted,
  actions
}: ReportList) => {


  const calculateDate = (date: any, dayInterval: number) => {
    if (!date) {
      return null;
    }
    const currrentDate = moment(date).format('YYYY-MM-DD');
    dayInterval = dayInterval ? dayInterval : 0;
    let targetDate = moment(date).add('days', dayInterval).format('YYYY-MM-DD');
    let newDate = '';
    // calculate start date
    if (moment(targetDate).day() === 6) {
      newDate = moment(targetDate).add('days', 2).format('YYYY-MM-DD');
    } else if (moment(targetDate).day() === 0) {
      newDate = moment(targetDate).add('days', 1).format('YYYY-MM-DD');
    } else {
      newDate = moment(targetDate).format('YYYY-MM-DD');
    }
    return newDate;
  }

  const getJobUserTypeName = (jobOrderId: any, jobOrderUserType: string) => {
    const currentJobOrder = jobOrdersData.filter((jobOrder: any) => jobOrder.id === jobOrderId)[0] || {};
    const { users } = currentJobOrder;

    if (users && users.length) {
      const jobUser = users.filter((jobUser: any) => jobUser.jobOrderUserType === jobOrderUserType);
      return jobUser.length ? jobUser[0].name : '';
    }
    return '';
  }

  const { jobOrders: jobOrdersData } = jobOrders;
  const { billingItemGroups: billingItemGroupsData } = billingItems;

  const getCurrentGroupCounts = (groupId: any, jobOrder: any) => {
    const group = jobOrder.billingItemsGroupsCount.filter((singleGroup: any) => singleGroup.groupId === groupId);
    return group && group.length > 0 ? group[0].total : '';
  };

  const getCurrentJobClasses = (jobOrder: any) => {
    let classes = '';
    return classes;
    if (jobOrder.ceilingFinishFogged) {
      classes += 'bg-green';
    } else if (jobOrder.jobStatus === 'hold') {
      classes += 'bg-yellow';
    }
    return classes;
  };

  const getReportTypeHeading = () => {
    let heading = 'Individual Contractor Report';
    if (filterFormData && filterFormData.reportType === '2') {
      heading = 'Contractor Type Report';
    } else if (filterFormData && filterFormData.reportType === '3') {
      heading = 'Schedule Report';
    }
    return (<>{heading}</>);
  }


  return (
    <>
      <div className="table-responsive p-table-responsive">

        <table style={{width: '820px', margin: '0 auto', textAlign: 'center'}}>
          <tbody>
            <tr style={{}}>
              <td colSpan={2} style={{ textAlign: 'center' }}>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ fontSize: 'x-large', fontWeight: 'bold', color: 'black', textAlign: 'center' }}>Schoenberger Drywall, Inc.</td>
                    </tr>
                    <tr>
                      <td style={{textAlign: 'center'}}>16940 Welcome Avenue SE</td>
                    </tr>
                    <tr>
                      <td style={{textAlign: 'center'}}>Prior Lake, MN 55372</td>
                    </tr>
                    <tr>
                      <td style={{textAlign: 'center'}}>952-477-1078</td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: 'large', fontWeight: 'bold', color: 'black', textAlign: 'center' }}>{getReportTypeHeading()}</td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: 'large', fontWeight: 'bold', color: 'black', textAlign: 'center' }}>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="schedule-table p-table reports-table table table-bordered table-striped">
          <thead>
            <tr>
              <th className="w-1500">
                Address
              </th>
              <th className="w-1500">
                Ceil Fin
              </th>
              <th>
                Ver
              </th>
              {billingItemGroupsData && billingItemGroupsData.length ? billingItemGroupsData.map((billingItemGroup, i) => (
                <th key={i}>
                  {billingItemGroup.groupName}
                </th>
              )) : (
                  <></>
                )}
              {(columnFilters.all || columnFilters.hanger) && (
                <>
                  <th className="w-1500">
                    Hanger
                  </th>
                  <th className="w-800">
                    Start mm/dd/yy
                  </th>
                  <th className="w-800">
                    End mm/dd/yy
                  </th>
                </>
              )}

              {(columnFilters.all || columnFilters.taper) && (
                <>
                  <th className="w-1500">
                    Taper
                  </th>
                  <th className="w-800">
                    Start mm/dd/yy
                  </th>
                  <th className="w-800">
                    End mm/dd/yyy
                  </th>
                </>
              )}

              {(columnFilters.all || columnFilters.sprayer) && (
                <>
                  <th className="w-1500">
                    Sprayer
                  </th>
                  <th className="w-800">
                    Fog Date mm/dd/yy
                  </th>
                  <th className="w-800">
                    Date mm/dd/yy
                  </th>
                </>
              )}


              {(columnFilters.all || columnFilters.sander) && (
                <>
                  <th className="w-1500">
                    Sander
                  </th>
                  <th className="w-800">
                    Date mm/dd/yy
                  </th>
                  <th className="w-800">
                      Paint mm/dd/yy
                  </th>
                </>
              )}

            </tr>
          </thead>
          <tbody>
            {filterFormDataSubmitted && jobOrdersData.length > 0 ? jobOrdersData.map((jobOrder, i) => (
              <tr key={jobOrder.id}>
                <td className={getCurrentJobClasses(jobOrder)}>
                  <strong>{jobOrder.address}</strong>
                </td>
                <td className={getCurrentJobClasses(jobOrder)}>
                  {jobOrder.ceilingFinishName || ''}
                </td>
                <td>
                  {jobOrder.isVerified ? (<i className="fa fa-check fa-sm" />) : (<></>)}

                </td>

                {billingItemGroupsData && billingItemGroupsData.length ? billingItemGroupsData.map((billingItemGroup, i) => (
                  <td key={i}>
                    {getCurrentGroupCounts(billingItemGroup.id, jobOrder)}
                  </td>
                )) : (
                    <></>
                  )}

                {(columnFilters.all || columnFilters.hanger) && (
                  <>
                    <td>
                      {getJobUserTypeName(jobOrder.id, 'hanger')}
                    </td>
                    <td>
                      {!!jobOrder.hangerStartDate ? moment(calculateDate(jobOrder.hangerStartDate, 0)).format('MM/DD/YYYY') : ''}
                    </td>
                    <td>
                      {!!jobOrder.hangerEndDate ? moment(calculateDate(jobOrder.hangerEndDate, 0)).format('MM/DD/YYYY') : ''}
                    </td>
                  </>
                )}


                {(columnFilters.all || columnFilters.taper) && (
                  <>
                    <td>
                      {getJobUserTypeName(jobOrder.id, 'taper')}
                    </td>
                    <td>
                      {!!jobOrder.taperStartDate ? moment(calculateDate(jobOrder.taperStartDate, 0)).format('MM/DD/YYYY') : ''}
                    </td>
                    <td>
                      {!!jobOrder.taperEndDate ? moment(calculateDate(jobOrder.taperEndDate, 0)).format('MM/DD/YYYY') : ''}
                    </td>
                  </>
                )}

                {(columnFilters.all || columnFilters.sprayer) && (
                  <>
                    <td>
                        {getJobUserTypeName(jobOrder.id, 'sprayer')}
                    </td>
                    <td>
                      {formData && !!formData.deliveryDate ? '' : ''}
                    </td>
                    <td>
                      {!!jobOrder.sprayerDate ? moment(calculateDate(jobOrder.sprayerDate, 0)).format('MM/DD/YYYY') : ''}
                    </td>
                  </>
                )}

                {(columnFilters.all || columnFilters.sander) && (
                  <>
                    <td>
                      {getJobUserTypeName(jobOrder.id, 'sander')}
                    </td>
                    <td>
                      {!!jobOrder.sanderDate ? moment(calculateDate(jobOrder.sanderDate, 0)).format('MM/DD/YYYY') : ''}
                    </td>
                    <td>
                      {!!jobOrder.paintDate ? moment(calculateDate(jobOrder.paintDate, 0)).format('MM/DD/YYYY') : ''}
                    </td>
                  </>
                )}
              </tr>
            )) : (
                <tr>
                  <td colSpan={29} className="text-center">
                    No record found.
                </td>
                </tr>
              )}
          </tbody>
        </table>
        {jobOrdersData.length < 1}
      </div>
    </>
  );
};

// ReportTablePrint.propTypes = {
// jobOrders: PropTypes.object.isRequired,
// actions: PropTypes.func.isRequired
// };


const mapStateToProps = (state: ReportReduxProps) => ({
  jobOrders: state.jobOrders,
  users: state.users,
  billingItems: state.billingItems,
  houseLevelTypes: state.houseLevelTypes,
  purchaseOrders: state.purchaseOrders,
  userTypes: state.userTypes,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    getReportJobOrders: bindActionCreators(JobOrderActions.getReportJobOrders, dispatch),
    getAllJobOrders: bindActionCreators(JobOrderActions.getAllJobOrders, dispatch),
    searchJobOrders: bindActionCreators(JobOrderActions.searchJobOrders, dispatch),
    getJobOrder: bindActionCreators(JobOrderActions.getJobOrder, dispatch),
    addJobOrder: bindActionCreators(JobOrderActions.addJobOrder, dispatch),
    saveFilterSearch: bindActionCreators(JobOrderActions.saveFilterSearch, dispatch),
    updateJobOrder: bindActionCreators(JobOrderActions.updateJobOrder, dispatch),
    deleteJobOrder: bindActionCreators(JobOrderActions.deleteJobOrder, dispatch),
    getHouseLevelStock: bindActionCreators(JobOrderActions.getHouseLevelStock, dispatch),
    getUsers: bindActionCreators(UserActions.getUsers, dispatch),
    getAllBillingItems: bindActionCreators(BillingItemActions.getAllBillingItems, dispatch),
    getAllHouseLevelTypes: bindActionCreators(HouseLevelTypeActions.getAllHouseLevelTypes, dispatch),
    updateJobOrderUser: bindActionCreators(JobOrderActions.updateJobOrderUser, dispatch),
    addPurchaseOrder: bindActionCreators(PurchaseOrderActions.addPurchaseOrder, dispatch),
    getAllBillingItemGroups: bindActionCreators(billingItemActions.getAllBillingItemGroups, dispatch),
    getAllUserTypes: bindActionCreators(userTypeActions.getAllUserTypes, dispatch),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportTablePrint);
