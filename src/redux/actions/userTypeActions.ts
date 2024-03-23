import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { UserType } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';

export const setUserTypeLoading = () => ({ type: types.USER_TYPES_LOADING });

export const getAllUserTypes = () => (dispatch: Function, getState: Function) => {
  dispatch(setUserTypeLoading());

  axios
    .get(configs.url.API_URL + '/user-types', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_USER_TYPES,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getUserType = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setUserTypeLoading());
  axios
    .get(`${configs.url.API_URL}/user-type/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_USER_TYPE,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addUserType = (userType: UserType) => (dispatch: Function, getState: Function) => {
  dispatch(setUserTypeLoading());
  axios
    .post(configs.url.API_URL + '/user-type', userType, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.ADD_USER_TYPE,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const updateUserType = (userType: UserType) => (dispatch: Function, getState: Function) => {
  dispatch(setUserTypeLoading());
  axios
    .put(configs.url.API_URL + '/user-type', userType, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.UPDATE_USER_TYPE,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const deleteUserType = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setUserTypeLoading());
  axios
    .delete(`${configs.url.API_URL}/user-type/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.DELETE_USER_TYPE,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};
