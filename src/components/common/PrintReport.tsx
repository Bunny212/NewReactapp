import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import ReportTablePrint from '../report/ReportTablePrint';


import PropTypes from 'prop-types';
import {
  JobOrderReduxProps,
  JobOrderList,
  JobOrder,
  Target,
} from '../../types/interfaces';


const PrintReport = (props: any) => {

  // const { id, label } = useParams();
  const componentRef: any = useRef();

  // console.log(props.handlePrintSubmit);
  // const handlePrintClick = () => {
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });
  // const handlePrint = 'test';
  // console.log('yes');
  // return handlePrint;
  // };
  // const Example = () => {


  // return (
  //   <div>
  // <HomePage />
  //     <button onClick={handlePrint}>Print this out!</button>
  //   </div>
  // );
  // };

  return (
    <>


      <ReactToPrint
        onBeforeGetContent={() => {
          // if (props.handlePrintSubmit !== undefined) {
          //   return new Promise((resolve) => {
          //     props.handlePrintSubmit();
          //     setTimeout(() => {
          //       resolve();
          //     }, 1500);
          //   });
          // }
        }
        }
        trigger={() => (
          <button
            // form={props.componentName === 'jio' ? 'jio-form' : ''}
            type="button"
            className={`btn btn-primary pull-right ${props.className || ''}`}
          // onClick={() => props.handlePrintSubmit()}
          >
            {props.label}
          </button>)}
        content={() => componentRef.current}
      />
      <div style={{ display: "none" }}>

        <div ref={componentRef}>
          <>
            <ReportTablePrint
              formData={props.formData}
              columnFilters={props.columnFilters}
              filterFormData={props.filterFormData}
              filterFormDataSubmitted={props.filterFormDataSubmitted}
            />
          </>
        </div>
        {/* <HomePage /> */}
      </div>
      {/* <HomePage /> */}

      {/* <button
        type="button"
        className="btn btn-primary"
        onClick={() => handlePrint }
      >
        <i className="fas fa-save mr-5" />
        Save & Print JIO
      </button> */}


    </>
  );
};

PrintReport.propTypes = {
  // jobOrders: PropTypes.object.isRequired,
  // actions: PropTypes.func.isRequired
};


const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrintReport);
