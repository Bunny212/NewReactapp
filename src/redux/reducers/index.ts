import { combineReducers } from 'redux';
import articleReducer from './articleReducer';
import userReducer from './userReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import cityReducer from './cityReducer';
import ratePlanReducer from './ratePlanReducer';
import ratePlanReducers from './ratePlanReducers';
import ratePlanJobReducer from './ratePlanJobReducer';

import deliveredByReducer from './deliveredByReducer';
import garageFinishReducer from './garageFinishReducer';
import garageStallReducer from './garageStallReducer';
import houseTypeReducer from './houseTypeReducer';
import optionReducer from './optionReducer';
import userTypeReducer from './userTypeReducer';
import vaultReducer from './vaultReducer';
import builderReducer from './builderReducer';
import ceilingFinishesReducer from './ceilingFinishReducer';
import jobOrderReducer from './jobOrderReducer';
import purchaseOrderReducer from './purchaseOrderReducer';
import billingItemReducer from './billingItemReducer';
import houseLevelTypeReducer from './houseLevelTypeReducer';
import searchReducer from './searchReducer';

const rootReducer = combineReducers({
  articles: articleReducer,
  users: userReducer,
  error: errorReducer,
  auth: authReducer,
  cities: cityReducer,
  rateplan: ratePlanReducer,
  ratePlans: ratePlanReducers,
  ratePlanJobs: ratePlanJobReducer,
  deliveredBy: deliveredByReducer,
  garageFinishes: garageFinishReducer,
  garageStalls: garageStallReducer,
  houseTypes: houseTypeReducer,
  options: optionReducer,
  userTypes: userTypeReducer,
  vaults: vaultReducer,
  builders: builderReducer,
  ceilingFinishes: ceilingFinishesReducer,
  jobOrders: jobOrderReducer,
  purchaseOrders: purchaseOrderReducer,
  billingItems: billingItemReducer,
  houseLevelTypes: houseLevelTypeReducer,
  searchData: searchReducer,
});

export default rootReducer;
