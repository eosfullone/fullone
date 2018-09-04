import Vue from 'vue'
import Vuex from 'vuex'
import { guessService } from './service'
import { getQueryStr } from './utils/utils'
import { EosService, marketService } from './service'
import config from './config'
let EOSCONF = config.EOSCONF
let auth = getQueryStr('auth')
let lang = getQueryStr('lang') || 'en'
let inapp = getQueryStr('inapp')
var u = navigator.userAgent;
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

Vue.use(Vuex)
let eosService = null
let currency = 'USDT'
let rate = 1
if (lang.indexOf('zh') >= 0) {
  lang = 'zh'
}else if (lang.indexOf('en') >= 0) {
  lang = 'en'
}else{
  lang = 'zh'
}

if (lang != 'en') {
  currency = 'CNY'
  rate = 6.89
}
export default new Vuex.Store({
  state: {
    logined: true,
    inApp: !!inapp,
    invite_code: '',
    auth: auth,
    version: null,
    lang: lang,
    accountName: '',
    contractName: '',
    myEarn: 0,
    accountInfo: {
      myEarn: 0,
    },
    roundInfo: {},
    preRoundInfo: {},
    eosPrice: 0,
    rate: rate,
    currency: currency,
    isIOS: isIOS,
    profits:[],
    styleModel:1

  },
  mutations: {
    setAppInfo(state, info){
      try {
        if (typeof info != "object") {
          info = JSON.parse(info)
        }
        if (info.auth) {
          state.auth = info.auth
          state.logined = true
        }
        if (info.version) {
          state.version = info.version
        }
        state.inApp = true
      } catch (err) {
        console.log(err)
      }
    },
    setVersion(state, version){
      state.version = version
    },
    setAccountInfo(state, accountInfo){
      let val = 0
      if (accountInfo) {
        val = val + parseFloat(accountInfo.earn_aff)
        val = val + parseFloat(accountInfo.earn_gen)
        val = val + parseFloat(accountInfo.earn_win)
        val = val / Math.pow(10, 8)
        if (val < 0.0001) {
          val = 0
        } else {
          val = val.toFixed(4)
        }
      }
      if (isNaN(val)) {
        val = 0
      }
      accountInfo.myEarn = val
      state.accountInfo = accountInfo

    },
    setRoundInfo(state, roundInfo){
      state.roundInfo = roundInfo
    },
    setPreRoundInfo(state, roundInfo){
      state.preRoundInfo = roundInfo
    },
    setEosPrice(state, price){
      state.eosPrice = price
    },
    setAccountName(state, accountName){
      state.accountName = accountName
    },
    setContractName(state,contractName){
      state.contractName = contractName
    },
    setLang(state, lang){
      let currency = 'USDT'
      let rate = 1
      if (lang == 'zh') {
        currency = 'USDT'
        rate = 1
      }
      state.currency = currency
      state.rate = rate
      state.lang = lang
    },
    setStyleModel(state,model){
      state.styleModel = model
    }
  },
  actions: {
    getAppInfo({commit, state}){
      return new Promise((resolve, reject) => {
        eosService = new EosService()
        if (!state.inApp) {
          resolve()
        } else {
          //todo get account info

          resolve()
        }
      })
    },
    async getAccountInfo({commit, state}){
      try {
        if (state.accountName) {
          let data = await eosService.getAccountInfo(state.contractName, state.accountName)
          if (data && data.rows && data.rows[0]) {
            let account = data.rows[0]
            if (account.player == state.accountName) {
              commit('setAccountInfo', data.rows[0])
              return data
            }
          }
          return null
        } else {
          return null
        }
      } catch (err) {
        throw err
      }
    },
    async getCurrnRoundInfo({commit,state}){
      try {
        let data = await eosService.getCurrnRoundInfo(state.contractName)
        if (data) {
          commit('setRoundInfo', data)
          return data
        } else {
          return null
        }
      } catch (err) {
        throw err
      }
    },
    async getPreRoundInfo({commit,state}){
      try {
        let gobal = await eosService.getGobalInfo(state.contractName)
        if (gobal) {
          if (gobal.current_round > 1) {
            let data = await eosService.getRoundInfo(state.contractName, gobal.current_round - 1)
            if (data) {
              commit('setPreRoundInfo', data)
              return data
            }
          } else {
            return null
          }
        } else {
          return null
        }
      } catch (err) {
        throw err
      }
    },
    async getEosPrice({commit}){
      try {
        let data = await marketService.getEosPrice()
        if (data && data.data) {
          let price = data.data.quotes.USD.price
          commit('setEosPrice', price)
          return price
        } else {
          return null
        }
      } catch (err) {
        throw err
      }
    },
    async wallterBuy({commit, state}, param){
      try {
        let {team_id, tokens, aff} = param
        let data = await eosService.wallterBuy(state.contractName, state.accountName, tokens, team_id, aff)
        return data
      } catch (err) {
        throw err
      }
    },
    async buyxtoken({commit, state}, param){
      try {
        let {team_id, tokens, aff} = param
        let data = await eosService.buyxtoken(state.contractName, state.accountName, team_id, tokens, aff)
        return data
      } catch (err) {
        throw err
      }
    },
    async withdraw({commit, state}){
      try {
        let data = await eosService.withdraw(state.contractName, state.accountName)
        return data
      } catch (err) {
        throw err
      }
    },
    setContractName({commit},{contract}){
      commit('setContractName', contract)
    },
    setLang({commit},{lang}){
      commit('setLang',lang)
    },
    setStyleModel({commit},{index}){
      commit('setStyleModel',index)
    }
  }
})