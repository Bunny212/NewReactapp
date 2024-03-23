import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { GarageStall, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setGarageStallLoading = () => ({ type: types.GARAGE_STALLS_LOADING });

export const getGarageStallList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_GARAGE_STALL_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/garage-stalls', authHeader(getState, params));
    dispatch({
      type: types.GET_GARAGE_STALL_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_GARAGE_STALL_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_GARAGE_STALL_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllGarageStalls = () => (dispatch: Function, getState: Function) => {
  dispatch(setGarageStallLoading());

  axios
    .get(configs.url.API_URL + '/garage-stalls', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_GARAGE_STALLS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getGarageStall = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setGarageStallLoading());
  axios
    .get(`${configs.url.API_URL}/garage-stall/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_GARAGE_STALL,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addGarageStall = (garageStall: GarageStall) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setGarageStallLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/garage-stall', garageStall, authHeader(getState));
    dispatch({
      type: types.ADD_GARAGE_STALL_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Garage Stall added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_GARAGE_STALL_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateGarageStall = (garageStall: GarageStall) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setGarageStallLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/garage-stall', garageStall, authHeader(getState));
    dispatch({
      type: types.UPDATE_GARAGE_STALL_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Garage Stall updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_GARAGE_STALL_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteGarageStall = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setGarageStallLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/garage-stall/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_GARAGE_STALL_SUCCESS,
      payload: id,
    });
    toast.success('Garage Stall deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_GARAGE_STALL_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
