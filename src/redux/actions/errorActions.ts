import axios from 'axios';
import * as types from './types';
import { IMsg } from '../../types/interfaces';


// RETURN ERRORS
export const returnErrors = (msg: IMsg, status: number, id: any = null) => {
  return {
    type: types.GET_ERRORS,
    payload: { msg, status, id }
  }
}

// CLEAR ERRORS
export const clearErrors = () => {
  return {
    type: types.CLEAR_ERRORS
  }
}