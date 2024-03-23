import { v4 as uuidv4 } from 'uuid';
import * as types from '../actions/types';
import { Action, IArticle } from '../../types/interfaces';

const initialState = {
  articles: [],
  loading: false,
};

interface IState {
  articles: IArticle[];
}

export default function (state: IState = initialState, action: Action) {
  switch (action.type) {
    case types.GET_ARTICLES:
      return {
        ...state,
        articles: action.payload,
        loading: false,
      };
    case types.ADD_ARTICLE:
      return {
        ...state,
        articles: [action.payload, ...state.articles],
      };
    case types.DELETE_ARTICLE:
      return {
        ...state,
        articles: state.articles.filter((item) => item.id !== action.payload),
      };
    case types.ARTICLES_LOADING:
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
