import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { GarageFinish, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setGarageFinishLoading = () => ({ type: types.GARAGE_FINISHES_LOADING });

export const getGarageFinishList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_GARAGE_FINISH_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/garage-finishes', authHeader(getState, params));
    dispatch({
      type: types.GET_GARAGE_FINISH_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_GARAGE_FINISH_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_GARAGE_FINISH_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllGarageFinishes = () => (dispatch: Function, getState: Function) => {
  dispatch(setGarageFinishLoading());

  axios
    .get(configs.url.API_URL + '/garage-finishes', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_GARAGE_FINISHES,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getGarageFinish = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setGarageFinishLoading());
  axios
    .get(`${configs.url.API_URL}/garage-finish/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_GARAGE_FINISH,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addGarageFinish = (garageFinish: GarageFinish) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setGarageFinishLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/garage-finish', garageFinish, authHeader(getState));
    dispatch({
      type: types.ADD_GARAGE_FINISH_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Garage Finish added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_GARAGE_FINISH_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateGarageFinish = (garageFinish: GarageFinish) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setGarageFinishLoading());

  try {
    const response = await axios.put(configs.url.API_URL + '/garage-finish', garageFinish, authHeader(getState));
    dispatch({
      type: types.UPDATE_GARAGE_FINISH_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Garage Finish updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_GARAGE_FINISH_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteGarageFinish = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setGarageFinishLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/garage-finish/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_GARAGE_FINISH_SUCCESS,
      payload: id,
    });
    toast.success('Garage Finish deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_GARAGE_FINISH_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
