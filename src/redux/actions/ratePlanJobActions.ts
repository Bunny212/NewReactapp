import axios from 'axios';
import { Dispatch } from 'redux';
import * as types from './types';
import { returnErrors } from './errorActions';
import { RatePlanJob } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';


export const setRatePlanJobLoading = () => ({ type: types.RATE_PLAN_JOBS_LOADING });

export const getAllRatePlanJobs = () => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanJobLoading());

  axios
    .get(configs.url.API_URL + '/rate-plan-jobs', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_RATE_PLAN_JOBS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getRatePlanJob = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanJobLoading());
  axios
    .get(`${configs.url.API_URL}/rate-plan-job/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_RATE_PLAN_JOB,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addRatePlanJob = (ratePlanJob: RatePlanJob) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanJobLoading());
  axios
    .post(configs.url.API_URL + '/rate-plan-job', ratePlanJob, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.ADD_RATE_PLAN_JOB,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateRatePlanJob = (ratePlanJob: RatePlanJob) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanJobLoading());
  axios
    .put(configs.url.API_URL + '/rate-plan-job', ratePlanJob, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_RATE_PLAN_JOB,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const deleteRatePlanJob = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setRatePlanJobLoading());
  axios
    .delete(`${configs.url.API_URL}/rate-plan-job/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.DELETE_RATE_PLAN_JOB,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};


export const getRatePlanJobLevels = (id: number) => async (dispatch: Dispatch, getState: Function): Promise<any | any[]> => {
  dispatch(setRatePlanJobLoading());
  return axios
    .get(`${configs.url.API_URL}/rate-plan-jobs/${id}/levels`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_RATE_PLAN_JOB_LEVELS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateRatePlanJobLevels = (id: number, ratePlanJobLevels: any) => async (dispatch: Dispatch, getState: Function): Promise<any | any[]> => {
  dispatch(setRatePlanJobLoading());
  return axios
    .put(`${configs.url.API_URL}/rate-plan-jobs/${id}/levels`, ratePlanJobLevels, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_RATE_PLAN_JOB_LEVELS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};
