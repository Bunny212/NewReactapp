import * as types from '../actions/types';
import { Action, RatePlan } from '../../types/interfaces';


const initialState = {
  ratePlans: [],
  loading: false,
};

interface State {
  ratePlans: RatePlan[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.RATE_PLANS_LOADING:
    case types.GET_RATE_PLAN_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_RATE_PLAN_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        ratePlans: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_RATE_PLANS:
      return {
        ...state,
        ratePlans: action.payload,
        loading: false,
      };
    case types.ADD_RATE_PLANS:
      return {
        ...state,
        ratePlans: [action.payload, ...state.ratePlans],
      };
    case types.UPDATE_RATE_PLANS:
      return {
        ...state,
        ratePlans: state.ratePlans.map((ratePlan) => {
          return ratePlan.id !== action.payload.id ? ratePlan : {
            ...ratePlan,
            ratePlanName: action.payload.ratePlanName,
            jobId: action.payload.jobId,
            job: action.payload.job,
          };
        }),
      };
    case types.GET_RATE_PLAN_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_RATE_PLANS:
      return {
        ...state,
        ratePlans: state.ratePlans.filter((ratePlan) => ratePlan.id !== action.payload),
      };
    case types.GET_RATE_PLAN_ITEMS:
      console.log(action.payload);
      return {
        ...state,
        ratePlanItems: action.payload,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
