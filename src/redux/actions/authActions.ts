import axios from 'axios';
import * as types from './types';
import { returnErrors } from './errorActions';
import { IAuthFunction } from '../../types/interfaces';
import History from '../../components/common/History';
import { authHeader } from '../../helpers/authHeader';
import { configs } from '../../types/Constants';


// Check token and laod user
export const loadUser = () => (dispatch: Function, getState: Function) => {
  // dispatch(userLoaging());
  dispatch({ type: types.USER_LOADING });

  // Get token nfrom local storage
  // const token = getState().auth.token;

  // Headers
  // const config = {
  //   headers: {
  //     'Content-type': 'application/json'
  //   }
  // }

  // If token then add to headers
  // return { 'Authorization': 'Bearer ' + user.token };
  // if (token) {
  //   config.headers['Authorization'] = `Bearer ${token}`;
  // }
  axios
    .get(configs.url.API_URL + '/user', authHeader(getState))
    .then((res) => {
      console.log('user response is', res.data);
      dispatch({
        type: types.USER_LOADED,
        payload: res.data.user,
      });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response.data.msg);
      dispatch(returnErrors(err.response.data.msg, err.response.status));
      dispatch({
        type: types.AUTH_ERROR,
      });
      // History.push('/login');
    });
  // return {
  //   type: types.GET_ARTICLES
  // }
};

// Login User
export const login = ({ email, password }: IAuthFunction) => (
  dispatch: Function,
) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request body
  const body = JSON.stringify({ email, password });

  axios
    .post(configs.url.API_URL + '/login', body, config)
    .then((res) => {
      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: res.data,
      });
      History.push('/');
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data.msg, err.response.status, 'LOGIN_FAIL'),
      );
      dispatch({
        type: types.LOGIN_FAIL,
      });
    });
};

// Logout User
export const logout = () => {
  History.push('/login');
  return {
    type: types.LOGOUT_SUCCESS,
  };
};
