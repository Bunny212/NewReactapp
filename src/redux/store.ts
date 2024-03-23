import { createStore, applyMiddleware, compose } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import rootReducer from './reducers';
import { Action } from '../types/interfaces';

const initialState = {};

const middleware = [thunk];

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export type AppState = ReturnType<typeof rootReducer>

const store = createStore(
  rootReducer,
  initialState,
  // composeEnhancers(applyMiddleware(...middleware))
  composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<AppState, Action>))
  // composeEnhancers(applyMiddleware<DispatchFunctionType, StateType>(thunkMiddleware))
);

export default store;
