import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { BillingItem, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';

export const setBillingItemsLoading = () => ({ type: types.BILLING_ITEMS_LOADING });

export const getBillingItemList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_CITY_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/billing-items', authHeader(getState, params));
    dispatch({
      type: types.GET_BILLING_ITEM_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_BILLING_ITEM_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_BILLING_ITEM_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllBillingItems = (options: any = {}) => (dispatch: Function, getState: Function) => {
  dispatch(setBillingItemsLoading());

  // const { sortBy } = options;
  const params = { ...options };
  console.log(params);

  axios
    .get(configs.url.API_URL + '/billing-items',  authHeader(getState, params))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_BILLING_ITEMS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getBillingItem = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setBillingItemsLoading());
  axios
    .get(`${configs.url.API_URL}/billing-item/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_BILLING_ITEM,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addBillingItem = (billingItem: BillingItem) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setBillingItemsLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/billing-item', billingItem, authHeader(getState));
    dispatch({
      type: types.ADD_BILLING_ITEM_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Item added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_BILLING_ITEM_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateBillingItem = (billingItem: BillingItem) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setBillingItemsLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/billing-item-update', billingItem, authHeader(getState));
    dispatch({
      type: types.UPDATE_BILLING_ITEM_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Item updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_BILLING_ITEM_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteBillingItem = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setBillingItemsLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/billing-item/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_BILLING_ITEM_SUCCESS,
      payload: id,
    });
    toast.success('Item deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_BILLING_ITEM_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const getAllUnits = () => (dispatch: Function, getState: Function) => {
  dispatch(setBillingItemsLoading());

  axios
    .get(configs.url.API_URL + '/units', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_UNITS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getAllBillingItemGroups = () => (dispatch: Function, getState: Function) => {
  dispatch(setBillingItemsLoading());

  axios
    .get(configs.url.API_URL + '/billing-item-groups', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_BILLING_ITEM_GROUPS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};
