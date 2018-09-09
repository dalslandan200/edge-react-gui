// @flow

import * as Constants from '../../constants/indexConstants'
import type { Action } from '../ReduxTypes'
import * as ACTION from './action.js'

type ExchangeRateState = ?number
const exchangeRatesReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION.UPDATE_EXCHANGE_RATES:
      return action.data.exchangeRates
    default:
      return state
  }
}

export const exchangeRates = (state: ExchangeRateState, action: Action) => {
  if (action.type === Constants.LOGOUT || action.type === Constants.DEEP_LINK_RECEIVED) {
    state = undefined
  }

  return exchangeRatesReducer(state, action)
}
