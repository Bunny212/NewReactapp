import * as types from '../actions/types';
import { Action, CeilingFinish } from '../../types/interfaces';


const initialState = {
  ceilingFinishes: [],
  loading: false,
};

interface State {
  ceilingFinishes: CeilingFinish[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.CEILING_FINISHES_LOADING:
    case types.GET_CEILING_FINISH_LIST_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_CEILING_FINISH_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        ceilingFinishes: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_CEILING_FINISHES:
      return {
        ...state,
        ceilingFinishes: action.payload,
        loading: false,
      };
    case types.ADD_CEILING_FINISH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        ceilingFinishes: [action.payload, ...state.ceilingFinishes],
      };
    case types.UPDATE_CEILING_FINISH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        ceilingFinishes: state.ceilingFinishes.map((ceilingFinish) => {
          return ceilingFinish.id !== action.payload.id ? ceilingFinish : {
            ...ceilingFinish,
            name: action.payload.name,
            definition: action.payload.definition,
            type: action.payload.type,
            fogged: action.payload.fogged,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_CEILING_FINISH_FAILURE:
    case types.UPDATE_CEILING_FINISH_FAILURE:
    case types.DELETE_CEILING_FINISH_FAILURE:
    case types.GET_CEILING_FINISH_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_CEILING_FINISH_SUCCESS:
      return {
        ...state,
        loading: false,
        ceilingFinishes: state.ceilingFinishes.filter((ceilingFinish) => ceilingFinish.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
