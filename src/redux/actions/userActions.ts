import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { IAuthFunction, ExistingUser, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setUsersLoading = () => ({ type: types.USERS_LOADING });

export const getUserList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_USER_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/users?source=userpage', authHeader(getState, params));
    dispatch({
      type: types.GET_USER_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_USER_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_USER_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getUsers = () => (dispatch: Function, getState: Function) => {
  dispatch(setUsersLoading());

  axios
    .get(configs.url.API_URL + '/users', authHeader(getState))
    .then((res) => {
      console.log(`getUsers response: ${res.data.data}`);
      dispatch({
        type: types.GET_USERS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      console.log(`getUsers error: ${err}`);
      console.log(err);
      console.log(err.response.data.msg);
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addUser = (user: ExistingUser) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setUsersLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/user', user, authHeader(getState));
    dispatch({
      type: types.ADD_USER_SUCCESS,
      payload: response.data.data,
    });
    toast.success('User added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_USER_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateUser = (user: ExistingUser) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setUsersLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/user', user, authHeader(getState));
    dispatch({
      type: types.UPDATE_USER_SUCCESS,
      payload: response.data.data,
    });
    toast.success('User updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_USER_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteUser = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setUsersLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/user/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_USER_SUCCESS,
      payload: id,
    });
    toast.success('User deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_USER_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const getUsersByType = (options: any = {}) => (dispatch: Function, getState: Function) => {
  dispatch(setUsersLoading());
  const params = { ...options };
  axios
    .get(configs.url.API_URL + '/users-by', authHeader(getState, params))
    .then((res) => {
      dispatch({
        type: types.GET_USERS_BY_TYPE,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      console.log(`getUsers error: ${err}`);
      console.log(err);
      console.log(err.response.data.msg);
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};
