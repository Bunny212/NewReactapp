import * as types from '../actions/types';
import { Action, Vault } from '../../types/interfaces';


const initialState = {
  vaults: [],
  loading: false,
};

interface State {
  vaults: Vault[];
}


export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case types.VAULTS_LOADING:
    case types.ADD_VAULT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_VAULT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        vaults: action.payload.data,
        meta: action.payload.meta,
      };
    case types.GET_ALL_VAULTS:
      return {
        ...state,
        vaults: action.payload,
        loading: false,
      };
    case types.ADD_VAULT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        vaults: [action.payload, ...state.vaults],
      };
    case types.UPDATE_VAULT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
        vaults: state.vaults.map((vault) => {
          return vault.id !== action.payload.id ? vault : {
            ...vault,
            name: action.payload.name,
            status: action.payload.status,
          };
        }),
      };
    case types.ADD_VAULT_FAILURE:
    case types.UPDATE_VAULT_FAILURE:
    case types.DELETE_VAULT_FAILURE:
    case types.GET_VAULT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.DELETE_VAULT_SUCCESS:
      return {
        ...state,
        loading: false,
        vaults: state.vaults.filter((vault) => vault.id !== action.payload),
      };
    default:
      return {
        ...state,
      };
  }
}
