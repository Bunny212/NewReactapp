import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { HouseType, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setHouseTypeLoading = () => ({ type: types.HOUSE_TYPES_LOADING });

export const getHouseTypeList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_HOUSE_TYPE_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/house-types', authHeader(getState, params));
    dispatch({
      type: types.GET_HOUSE_TYPE_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_HOUSE_TYPE_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_HOUSE_TYPE_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllHouseTypes = (options: any = {}) => (dispatch: Function, getState: Function) => {
  dispatch(setHouseTypeLoading());
  const params = { ...options };

  axios
    .get(configs.url.API_URL + '/house-types', authHeader(getState, params))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_HOUSE_TYPES,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getHouseType = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setHouseTypeLoading());
  axios
    .get(`${configs.url.API_URL}/house-type/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_HOUSE_TYPE,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addHouseType = (houseType: HouseType) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setHouseTypeLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/house-type', houseType, authHeader(getState));
    dispatch({
      type: types.ADD_HOUSE_TYPE_SUCCESS,
      payload: response.data.data,
    });
    toast.success('House Type added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_HOUSE_TYPE_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateHouseType = (houseType: HouseType) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setHouseTypeLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/house-type', houseType, authHeader(getState));
    dispatch({
      type: types.UPDATE_HOUSE_TYPE_SUCCESS,
      payload: response.data.data,
    });
    toast.success('House Type updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_HOUSE_TYPE_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteHouseType = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setHouseTypeLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/house-type/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_HOUSE_TYPE_SUCCESS,
      payload: id,
    });
    toast.success('House Type deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_HOUSE_TYPE_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
