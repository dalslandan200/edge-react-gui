// @flow

import { bns } from 'biggystring'
import React, { Component } from 'react'
import { TouchableHighlight, View } from 'react-native'

import { intl } from '../../../../locales/intl.js'
import { getFiatSymbol } from '../../../utils.js'
import type { CurrencyConverter, GuiWallet } from '../../../../types.js'
import Text from '../FormattedText'
import { styles, stylesRaw } from './WalletListRowStyle.js'

export type WalletListTokenRowOwnProps = {
  currencyCode: string,
  metaTokenBalances: Object,
  wallet: GuiWallet,
  onSelectWallet: (string, string) => void
}

export type WalletListTokenRowStateProps = {
  currencyConverter: CurrencyConverter,
  settings: Object
}

export type WalletListTokenRowDispatchProps = {}

export type WalletListTokenRowProps = WalletListTokenRowOwnProps & WalletListTokenRowStateProps

export class WalletListTokenRowComponent extends Component<WalletListTokenRowProps> {
  render () {
    const { settings, wallet, onSelectWallet, currencyCode, fiatValue, cryptoAmount } = this.props
    const parentId = wallet.id
    const fiatBalance = intl.formatNumber(fiatValue, { toFixed: 2 }) || '0'
    const fiatSymbol = getFiatSymbol(wallet.isoFiatCurrencyCode) || ''
    return (
      <TouchableHighlight
        style={[styles.tokenRowContainer]}
        underlayColor={stylesRaw.underlay.color}
        key={currencyCode}
        onPress={() => onSelectWallet(parentId, currencyCode)}
      >
        <View style={styles.currencyRowContent}>
          <View style={styles.currencyRowNameTextWrap}>
            <Text style={styles.currencyRowText}>{currencyCode}</Text>
          </View>
          <View style={[styles.rowRight]}>
            <View style={[styles.rowRightCryptoWrap]}>
              <Text style={[styles.rowRightCryptoText]}>{cryptoAmount}</Text>
            </View>
            <View style={[styles.rowRightFiatWrap]}>
              <Text style={styles.rowRightFiatText}>
                {fiatSymbol} {fiatBalance}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}
