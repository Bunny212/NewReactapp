import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { PurchaseOrder } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';

export const setPurchaseOrdersLoading = () => ({ type: types.PURCHASE_ORDERS_LOADING });

export const getAllPurchaseOrders = () => (dispatch: Function, getState: Function) => {
  dispatch(setPurchaseOrdersLoading());

  axios
    .get(`${configs.url.API_URL}/job-order/purchaseOrders`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_PURCHASE_ORDERS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getPurchaseOrder = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setPurchaseOrdersLoading());
  axios
    .get(`${configs.url.API_URL}/purchase-order/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_PURCHASE_ORDER,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addPurchaseOrder = (purchaseOrder: PurchaseOrder) => (dispatch: Function, getState: Function) => {
  dispatch(setPurchaseOrdersLoading());
  axios
    .post(`${configs.url.API_URL}/invoice/create`, purchaseOrder, authHeader(getState))
    .then((res) => {
      let data = res.data.data;
      data.items = sortData(data.items);
      console.log('invc data', data);
      dispatch({
        type: types.ADD_PURCHASE_ORDER,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updatePurchaseOrder = (purchaseOrder: PurchaseOrder) => (dispatch: Function, getState: Function) => {
  dispatch(setPurchaseOrdersLoading());
  axios
    .put(`${configs.url.API_URL}/invoice/update`, purchaseOrder, authHeader(getState))
    .then((res) => {
      let data = res.data.data;
      data.items = sortData(data.items);
      dispatch({
        type: types.UPDATE_PURCHASE_ORDER,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const deletePurchaseOrder = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setPurchaseOrdersLoading());
  axios
    .delete(`${configs.url.API_URL}/purchaseOrder/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.DELETE_PURCHASE_ORDER,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};
function sortData (data:any) {
  data = data.sort((a: any, b: any) => a.columnOrder - b.columnOrder)
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    // if (element.billingItemName == "HIGH SHEETS") {
    //   data[index].sortingPosition = 10;
    // }
    // else if (element.billingItemName == "GARAGE-HIGH SHEETS") {
    //   data[index].sortingPosition = 11 ;
    // } else {
    //   data[index].sortingPosition = 0 ;
    // }
    data[index].sortingPosition = 0 ;
  }

  data = data.sort((a: any, b: any) => a.sortingPosition - b.sortingPosition)
  return data;
}
