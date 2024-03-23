import { v4 as uuidv4 } from 'uuid';
import * as types from '../actions/types';
import { Action, IArticle } from '../../types/interfaces';

const initialState = {
  searchData: [],
  loading: false,
};

interface IState {
  searchData: any[];
};

export default function (state: IState = initialState, action: Action) {
  switch (action.type) {
    case types.GET_FILTER_SEARCH:
      return {
        ...state,
        searchData: action.payload,
        loading: false,
      };
    case types.SAVE_FILTER_SEARCH:
      return {
        ...state,
        searchData: [action.payload, ...state.searchData],
      };
    case types.FILTER_SEARCH_LOADING:
      return {
        ...state,
        loding: true,
      };
    default:
      return {
        ...state,
      };
  }
}
