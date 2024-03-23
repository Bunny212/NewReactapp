import * as types from '../actions/types';
import { Action } from '../../types/interfaces';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
};


export default function (state = initialState, action: Action) {
  switch (action.type) {
    case types.USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case types.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case types.LOGIN_SUCCESS:
    case types.REGISTER_SUCCESS:
        localStorage.setItem('token', action.payload.token);
    return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        // user: action.payload,
        //   token: action.payload.token
    }
    case types.AUTH_ERROR:
    case types.LOGIN_FAIL:
    case types.LOGOUT_SUCCESS:
    case types.REGISTER_FAIL:
        localStorage.removeItem('token');
        return {
            ...state,
            token: null,
            isAuthenticated: false,
            user: null,
            isLoading: false
        }
    default:
        return state;

  }
}

