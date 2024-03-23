import axios from 'axios';
import * as types from './types';
import { IArticle } from '../../types/interfaces';
import { configs } from '../../types/Constants';


export const setArticlesLoading = () => ({ type: types.ARTICLES_LOADING });

export const getArticles = () => (dispatch: Function) => {
  dispatch(setArticlesLoading());
  axios
    .get(configs.url.API_URL + '/articles')
    .then((res) => {
      console.log('response is', res.data.data);
      dispatch({
        type: types.GET_ARTICLES,
        payload: res.data.data,
      });
    });
  // return {
  //   type: types.GET_ARTICLES
  // }
};

export const addArticle = (article: IArticle) => (dispatch: Function) => {
  dispatch(setArticlesLoading());
  axios
    .post(configs.url.API_URL + '/article', article)
    .then((res) => {
      console.log('add article response', res.data.data);
      dispatch({
        type: types.ADD_ARTICLE,
        payload: res.data.data,
      });
    });
  // return {
  //   type: types.ADD_ARTICLE,
  //   payload: article
  // }
};

export const deleteArticle = (id: number) => (dispatch: Function) => {
  dispatch(setArticlesLoading());
  axios
    .delete(`${configs.url.API_URL}/article/${id}`)
    .then((res) => {
      dispatch({
        type: types.DELETE_ARTICLE,
        payload: id,
      });
    });
  // return {
  //   type: types.DELETE_ARTICLE,
  //   payload: id
  // }
};
