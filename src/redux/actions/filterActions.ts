import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { Action } from '../../types/interfaces';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';
import { Dispatch } from 'redux';
import { AppState } from '../store';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { Filter } from '../../types/interfaces'; 



export const setFiltersLoading = () => ({ type: types.FILTERS_LOADING });

export const getFilterList = (options: any = {}) => async (
  dispatch: Dispatch<Action>,
  getState: () => AppState
) => {
  dispatch({ type: 'GET_FILTER_LIST_REQUEST' });
  const params = { ...options };
  try {
    const response = await axios.get(
      configs.url.API_URL + '/filters',
      authHeader(getState, params)
    );
    dispatch({
      type: types.GET_FILTER_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    if (_.get(error, 'response.data.msg', '')) {
      dispatch({
        type: types.GET_FILTER_LIST_FAILURE,
        payload: { msg: error.response.data.msg, status: error.response.status },
      });
      toast.error(error.response.data.msg || 'An error occurred');
    } else if (_.get(error, 'response.msg')) {
      dispatch({
        type: types.GET_FILTER_LIST_FAILURE,
        payload: { msg: error.response.msg },
      });
      toast.error(error.response.msg || 'An error occurred');
    }
  }
};

export const getAllFilters = (options: any = {}) => (
  dispatch: Function,
  getState: Function
) => {
  dispatch(setFiltersLoading());
  const params = { ...options };
  axios
    .get(configs.url.API_URL + '/filters', authHeader(getState, params))
    .then((res) => {
      dispatch({
        type: types.GET_ALL_FILTERS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const getFilter = (id: number) => (
  dispatch: Function,
  getState: Function
) => {
  dispatch(setFiltersLoading());
  axios
    .get(`${configs.url.API_URL}/filter/${id}`, authHeader(getState))
    .then((res) => {
      dispatch({
        type: types.GET_FILTER,
        payload: id,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.msg, err.response.status));
    });
};

export const deleteFilter = (id: number) => async (
  dispatch: Dispatch<Action>,
  getState: () => AppState
) => {
  dispatch({ type: 'DELETE_FILTER_REQUEST' });
  try {
    const response = await axios.delete(
      `${configs.url.API_URL}/deletefilter/${id}`,
      authHeader(getState)
    );
    dispatch({
      type: types.DELETE_FILTER_SUCCESS,
      payload: id,
    });
    toast.success('Filter deleted successfully');
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.DELETE_FILTER_FAILURE,
      payload: { msg: error.response.data.msg, status: error.response.status },
    });
    toast.error(error.response.data.msg || 'An error occurred');
  }
};

interface UpdateFilter {
  type: typeof types.UPDATE_FILTER_REQUEST;
  filter: Filter;
}
