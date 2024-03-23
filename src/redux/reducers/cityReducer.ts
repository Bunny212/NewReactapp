import * as types from '../actions/types';
import { Action, City } from '../../types/interfaces';
import { type } from 'os';


const initialState = {
  cities: [],
  loading: false,
  error: null
};

interface State {
  cities: City[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.CITIES_LOADING:
    case types.ADD_CITY_REQUEST:
    case types.UPDATE_CITY_REQUEST:
    case types.DELETE_CITY_REQUEST:
    case types.GET_CITY_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_CITY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cities: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_CITIES:
      return {
        ...state,
        cities: action.payload,
        loading: false,
      };
    case types.ADD_CITY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cities: [action.payload, ...state.cities],
      };
    case types.UPDATE_CITY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        cities: state.cities.map((city) => {
          return city.id !== action.payload.id ? city : {
            ...city,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_CITY_FAILURE:
    case types.UPDATE_CITY_FAILURE:
    case types.DELETE_CITY_FAILURE:
    case types.GET_CITY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_CITY_SUCCESS:
      return {
        ...state,
        loading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
