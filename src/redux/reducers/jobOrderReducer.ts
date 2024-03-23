import * as types from '../actions/types';
import { Action, JobOrder } from '../../types/interfaces';


const initialState = {
  jobOrders: [],
  activeJobOrder: {},
  loading: false,
};

interface State {
  jobOrders: JobOrder[] | any;
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.JOB_ORDERS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_JOB_ORDERS:
      return {
        ...state,
        loading: false,
        error: null,
        jobOrders: action.payload.data,
        meta: action.payload.meta,
      };
    case types.SEARCH_JOB_ORDERS:
      return {
        ...state,
        jobOrders: action.payload,
        loading: false,
      };
    case types.GET_REPORT_JOB_ORDERS:
      return {
        ...state,
        jobOrders: action.payload,
        loading: false,
      };
    case types.GET_JOB_ORDER:
      return {
        ...state,
        activeJobOrder: action.payload,
        loading: false,
      };
    case types.ADD_JOB_ORDER:
      return {
        ...state,
        jobOrders: [action.payload, ...state.jobOrders],
      };
    case types.UPDATE_JOB_ORDER:
      return {
        ...state,
        jobOrders: (state.jobOrders.hasOwnProperty('data') ? state.jobOrders?.data : state.jobOrders).map((jobOrder: any)=> {
          return jobOrder.id !== action.payload.id ? jobOrder : {
            ...jobOrder,
            ...action.payload
          };
        }).filter((singleJobOrder: any) => singleJobOrder.jobStatus !== 'closed'),
        activeJobOrder: action.payload,
      };
    case types.DELETE_JOB_ORDER:
      return {
        ...state,
        jobOrders: state.jobOrders.filter((jobOrder: any) => jobOrder.id !== action.payload),
      };
    case types.SEND_JOB_ORDER_EMAIL:
      return {
        ...state,
      };
    case types.SEND_INVOICE_EMAIL:
      return {
        ...state,
      };
    case types.GET_HOUSE_LEVEL_STOCK:
      return {
        ...state,
        activeHouseLevelStock: action.payload,
        loading: false,
      };
    case types.UPDATE_HOUSE_LEVEL_STOCK:
      return {
        ...state,
        activeHouseLevelStock: action.payload.houseLevels,
        jobOrders: state.jobOrders.map((jobOrder: any) => {
          return jobOrder.id !== action.payload.id ? jobOrder : {
            ...jobOrder,
            ...action.payload
          };
        }).filter((singleJobOrder: any) => singleJobOrder.jobStatus !== 'closed'),
        loading: false,
      };
    case types.SEND_PURCHASE_ORDER_EMAIL:
      return {
        ...state,
      };
    case types.UPDATE_JOB_ORDER_USER:
      return {
        ...state,
        jobOrders: state.jobOrders.map((jobOrder: any) => {
          return jobOrder.id !== action.payload.id ? jobOrder : {
            ...jobOrder,
            ...action.payload
          };
        })
      };
    case types.GET_ALL_GARAGE_JOB_ORDERS:
      return {
        ...state,
        loading: false,
        error: null,
        jobOrders: action.payload.data,
        meta: action.payload.meta,
      };
    default:
      return {
        ...state,
      };
  }
}
