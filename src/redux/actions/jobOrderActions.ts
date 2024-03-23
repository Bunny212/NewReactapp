import axios from 'axios';
import * as types from './types';
import { Dispatch } from 'redux';
import { returnErrors } from './errorActions';
import { JobOrder, JobOrderEmail, JioHouseLevelStock, PurchaseOrderEmail, JobOrderUser, JobOrderFilter, ReportFilter } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { toast } from "react-toastify";


export const setJobOrdersLoading = () => ({ type: types.JOB_ORDERS_LOADING });

export const getAllJobOrders = (options: any = {}) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  const params = { ...options };
  axios
    .get(`${configs.url.API_URL}/job-orders`, authHeader(getState, params))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_JOB_ORDERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const saveFilterSearch = (filterData: any) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .post(`${configs.url.API_URL}/search-data`, filterData, authHeader(getState))
    .then((res) => {
      toast.success('Search saved successfully');
      dispatch({
        type: types.SAVE_FILTER_SEARCH,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getFilterSearch = () => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .get(`${configs.url.API_URL}/search-data`, authHeader(getState))
    .then((res) => {
      console.log('res', res);
      dispatch({
        type: types.GET_FILTER_SEARCH,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const searchJobOrders = (jobOrderFilter: JobOrderFilter, options: any = {}) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  const params = { ...options };
  axios
    .post(`${configs.url.API_URL}/job-orders`, jobOrderFilter, authHeader(getState, params))
    .then((res) => {
      dispatch({
        type: types.SEARCH_JOB_ORDERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getReportJobOrders = (jobOrderFilter: ReportFilter) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .post(`${configs.url.API_URL}/job-orders/reports`, jobOrderFilter, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_REPORT_JOB_ORDERS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getJobOrder = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .get(`${configs.url.API_URL}/job-order/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_JOB_ORDER,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addJobOrder = (jobOrder: JobOrder) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .post(`${configs.url.API_URL}/job-order`, jobOrder, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.ADD_JOB_ORDER,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateJobOrder = (jobOrder: JobOrder) => async (dispatch: Dispatch, getState: Function): Promise<any | any[]> => {
  dispatch(setJobOrdersLoading());
  return axios
    .put(`${configs.url.API_URL}/job-order`, jobOrder, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_JOB_ORDER,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      console.log('an error soooo');
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const deleteJobOrder = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .delete(`${configs.url.API_URL}/job-order/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.DELETE_JOB_ORDER,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const sendJobOrderEmail = (jobOrderEmail: JobOrderEmail) => (dispatch: Function, getState: Function) => {
  // dispatch(setJobOrdersLoading());
  axios
    .post(`${configs.url.API_URL}/job-order/send-email`, jobOrderEmail, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.SEND_JOB_ORDER_EMAIL,
        payload: res.data.data,
      });
      toast.success('Email sent successfully');
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const sendInvoiceEmail = (jobOrderEmail: JobOrderEmail) => (dispatch: Function, getState: Function) => {
  // dispatch(setJobOrdersLoading());
  axios
    .post(`${configs.url.API_URL}/job-order/send-invoice-email`, jobOrderEmail, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.SEND_INVOICE_EMAIL,
        payload: res.data.data,
      });
      toast.success('Email sent successfully');
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};


export const getHouseLevelStock = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .get(`${configs.url.API_URL}/house-level-stock/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_HOUSE_LEVEL_STOCK,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateHouseLevelStock = (id: number, houseLevelStock: JioHouseLevelStock) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .put(`${configs.url.API_URL}/house-level-stock/${id}`, houseLevelStock, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_HOUSE_LEVEL_STOCK,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const sendPurchaseOrderEmail = (purchaseOrderEmail: PurchaseOrderEmail) => (dispatch: Function, getState: Function) => {
  // dispatch(setJobOrdersLoading());
  axios
    .post(`${configs.url.API_URL}/purchase-order/send-email`, purchaseOrderEmail, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.SEND_PURCHASE_ORDER_EMAIL,
        payload: res.data.data,
      });
      toast.success('Email sent successfully');
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateJobOrderUser = (jobOrderUser: JobOrderUser) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  axios
    .patch(`${configs.url.API_URL}/job-order/update-user`, jobOrderUser, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_JOB_ORDER_USER,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getAllGarageJobOrders = (options: any = {}) => (dispatch: Function, getState: Function) => {
  dispatch(setJobOrdersLoading());
  const params = { ...options };
  axios
    .get(`${configs.url.API_URL}/garage-job-orders`, authHeader(getState, params))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_GARAGE_JOB_ORDERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};
