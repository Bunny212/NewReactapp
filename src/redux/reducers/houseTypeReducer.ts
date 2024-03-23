import * as types from '../actions/types';
import { Action, HouseType } from '../../types/interfaces';
import { type } from 'os';


const initialState = {
  houseTypes: [],
  loading: false,
};

interface State {
  houseTypes: HouseType[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.HOUSE_TYPES_LOADING:
    case types.GET_HOUSE_TYPE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_HOUSE_TYPE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        houseTypes: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_HOUSE_TYPES:
      return {
        ...state,
        houseTypes: action.payload,
        loading: false,
      };
    case types.ADD_HOUSE_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        houseTypes: [action.payload, ...state.houseTypes],
      };
    case types.UPDATE_HOUSE_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        houseTypes: state.houseTypes.map((houseType) => {
          return houseType.id !== action.payload.id ? houseType : {
            ...houseType,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_HOUSE_TYPE_FAILURE:
    case types.UPDATE_HOUSE_TYPE_FAILURE:
    case types.DELETE_HOUSE_TYPE_FAILURE:
    case types.GET_HOUSE_TYPE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_HOUSE_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        houseTypes: state.houseTypes.filter((houseType) => houseType.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
