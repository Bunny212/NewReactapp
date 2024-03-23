import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import VerModalPrint from './VerModalPrint';
import InvoiceModalPrint from './InvoiceModalPrint';
import SubModalPrint from './SubModalPrint';


import PropTypes from 'prop-types';
import {
  JobOrderReduxProps,
  JobOrderList,
  JobOrder,
  Target,
} from '../../types/interfaces';


const PrintSchedule = (props: any) => {

  // const { id, label } = useParams();
  // props.id
  // console.log('soooooo', id);
  // console.log(props.id);
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
            // return new Promise((resolve) => {
              // props.handlePrintSubmit();
              // setTimeout(() => {
                // resolve();
              // }, 1500);
            // });
          // }
        }
        }
        trigger={() => (
          <button
            // form={props.componentName === 'jio' ? 'jio-form' : ''}
            type="button"
            className={`btn btn-primary ${props.className || ''}`}
          // onClick={() => props.handlePrintSubmit()}
          >
            {props.label}
          </button>)}
        content={() => componentRef.current}
      />
      <div style={{ display: "none" }}>

        <div ref={componentRef}>
          {props.componentName === 'verModalPrint' ? (
            <>
              <VerModalPrint
                verDefault={props.verDefault}
                verificationFormData={props.verificationFormData}
                jobOrderAddress={props.jobOrderAddress}
                jobOrderBuilderName={props.jobOrderBuilderName}
              />
            </>
          ) : (
              <>

              </>
            )}
          {props.componentName === 'invoiceModalPrint' ? (
            <>
              <InvoiceModalPrint
                verDefault={props.verDefault}
                verificationFormData={props.verificationFormData}
                purchaseOrderFormData={props.purchaseOrderFormData}
                filterFormSubmitted={props.filterFormSubmitted}
                subUserType={props.subUserType}
                subUserTypeId={props.subUserTypeId}
                verJobOrderId={props.verJobOrderId}
              />
            </>
          ) : (
              <>

              </>
            )}

          {props.componentName === 'subModalPrint' ? (
            <>
              <SubModalPrint
                verDefault={props.verDefault}
                verificationFormData={props.verificationFormData}
                filterFormSubmitted={props.filterFormSubmitted}
                // purchaseOrderFormData={props.purchaseOrderFormData}
                subUserType={props.subUserType}
                subUserTypeId={props.subUserTypeId}
                verJobOrderActiveType={props.verJobOrderActiveType}
                subFormData={props.subFormData}
                verJobOrderId={props.verJobOrderId}
              />
            </>
          ) : (
              <>

              </>
            )}

          {props.componentName !== 'verModalPrint' && props.componentName !== 'invoiceModalPrint' && props.componentName !== 'subModalPrint' ? (
            <>
              <VerModalPrint />
            </>
          ) : (
              <>
              </>
            )}
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

PrintSchedule.propTypes = {
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
)(PrintSchedule);
