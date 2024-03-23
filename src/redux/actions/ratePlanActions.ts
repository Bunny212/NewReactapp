import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { RatePlans } from '../../types/interfaces';
// import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';


export const setRatePlanLoading = () => ({ type: types.RATE_PLAN_LOADING });

export const getAllRatePlan = () => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanLoading());

  axios
    .get(configs.url.API_URL + '/rateplans', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_RATE_PLAN,
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
    .get(`${configs.url.API_URL}/rateplan/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_RATE_PLAN,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addRatePlan = (rateplan: RatePlans) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanLoading());
  axios
    .post(configs.url.API_URL + '/rateplan', rateplan, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.ADD_RATE_PLAN,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateRatePlan = (rateplan: RatePlans) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanLoading());
  axios
    .put(configs.url.API_URL + '/rateplan', rateplan, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_RATE_PLAN,
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
    .delete(`${configs.url.API_URL}/rateplan/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.DELETE_RATE_PLAN,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};
