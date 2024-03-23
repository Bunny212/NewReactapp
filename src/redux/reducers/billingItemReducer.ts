import * as types from '../actions/types';
import { Action, BillingItem } from '../../types/interfaces';


const initialState = {
  billingItems: [],
  loading: false,
};

interface State {
  billingItems: BillingItem[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.BILLING_ITEMS_LOADING:
    case types.GET_BILLING_ITEM_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_BILLING_ITEM_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        billingItems: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_BILLING_ITEMS:
      return {
        ...state,
        billingItems: action.payload,
        loading: false,
      };
    case types.ADD_BILLING_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        billingItems: [action.payload, ...state.billingItems],
      };
    case types.UPDATE_BILLING_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        billingItems: state.billingItems.map((billingItem) => {
          return billingItem.id !== action.payload.id ? billingItem : {
            ...billingItem,
            ...action.payload
            // name: action.payload.name,
            // status: action.payload.status,
          };
        }),
      };
    case types.ADD_BILLING_ITEM_FAILURE:
    case types.UPDATE_BILLING_ITEM_FAILURE:
    case types.DELETE_BILLING_ITEM_FAILURE:
    case types.GET_BILLING_ITEM_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_BILLING_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        billingItems: state.billingItems.filter((billingItem) => billingItem.id !== action.payload),
      };
    case types.GET_ALL_UNITS:
      return {
        ...state,
        units: action.payload,
        loading: false,
      };
    case types.GET_ALL_BILLING_ITEM_GROUPS:
      return {
        ...state,
        billingItemGroups: action.payload,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
