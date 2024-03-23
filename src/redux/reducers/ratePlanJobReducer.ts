import * as types from '../actions/types';
import { Action, RatePlanJob } from '../../types/interfaces';


const initialState = {
  ratePlanJobs: [],
  loading: false,
};

interface State {
  ratePlanJobs: RatePlanJob[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.RATE_PLAN_JOBS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.GET_ALL_RATE_PLAN_JOBS:
      return {
        ...state,
        ratePlanJobs: action.payload,
        loading: false,
      };
    case types.ADD_RATE_PLAN_JOB:
      return {
        ...state,
        ratePlanJobs: [action.payload, ...state.ratePlanJobs],
      };
    case types.UPDATE_RATE_PLAN_JOB:
      return {
        ...state,
        ratePlanJobs: state.ratePlanJobs.map((ratePlanJob) => {
          return ratePlanJob.id !== action.payload.id ? ratePlanJob : {
            ...ratePlanJob,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.DELETE_RATE_PLAN_JOB:
      return {
        ...state,
        ratePlanJobs: state.ratePlanJobs.filter((ratePlanJob) => ratePlanJob.id !== action.payload),
      };
    case types.GET_RATE_PLAN_JOB_LEVELS:
      return {
        ...state,
        ratePlanJobLevels: action.payload,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
