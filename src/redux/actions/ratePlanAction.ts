import axios from 'axios';
import * as types from './types';
import { Dispatch } from 'redux';
import { returnErrors } from './errorActions';
import { RatePlan, Action } from '../../types/interfaces';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setRatePlanLoading = () => ({ type: types.RATE_PLANS_LOADING });

export const getRatePlanList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_RATE_PLAN_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/rate-plans', authHeader(getState, params));
    dispatch({
      type: types.GET_RATE_PLAN_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_RATE_PLAN_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_RATE_PLAN_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllRatePlans = () => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanLoading());

  axios
    .get(configs.url.API_URL + '/rate-plans', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_RATE_PLANS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getRatePlan = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanLoading());
  axios
    .get(`${configs.url.API_URL}/rate-plan/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_RATE_PLANS,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addRatePlan = (rateplan: RatePlan) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanLoading());
  axios
    .post(configs.url.API_URL + '/rate-plan', rateplan, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.ADD_RATE_PLANS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateRatePlan = (rateplan: RatePlan) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanLoading());
  axios
    .put(configs.url.API_URL + '/rate-plan', rateplan, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_RATE_PLANS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const deleteRatePlan = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanLoading());
  axios
    .delete(`${configs.url.API_URL}/rate-plan/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.DELETE_RATE_PLANS,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getRatePlanItems = (id: number) => async (dispatch: Dispatch, getState: Function): Promise<any | any[]> => {
  // export const getRatePlanItems = (id: number) => async (dispatch: Dispatch, getState: Function): Promise<void> => {
  dispatch(setRatePlanLoading());
  return axios
    .get(`${configs.url.API_URL}/rate-plan/${id}/items`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_RATE_PLAN_ITEMS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateRatePlanItems = (id: number, ratePlanItems: any) => async (dispatch: Dispatch, getState: Function): Promise<any | any[]> => {
  dispatch(setRatePlanLoading());
  return axios
    .put(`${configs.url.API_URL}/rate-plan/${id}/items`, ratePlanItems, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_RATE_PLAN_ITEMS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};
