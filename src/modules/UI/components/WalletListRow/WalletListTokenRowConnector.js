// @flow
import { connect } from 'react-redux'
import { bns } from 'biggystring'

import type { Dispatch, State } from '../../../ReduxTypes'
import { WalletListTokenRowComponent } from './WalletListTokenRow.ui.js'
import { DIVIDE_PRECISION, getFiatSymbol, getSettingsTokenMultiplier } from '../../../utils.js'
import type { WalletListTokenRowDispatchProps, WalletListTokenRowOwnProps, WalletListTokenRowStateProps } from './WalletListTokenRow.ui.js'
import { convertCurrency } from '../../selectors.js'

const mapStateToProps = (state: State, ownProps: WalletListTokenRowOwnProps): WalletListTokenRowStateProps => {
  const settings = state.ui.settings
  let fiatValue = 0
  const denomination = ownProps.wallet.allDenominations[currencyCode]
  const multiplier = getSettingsTokenMultiplier(ownProps.currencyCode, settings, denomination)
  const nativeBalance = ownProps.metaTokenBalances[ownProps.currencyCode]
  const cryptoAmount = bns.div(nativeBalance, multiplier, DIVIDE_PRECISION)
  fiatValue = convertCurrency(state, ownProps.currencyCode, ownProps.wallet.isoFiatCurrencyCode, cryptoAmount)

  return {
    settings,
    fiatValue
  }
}
const mapDispatchToProps = (dispatch: Dispatch): WalletListTokenRowDispatchProps => {
  return {}
}

export const WalletListTokenRowConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletListTokenRowComponent)
