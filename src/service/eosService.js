import Eos from 'eosjs'
import Long from 'long'
import config from '../config'
let baseConf = config.EOSCONF
let eosService = function () {
  let config = baseConf
  this.eos = Eos(config)
  return this
}
function getOneResult (result) {
  if (result && result.rows) {
    return result.rows[0]
  } else {
    return null
  }
}

eosService.prototype.getAccountInfo = async function (account) {
  let result = await this.eos.getTableRows({
    'json': true,
    'code': baseConf.code,
    'scope': baseConf.scope,
    'table': 'playerround',
    'lower_bound': account,
    'limit': 1
  })
  return result
}

eosService.prototype.getRoundInfo = async function (lower_bound) {
  let result = await this.eos.getTableRows({
    'json': true,
    'code': baseConf.code,
    'scope': baseConf.scope,
    'table': 'round',
    'lower_bound': lower_bound,
    'limit': 1
  })
  return getOneResult(result)
}
eosService.prototype.getGobalInfo = async function () {
  let result = await this.eos.getTableRows({
    'json': true,
    'code': baseConf.code,
    'scope': baseConf.scope,
    'table': 'global'
  })
  return getOneResult(result)
}

eosService.prototype.getActions = async function (account_name, pageParam) {
  let param = {
    account_name: account_name
  }
  if (pageParam) {
    param = Object.assign(param, pageParam)
  }
  let result = await this.eos.getActions(param)
  return result
}

eosService.prototype.wallterBuy = async function (account, tokens, team_id, aff) {
  return new Promise((resolve, reject) => {
    let affStr = ""
    if (aff) {
      affStr = `${aff} `
    }
    let memo = `${affStr}${team_id}`
    let param = {
      to: baseConf.code,
      tokenName: 'EOS',
      tokenContract: 'eosio.token',
      tokenPrecision: 4,
      amount: tokens,
      memo: memo
    }
    //todo
    //transfer to account eosiofullone
  })
}

eosService.prototype.buyxtoken = async function (account, team_id, tokens, aff) {
  return new Promise((resolve, reject) => {
    let param = {
      actions: [
        {
          account: baseConf.scope,
          name: 'buyxtoken',
          authorization: [{
            actor: account,
            permission: 'active'
          }],
          data: {
            from: account,
            team_id: team_id,
            tokens: parseInt(tokens * Math.pow(10, 8)),
            aff: aff || ""
          }
        }
      ]
    }
    //todo 
    //push transactions to account eosiofullone
  })
}

eosService.prototype.withdraw = async function (account) {
  return new Promise((resolve, reject) => {
    if (!account) {
      return reject("account can't be null")
    }
    let transParam = {
      from: account
    }
    let param = {
      actions: [
        {
          account: baseConf.scope,
          name: 'withdraw',
          authorization: [{
            actor: account,
            permission: 'active'
          }],
          data: {
            from: account
          }
        }
      ]
    }
    //todo 
    //push transactions to account eosiofullone
  })
}

export default eosService