// @flow

import type { EdgeCurrencyWallet } from 'edge-core-js'

import type { State } from '../ReduxTypes'
import { getDefaultFiat } from '../UI/Settings/selectors.js'

export const getCore = (state: State) => state.core

// Context
export const getContext = (state: State) => {
  const core = getCore(state)
  const context = core.context.context
  return context
}

export const getFolder = (state: State) => {
  const core = getCore(state)
  const folder = core.context.folder
  return folder
}

export const getUsernames = (state: State) => {
  const core = getCore(state)
  const usernames = core.context.usernames
  return usernames
}

export const getNextUsername = (state: State) => {
  const core = getCore(state)
  const nextUsername = core.context.nextUsername
  return nextUsername
}

// Account
export const getAccount = (state: State) => {
  const core = getCore(state)
  const account = core.account
  return account
}

export const getUsername = (state: State) => {
  const account = getAccount(state)
  const username = account.username
  return username
}

export const getCurrencyConverter = (state: State) => {
  const account = getAccount(state)
  const currencyConverter = account.exchangeCache
  return currencyConverter
}

export const buildExchangeRates = async state => {
  const wallets = getWallets(state)
  const accountFiat = getDefaultFiat(state)
  const walletIds = Object.keys(wallets)
  const data = {}
  const promiseArray = []
  const exchangeRateKeys = []
  for (const id of walletIds) {
    const wallet = wallets[id]
    const walletFiat = wallet.fiatCurrencyCode.replace('iso:', '')
    const currencyCode = wallet.currencyInfo.currencyCode // should get GUI or core versions?
    data[`${walletFiat}_${currencyCode}`] = getExchangeRate(state, walletFiat, currencyCode)
    data[`${currencyCode}_${walletFiat}`] = getExchangeRate(state, currencyCode, walletFiat)
    data[`${accountFiat}_${currencyCode}`] = getExchangeRate(state, accountFiat, currencyCode)
    data[`${currencyCode}_${accountFiat}`] = getExchangeRate(state, currencyCode, accountFiat)
    promiseArray.push(
      data[`${walletFiat}_${currencyCode}`],
      data[`${currencyCode}_${walletFiat}`],
      data[`${accountFiat}_${currencyCode}`],
      data[`${currencyCode}_${accountFiat}`]
    )
    exchangeRateKeys.push(`${walletFiat}_${currencyCode}`, `${currencyCode}_${walletFiat}`, `${accountFiat}_${currencyCode}`, `${currencyCode}_${accountFiat}`)
  }
  const rates = await Promise.all(promiseArray)
  for (let i = 0; i < rates.length; i++) {
    data[exchangeRateKeys[i]] = rates[i]
  }
  console.log('rates is: ', data)
  return data
}

export const getExchangeRate = (state: State, fromCurrencyCode: string, toCurrencyCode: string) => {
  const currencyConverter = getCurrencyConverter(state)
  const exchangeRate = currencyConverter.convertCurrency(fromCurrencyCode, toCurrencyCode, 1)
  return Promise.resolve(exchangeRate)
}

export const getFakeExchangeRate = (state: State, fromCurrencyCode: string, toCurrencyCode: string) => {
  const currencyConverter = getCurrencyConverter(state)
  const exchangeRate = currencyConverter.convertCurrency(fromCurrencyCode, toCurrencyCode, 1)
  return exchangeRate + Math.random() * 10
}

// Wallets
export const getWallets = (state: State): { [walletId: string]: EdgeCurrencyWallet } => {
  const core = getCore(state)
  const wallets = core.wallets.byId
  return wallets
}

export const getWallet = (state: State, walletId: string): EdgeCurrencyWallet => {
  const wallets = getWallets(state)
  const wallet = wallets[walletId]
  return wallet
}

export const getWalletName = (state: State, walletId: string): string => {
  const wallet = getWallet(state, walletId)
  return (wallet && wallet.name) || 'no wallet name'
}

export const getBalanceInCrypto = (state: State, walletId: string, currencyCode: string) => {
  const wallet = getWallet(state, walletId)
  const balance = wallet.getBalance({ currencyCode })
  return balance
}
