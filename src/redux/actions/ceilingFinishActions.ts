import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { CeilingFinish, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setCeilingFinishesLoading = () => ({ type: types.CEILING_FINISHES_LOADING });

export const getCeilingFinishList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_CEILING_FINISH_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/ceiling-finishes', authHeader(getState, params));
    dispatch({
      type: types.GET_CEILING_FINISH_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_CEILING_FINISH_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_CITY_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllCeilingFinishes = () => (dispatch: Function, getState: Function) => {
  dispatch(setCeilingFinishesLoading());

  axios
    .get(`${configs.url.API_URL}/ceiling-finishes`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_CEILING_FINISHES,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getCeilingFinish = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setCeilingFinishesLoading());
  axios
    .get(`${configs.url.API_URL}/ceiling-finish/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_CEILING_FINISH,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addCeilingFinish = (ceilingFinish: CeilingFinish) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setCeilingFinishesLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/ceiling-finish', ceilingFinish, authHeader(getState));
    dispatch({
      type: types.ADD_CEILING_FINISH_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Ceiling Finish added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_CEILING_FINISH_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateCeilingFinish = (ceilingFinish: CeilingFinish) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setCeilingFinishesLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/ceiling-finish', ceilingFinish, authHeader(getState));
    dispatch({
      type: types.UPDATE_CEILING_FINISH_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Ceiling Finish updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_CEILING_FINISH_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteCeilingFinish = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setCeilingFinishesLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/ceiling-finish/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_CEILING_FINISH_SUCCESS,
      payload: id,
    });
    toast.success('Ceiling Finish deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_CEILING_FINISH_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
