// @flow

import { buildExchangeRates } from '../Core/selectors.js'
import type { Dispatch, GetState } from '../ReduxTypes.js'
const PREFIX = 'ExchangeRates/'
export const UPDATE_EXCHANGE_RATES = PREFIX + 'UPDATE_EXCHANGE_RATES'

export const updateExchangeRates = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const exchangeRates = await buildExchangeRates(state)
  dispatch({
    type: UPDATE_EXCHANGE_RATES,
    data: { exchangeRates }
  })
}
