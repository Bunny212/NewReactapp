import * as types from '../actions/types';
import { Action, PurchaseOrder } from '../../types/interfaces';


const initialState = {
  purchaseOrders: [],
  activePurchaseOrder: {},
  loading: false,
};

interface State {
  purchaseOrders: PurchaseOrder[];
}

export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.PURCHASE_ORDERS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_PURCHASE_ORDERS:
      return {
        ...state,
        purchaseOrders: action.payload,
        loading: false,
      };
    case types.GET_PURCHASE_ORDER:
      return {
        ...state,
        activePurchaseOrder: action.payload,
        loading: false,
      };
    case types.ADD_PURCHASE_ORDER:
      return {
        ...state,
        purchaseOrders: [action.payload, ...state.purchaseOrders],
        activePurchaseOrder: action.payload,
      };
    case types.UPDATE_PURCHASE_ORDER:
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.map((purchaseOrder) => {
          return purchaseOrder.id !== action.payload.id ? purchaseOrder : {
            ...purchaseOrder,
            ...action.payload
          };
        }),
        activePurchaseOrder: action.payload,
      };
    case types.DELETE_PURCHASE_ORDER:
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.filter((purchaseOrder) => purchaseOrder.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
