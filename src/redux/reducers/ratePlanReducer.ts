import * as types from '../actions/types';
import { Action, RatePlans } from '../../types/interfaces';


const initialState = {
  rateplan: [],
  loading: false,
};

interface State {
  rateplan: RatePlans[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.RATE_PLAN_LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_RATE_PLAN:
      return {
        ...state,
        rateplan: action.payload,
        loading: false,
      };
    case types.ADD_RATE_PLAN:
      return {
        ...state,
        RatePlan: [action.payload, ...state.rateplan],
      };
    case types.UPDATE_RATE_PLAN:
      return {
        ...state,
        rateplan: state.rateplan.map((rateplan) => {
          return rateplan.id !== action.payload.id ? rateplan : {
            ...rateplan,
            rate_plan_name: action.payload.rate_plan_name,
            job_id: action.payload.job_id,
          };
        }),
      };
    case types.DELETE_RATE_PLAN:
      return {
        ...state,
        rateplan: state.rateplan.filter((rateplan) => rateplan.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
