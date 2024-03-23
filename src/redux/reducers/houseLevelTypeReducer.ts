import * as types from '../actions/types';
import { Action, HouseLevelType } from '../../types/interfaces';


const initialState = {
  houseLevelTypes: [],
  loading: false,
};

interface State {
  houseLevelTypes: HouseLevelType[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.HOUSE_LEVEL_TYPES_LOADING:
    case types.GET_HOUSE_LEVEL_TYPE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_HOUSE_LEVEL_TYPE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        houseLevelTypes: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_HOUSE_LEVEL_TYPES:
      return {
        ...state,
        houseLevelTypes: action.payload,
        loading: false,
      };
    case types.ADD_HOUSE_LEVEL_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        houseLevelTypes: [action.payload, ...state.houseLevelTypes],
      };
    case types.UPDATE_HOUSE_LEVEL_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        houseLevelTypes: state.houseLevelTypes.map((houseLevelType) => {
          return houseLevelType.id !== action.payload.id ? houseLevelType : {
            ...houseLevelType,
            houseTypeName: action.payload.houseTypeName,
            status: action.payload.status,
            isFireBarrier: action.payload.isFireBarrier,
            garage: action.payload.garage,
          };
        }),
      };
    case types.ADD_HOUSE_LEVEL_TYPE_FAILURE:
    case types.UPDATE_HOUSE_LEVEL_TYPE_FAILURE:
    case types.DELETE_HOUSE_LEVEL_TYPE_FAILURE:
    case types.GET_HOUSE_LEVEL_TYPE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_HOUSE_LEVEL_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        houseLevelTypes: state.houseLevelTypes.filter((houseLevelType) => houseLevelType.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
