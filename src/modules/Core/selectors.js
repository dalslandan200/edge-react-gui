// @flow

import type { EdgeCurrencyWallet } from 'edge-core-js'

import type { State } from '../ReduxTypes'
import { convertCurrency } from '../UI/selectors.js'
import { getDefaultFiat, getDefaultIsoFiat } from '../UI/Settings/selectors.js'

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

export const getFakeExchangeRate = (state: State, fromCurrencyCode: string, toCurrencyCode: string) => {
  const exchangeRate = convertCurrency(state, fromCurrencyCode, toCurrencyCode, 1)
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

export const buildExchangeRates = async (state: State) => {
  const wallets = getWallets(state)
  const accountFiat = getDefaultFiat(state)
  const accountIsoFiat = getDefaultIsoFiat(state)
  const walletIds = Object.keys(wallets)
  const data = {}
  const promiseArray = []
  const exchangeRateKeys = []
  for (const id of walletIds) {
    const wallet = wallets[id]
    const walletIsoFiat = wallet.fiatCurrencyCode
    const walletFiat = wallet.fiatCurrencyCode.replace('iso:', '')
    const currencyCode = wallet.currencyInfo.currencyCode // should get GUI or core versions?
    // need to get both forward and backwards exchange rates for wallets & account fiats, for each parent currency AND each token
    data[`${walletFiat}_${currencyCode}`] = fetchExchangeRateFromCore(state, walletIsoFiat, currencyCode)
    data[`${currencyCode}_${walletFiat}`] = fetchExchangeRateFromCore(state, currencyCode, walletIsoFiat)
    data[`${accountFiat}_${currencyCode}`] = fetchExchangeRateFromCore(state, accountIsoFiat, currencyCode)
    data[`${currencyCode}_${accountFiat}`] = fetchExchangeRateFromCore(state, currencyCode, accountIsoFiat)
    // add them to the list of promises to resolve
    promiseArray.push(
      data[`${walletFiat}_${currencyCode}`],
      data[`${currencyCode}_${walletFiat}`],
      data[`${accountFiat}_${currencyCode}`],
      data[`${currencyCode}_${accountFiat}`]
    )
    // keep track of the exchange rates
    exchangeRateKeys.push(`${walletFiat}_${currencyCode}`, `${currencyCode}_${walletFiat}`, `${accountFiat}_${currencyCode}`, `${currencyCode}_${accountFiat}`)
    // now add tokens, if they exist
    for (const tokenCode in wallet.balances) {
      if (tokenCode !== currencyCode) {
        data[`${walletFiat}_${tokenCode}`] = fetchExchangeRateFromCore(state, walletIsoFiat, tokenCode)
        data[`${tokenCode}_${walletFiat}`] = fetchExchangeRateFromCore(state, tokenCode, walletIsoFiat)
        data[`${accountFiat}_${tokenCode}`] = fetchExchangeRateFromCore(state, accountIsoFiat, tokenCode)
        data[`${tokenCode}_${accountFiat}`] = fetchExchangeRateFromCore(state, tokenCode, accountIsoFiat)
        promiseArray.push(
          data[`${walletFiat}_${tokenCode}`],
          data[`${tokenCode}_${walletFiat}`],
          data[`${accountFiat}_${tokenCode}`],
          data[`${tokenCode}_${accountFiat}`]
        )
        exchangeRateKeys.push(`${walletFiat}_${tokenCode}`, `${tokenCode}_${walletFiat}`, `${accountFiat}_${tokenCode}`, `${tokenCode}_${accountFiat}`)
      }
    }
  }
  const rates = await Promise.all(promiseArray)
  for (let i = 0; i < rates.length; i++) {
    const exchangeRateKey = exchangeRateKeys[i]
    const rate = rates[i]
    data[exchangeRateKey] = rate
  }
  return data
}

export const fetchExchangeRateFromCore = (state: State, fromCurrencyCode: string, toCurrencyCode: string): Promise<number> => {
  const currencyConverter = getCurrencyConverter(state)
  const exchangeRate = currencyConverter.convertCurrency(fromCurrencyCode, toCurrencyCode, 1)
  return Promise.resolve(exchangeRate)
}
