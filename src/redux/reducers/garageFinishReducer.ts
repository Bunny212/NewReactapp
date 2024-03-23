import * as types from '../actions/types';
import { Action, GarageFinish } from '../../types/interfaces';


const initialState = {
  garageFinishes: [],
  loading: false,
};

interface State {
  garageFinishes: GarageFinish[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.GARAGE_FINISHES_LOADING:
    case types.ADD_GARAGE_FINISH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_GARAGE_FINISH_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        garageFinishes: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_GARAGE_FINISHES:
      return {
        ...state,
        garageFinishes: action.payload,
        loading: false,
      };
    case types.ADD_GARAGE_FINISH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        garageFinishes: [action.payload, ...state.garageFinishes],
      };
    case types.UPDATE_GARAGE_FINISH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        garageFinishes: state.garageFinishes.map((garageFinish) => {
          return garageFinish.id !== action.payload.id ? garageFinish : {
            ...garageFinish,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_GARAGE_FINISH_FAILURE:
    case types.UPDATE_GARAGE_FINISH_FAILURE:
    case types.DELETE_GARAGE_FINISH_FAILURE:
    case types.GET_GARAGE_FINISH_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_GARAGE_FINISH_SUCCESS:
      return {
        ...state,
        loading: false,
        garageFinishes: state.garageFinishes.filter((garageFinish) => garageFinish.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
