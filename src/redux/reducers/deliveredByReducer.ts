import * as types from '../actions/types';
import { Action, DeliveredBy } from '../../types/interfaces';


const initialState = {
  deliveredBy: [],
  loading: false,
};

interface State {
  deliveredBy: DeliveredBy[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.DELIVERED_BY_LOADING:
    case types.DELETE_DELIVERED_BY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_DELIVERED_BY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        deliveredBy: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_DELIVERED_BY:
      return {
        ...state,
        deliveredBy: action.payload,
        loading: false,
      };
    case types.ADD_DELIVERED_BY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        deliveredBy: [action.payload, ...state.deliveredBy],
      };
    case types.UPDATE_DELIVERED_BY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        deliveredBy: state.deliveredBy.map((singleDeliveredBy) => {
          return singleDeliveredBy.id !== action.payload.id ? singleDeliveredBy : {
            ...singleDeliveredBy,
            name: action.payload.name,
            email: action.payload.email,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_DELIVERED_BY_FAILURE:
    case types.UPDATE_DELIVERED_BY_FAILURE:
    case types.DELETE_DELIVERED_BY_FAILURE:
    case types.GET_DELIVERED_BY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_DELIVERED_BY_SUCCESS:
      return {
        ...state,
        loading: false,
        deliveredBy: state.deliveredBy.filter((singleDeliveredBy) => singleDeliveredBy.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
