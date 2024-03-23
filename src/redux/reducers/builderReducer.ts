import * as types from '../actions/types';
import { Action, Builder } from '../../types/interfaces';


const initialState = {
  builders: [],
  loading: false,
};

interface State {
  builders: Builder[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.BUILDERS_LOADING:
    case types.ADD_BUILDER_REQUEST:
    case types.UPDATE_BUILDER_REQUEST:
    case types.DELETE_BUILDER_REQUEST:
    case types.GET_BUILDER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_BUILDER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        builders: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_BUILDERS:
      return {
        ...state,
        builders: action.payload,
        loading: false,
      };
    case types.ADD_BUILDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        builders: [action.payload, ...state.builders],
      };
    case types.UPDATE_BUILDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        builders: state.builders.map((builder) => {
          return builder.id !== action.payload.id ? builder : {
            ...builder,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_BUILDER_FAILURE:
    case types.UPDATE_BUILDER_FAILURE:
    case types.DELETE_BUILDER_FAILURE:
    case types.GET_BUILDER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_BUILDER_SUCCESS:
      return {
        ...state,
        loading: false,
        builders: state.builders.filter((builder) => builder.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
