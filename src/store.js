import Vue from 'vue'
import Vuex from 'vuex'
import { guessService } from './service'
import { getQueryStr } from './utils/utils'
import { EosService, marketService } from './service'
import config from './config'
let EOSCONF = config.EOSCONF
let lang = getQueryStr('lang') || 'en'
let inapp = getQueryStr('inapp')

Vue.use(Vuex)
let eosService = null

export default new Vuex.Store({
  state: {
    logined: true,
    inApp: !!inapp,
    invite_code: '',
    version: null,
    lang: lang,
    accountName: '',
    myEarn: 0,
    accountInfo: {
      myEarn: 0,
    },
    roundInfo: {},
    preRoundInfo: {},
    eosPrice: 0,
    rate: 1,
    currency: 'USDT'

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
    }
  },
  actions: {
    getAccount({commit, state}){
      return new Promise((resolve, reject) => {

        //todo  get account and init EosService
        // let account =  your get account logic
        // commit('setAccountName', account)
        //eosService = new EosService(account)
        eosService = new EosService()
        resolve()
      })
    },
    async getAccountInfo({commit, state}){
      try {
        if (state.accountName) {
          let data = await eosService.getAccountInfo(state.accountName)
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
    async getCurrnRoundInfo({commit}){
      try {
        let gobal = await eosService.getGobalInfo()
        if (gobal) {
          let data = await eosService.getRoundInfo(gobal.current_round)
          if (data) {
            commit('setRoundInfo', data)
            return data
          }
        } else {
          return null
        }
      } catch (err) {
        throw err
      }
    },
    async getPreRoundInfo({commit}){
      try {
        let gobal = await eosService.getGobalInfo()
        if (gobal) {

          if (gobal.current_round > 1) {
            let data = await eosService.getRoundInfo(gobal.current_round - 1)
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
    async getActions({commit}){
      try {
        let data = await eosService.getActions(EOSCONF.scope)
        return data
      } catch (err) {
        throw err
      }
    },
    async getMyActions({commit, state}){
      try {
        if (state.accountName) {
          let data = await eosService.getActions(state.accountName)
          if (data && data.length) {

          }
          return data
        } else {
          return []
        }
      } catch (err) {
        throw err
      }
    },
    async wallterBuy({commit, state}, param){
      try {
        let {team_id, tokens, aff} = param
        let data = await eosService.wallterBuy(state.accountName, tokens, team_id, aff)
        return data
      } catch (err) {
        throw err
      }
    },
    async buyxtoken({commit, state}, param){
      try {
        let {team_id, tokens, aff} = param
        let data = await eosService.buyxtoken(state.accountName, team_id, tokens, aff)
        return data
      } catch (err) {
        throw err
      }
    },
    async withdraw({commit, state}){
      try {
        let data = await eosService.withdraw(state.accountName)
        return data
      } catch (err) {
        throw err
      }
    }
  }
})