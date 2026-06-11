import * as types from '../actions/types';

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

export default function transactionReducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_TRANSACTIONS_REQUEST:
    case types.CREATE_TRANSACTION_REQUEST:
    case types.DELETE_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
        loading: false,
      };
    case types.CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        loading: false,
      };
    case types.DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        loading: false,
      };
    case types.FETCH_TRANSACTIONS_FAILURE:
    case types.CREATE_TRANSACTION_FAILURE:
    case types.DELETE_TRANSACTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
