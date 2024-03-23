import * as types from '../actions/types';
import { Action, Option } from '../../types/interfaces';


const initialState = {
  options: [],
  loading: false,
};

interface State {
  options: Option[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.OPTIONS_LOADING:
    case types.GET_OPTION_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_OPTION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        options: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_OPTIONS:
      return {
        ...state,
        options: action.payload,
        loading: false,
      };
    case types.ADD_OPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        options: [action.payload, ...state.options],
      };
    case types.UPDATE_OPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        options: state.options.map((option) => {
          return option.id !== action.payload.id ? option : {
            ...option,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_OPTION_FAILURE:
    case types.UPDATE_OPTION_FAILURE:
    case types.DELETE_OPTION_FAILURE:
    case types.GET_OPTION_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_OPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        options: state.options.filter((option) => option.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
