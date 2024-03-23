import * as types from '../actions/types';
import { Action } from '../../types/interfaces';

const initialState = {
    msg: {},
    status: null,
    id: null
  };

  export default function(state = initialState, action: Action) {
      switch(action.type) {
          case types.GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id
            }
          case types.CLEAR_ERRORS:
              return {
                  msg: {},
                  status: null,
                  id: null
              }
          default:
              return state;

      }
  }
