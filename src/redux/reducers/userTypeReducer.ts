import * as types from '../actions/types';
import { Action, UserType } from '../../types/interfaces';


const initialState = {
  userTypes: [],
  loading: false,
};

interface State {
  userTypes: UserType[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.USER_TYPES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_USER_TYPES:
      return {
        ...state,
        userTypes: action.payload,
        loading: false,
      };
    case types.ADD_USER_TYPE:
      return {
        ...state,
        userTypes: [action.payload, ...state.userTypes],
      };
    case types.UPDATE_USER_TYPE:
      return {
        ...state,
        userTypes: state.userTypes.map((userType) => {
          return userType.id !== action.payload.id ? userType : {
            ...userType,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.DELETE_USER_TYPE:
      return {
        ...state,
        userTypes: state.userTypes.filter((userType) => userType.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
