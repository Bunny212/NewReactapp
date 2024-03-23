import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { Builder, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setBuildersLoading = () => ({ type: types.BUILDERS_LOADING });

export const getBuilderList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_BUILDER_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/builders?source=builderpage', authHeader(getState, params));
    dispatch({
      type: types.GET_BUILDER_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_BUILDER_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_BUILDER_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllBuilders = () => (dispatch: Function, getState: Function) => {
  dispatch(setBuildersLoading());

  axios
    .get(`${configs.url.API_URL}/builders`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_BUILDERS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getBuilder = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setBuildersLoading());
  axios
    .get(`${configs.url.API_URL}/builder/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_BUILDER,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addBuilder = (builder: Builder) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'ADD_BUILDER_REQUEST'});
  try {
    const response = await axios.post(configs.url.API_URL + '/builder', builder, authHeader(getState));
    dispatch({
      type: types.ADD_BUILDER_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Builder added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_BUILDER_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateBuilder = (builder: Builder) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'UPDATE_BUILDER_REQUEST'});
  try {
    const response = await axios.put(configs.url.API_URL + '/builder', builder, authHeader(getState));
    dispatch({
      type: types.UPDATE_BUILDER_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Builder updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_BUILDER_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteBuilder = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'DELETE_BUILDER_REQUEST'});
  try {
    const response = await axios.delete(`${configs.url.API_URL}/builder/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_BUILDER_SUCCESS,
      payload: id,
    });
    toast.success('Builder deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_BUILDER_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
