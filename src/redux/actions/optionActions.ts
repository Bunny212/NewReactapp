import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { Option, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setOptionLoading = () => ({ type: types.OPTIONS_LOADING });

export const getOptionList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_OPTION_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/options', authHeader(getState, params));
    dispatch({
      type: types.GET_OPTION_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_OPTION_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_OPTION_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllOptions = () => (dispatch: Function, getState: Function) => {
  dispatch(setOptionLoading());

  axios
    .get(configs.url.API_URL + '/options', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_OPTIONS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getOption = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setOptionLoading());
  axios
    .get(`${configs.url.API_URL}/option/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_OPTION,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addOption = (option: Option) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setOptionLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/option', option, authHeader(getState));
    dispatch({
      type: types.ADD_OPTION_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Option added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_OPTION_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateOption = (option: Option) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setOptionLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/option', option, authHeader(getState));
    dispatch({
      type: types.UPDATE_OPTION_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Option updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_OPTION_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteOption = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setOptionLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/option/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_OPTION_SUCCESS,
      payload: id,
    });
    toast.success('Option deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_OPTION_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
