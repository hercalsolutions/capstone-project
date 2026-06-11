import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import budgetReducer from './reducers/budgetReducer';
import transactionReducer from './reducers/transactionReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  budgets: budgetReducer,
  transactions: transactionReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
