import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { HouseLevelType, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setHouseLevelTypesLoading = () => ({ type: types.HOUSE_LEVEL_TYPES_LOADING });

export const getHouseLevelTypeList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_HOUSE_LEVEL_TYPE_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/house-level-types', authHeader(getState, params));
    dispatch({
      type: types.GET_HOUSE_LEVEL_TYPE_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_HOUSE_LEVEL_TYPE_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_HOUSE_LEVEL_TYPE_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllHouseLevelTypes = () => (dispatch: Function, getState: Function) => {
  dispatch(setHouseLevelTypesLoading());

  axios
    .get(configs.url.API_URL + '/house-level-types', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_HOUSE_LEVEL_TYPES,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getHouseLevelType = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setHouseLevelTypesLoading());
  axios
    .get(`${configs.url.API_URL}/house-level-type/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_HOUSE_LEVEL_TYPE,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addHouseLevelType = (houseLevelType: HouseLevelType) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setHouseLevelTypesLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/house-level-type', houseLevelType, authHeader(getState));
    dispatch({
      type: types.ADD_HOUSE_LEVEL_TYPE_SUCCESS,
      payload: response.data.data,
    });
    toast.success('House Level Type added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_HOUSE_LEVEL_TYPE_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateHouseLevelType = (houseLevelType: HouseLevelType) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setHouseLevelTypesLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/house-level-type', houseLevelType, authHeader(getState));
    dispatch({
      type: types.UPDATE_HOUSE_LEVEL_TYPE_SUCCESS,
      payload: response.data.data,
    });
    toast.success('House Level Type updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_HOUSE_LEVEL_TYPE_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteHouseLevelType = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setHouseLevelTypesLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/house-level-type/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_HOUSE_LEVEL_TYPE_SUCCESS,
      payload: id,
    });
    toast.success('House Level Type deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_HOUSE_LEVEL_TYPE_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
