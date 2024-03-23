import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { Vault, Action } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from "react-toastify";
import _ from 'lodash';


export const setVaultLoading = () => ({ type: types.VAULTS_LOADING });

export const getVaultList = (options: any = {}) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch({type: 'GET_VAULT_LIST_REQUEST'});
  const params = { ...options };
  try {
    const response = await axios.get(configs.url.API_URL + '/vaults', authHeader(getState, params));
    dispatch({
      type: types.GET_VAULT_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_VAULT_LIST_FAILURE,
        payload: {msg: error.response.data.msg, status: error.response.status},
      });
      toast.error(error.response.data.msg || 'And error occured');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_VAULT_LIST_FAILURE,
        payload: {msg: error.response.msg},
      });
      toast.error(error.response.msg || 'And error occured');
    }    
  }
};

export const getAllVaults = () => (dispatch: Function, getState: Function) => {
  dispatch(setVaultLoading());

  axios
    .get(configs.url.API_URL + '/vaults', authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_VAULTS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getVault = (id: number) => (dispatch: Function, getState: Function) => {
  dispatch(setVaultLoading());
  axios
    .get(`${configs.url.API_URL}/vault/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_VAULT,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const addVault = (vault: Vault) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setVaultLoading());
  try {
    const response = await axios.post(configs.url.API_URL + '/vault', vault, authHeader(getState));
    dispatch({
      type: types.ADD_VAULT_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Vault added successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.ADD_VAULT_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const updateVault = (vault: Vault) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setVaultLoading());
  try {
    const response = await axios.put(configs.url.API_URL + '/vault', vault, authHeader(getState));
    dispatch({
      type: types.UPDATE_VAULT_SUCCESS,
      payload: response.data.data,
    });
    toast.success('Vault updated successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.UPDATE_VAULT_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};

export const deleteVault = (id: number) => async (dispatch: Dispatch<Action>, getState: () => AppState) => {
  dispatch(setVaultLoading());
  try {
    const response = await axios.delete(`${configs.url.API_URL}/vault/${id}`, authHeader(getState));
    dispatch({
      type: types.DELETE_VAULT_SUCCESS,
      payload: id,
    });
    toast.success('Vault deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_VAULT_FAILURE,
      payload: {msg: error.response.data.msg, status: error.response.status},
    });
    toast.error(error.response.data.msg || 'And error occured');
  }
};
