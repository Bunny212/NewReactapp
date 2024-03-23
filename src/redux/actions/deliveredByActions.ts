import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { DeliveredBy, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setDeliveredByLoading = () => ({ type: types.DELIVERED_BY_LOADING });

export const getDeliveredByList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_DELIVERED_BY_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/delivered-by', authHeader(getState, params));
    dispatch({
      type: types.GET_DELIVERED_BY_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_DELIVERED_BY_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_DELIVERED_BY_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllDeliveredBy = () => (dispatch: Function, getState: Function) => {
  dispatch(setDeliveredByLoading());

  axios
    .get(configs.url.API_URL + '/delivered-by', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_DELIVERED_BY,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getDeliveredBy = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setDeliveredByLoading());
  axios
    .get(configs.url.API_URL + `/delivered-by/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_DELIVERED_BY,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addDeliveredBy = (deliveredBy: DeliveredBy) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setDeliveredByLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/delivered-by', deliveredBy, authHeader(getState));
    dispatch({
      type: types.ADD_DELIVERED_BY_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Delivered By added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_DELIVERED_BY_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateDeliveredBy = (deliveredBy: DeliveredBy) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setDeliveredByLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/delivered-by', deliveredBy, authHeader(getState));
    dispatch({
      type: types.UPDATE_DELIVERED_BY_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Delivered By updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_DELIVERED_BY_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteDeliveredBy = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setDeliveredByLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/delivered-by/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_DELIVERED_BY_SUCCESS,
      payload: id,
    });
    toast.success('Delivered By deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_DELIVERED_BY_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
