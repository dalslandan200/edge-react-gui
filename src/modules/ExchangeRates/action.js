// @flow
import type { Dispatch, GetState } from '../'
import { buildExchangeRates } from '../Core/selectors.js'
const PREFIX = 'ExchangeRates/'
export const UPDATE_EXCHANGE_RATES = PREFIX + 'UPDATE_EXCHANGE_RATES'

export const updateExchangeRates = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const exchangeRates = await buildExchangeRates(state)
  console.log('exchageRates: ', exchangeRates)
  dispatch({
    type: UPDATE_EXCHANGE_RATES,
    data: { exchangeRates }
  })
}
