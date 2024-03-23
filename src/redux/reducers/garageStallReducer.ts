import * as types from '../actions/types';
import { Action, GarageStall } from '../../types/interfaces';


const initialState = {
  garageStalls: [],
  loading: false,
};

interface State {
  garageStalls: GarageStall[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.GARAGE_STALLS_LOADING:
    case types.ADD_GARAGE_STALL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_GARAGE_STALL_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        garageStalls: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_GARAGE_STALLS:
      return {
        ...state,
        garageStalls: action.payload,
        loading: false,
      };
    case types.ADD_GARAGE_STALL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        garageStalls: [action.payload, ...state.garageStalls],
      };
    case types.UPDATE_GARAGE_STALL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        garageStalls: state.garageStalls.map((garageStall) => {
          return garageStall.id !== action.payload.id ? garageStall : {
            ...garageStall,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_GARAGE_STALL_FAILURE:
    case types.UPDATE_GARAGE_STALL_FAILURE:
    case types.DELETE_GARAGE_STALL_FAILURE:
    case types.GET_GARAGE_STALL_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_GARAGE_STALL_SUCCESS:
      return {
        ...state,
        loading: false,
        garageStalls: state.garageStalls.filter((garageStall) => garageStall.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
