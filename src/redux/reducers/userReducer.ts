import * as types from '../actions/types';
import { Action, ExistingUser } from '../../types/interfaces';


const initialState = {
  users: [],
  loading: false,
};

interface State {
  users: ExistingUser[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.USERS_LOADING:
    case types.GET_USER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        users: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_USERS:
    case types.GET_USERS_BY_TYPE:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case types.ADD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        users: [action.payload, ...state.users],
      };
    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        users: state.users.map((user) => {
          return user.id !== action.payload.id ? user : {
            ...user,
            name: action.payload.name,
            firstname: action.payload.firstname,
            email: action.payload.email,
            phone: action.payload.phone,
            userTypes: action.payload.userTypes,
          };
        }),
      };
    case types.ADD_USER_FAILURE:
    case types.UPDATE_USER_FAILURE:
    case types.DELETE_USER_FAILURE:
    case types.GET_USER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
