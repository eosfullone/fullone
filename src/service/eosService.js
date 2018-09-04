import Eos from 'eosjs'
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

eosService.prototype.getAccountInfo = async function (contract,account) {
  let result = await this.eos.getTableRows({
    'json': true,
    'code': contract,
    'scope': contract,
    'table': 'playerround',
    'lower_bound': account,
    'limit': 1
  })
  return result
}

eosService.prototype.getRoundInfo = async function (contract,lower_bound) {
  let result = await this.eos.getTableRows({
    'json': true,
    'code': contract,
    'scope': contract,
    'table': 'round',
    'lower_bound': lower_bound,
    'limit': 1
  })
  return getOneResult(result)
}
eosService.prototype.getGobalInfo = async function (contract) {
  let result = await this.eos.getTableRows({
    'json': true,
    'code': contract,
    'scope': contract,
    'table': 'global'
  })
  return getOneResult(result)
}

eosService.prototype.getCurrnRoundInfo= async function(contract){
  try {
    let gobal = await this.getGobalInfo(contract)
    if (gobal) {
      let data = await this.getRoundInfo(contract,gobal.current_round)
      if (data) {
        return data
      }
    } else {
      return null
    }
  } catch (err) {
    throw err
  }
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

eosService.prototype.wallterBuy = async function (contract,account, tokens, team_id, aff) {
  return new Promise((resolve, reject) => {
    let affStr = ""
    if (aff) {
      affStr = `${aff} `
    }
    let memo = `${affStr}${team_id}`
    let param = {
      to: contract,
      tokenName: 'EOS',
      tokenContract: 'eosio.token',
      tokenPrecision: 4,
      amount: tokens,
      memo: memo
    }

    //todo
  })
}

eosService.prototype.buyxtoken = async function (contract,account, team_id, tokens, aff) {
  return new Promise((resolve, reject) => {
    let param = {
      actions: [
        {
          account: contract,
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
  })
}

eosService.prototype.withdraw = async function (contract,account) {
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
          account: contract,
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
  })
}

eosService.prototype.withdraws = async function (contracts,account) {
  return new Promise((resolve, reject) => {
    if (!account) {
      return reject("account can't be null")
    }
    let actions = []
    contracts.forEach(function(contract){
      let action ={
        account: contract,
        name: 'withdraw',
        authorization: [{
          actor: account,
          permission: 'active'
        }],
        data: {
          from: account
        }
      }
      actions.push(action)
    })
    let param = {
      actions
    }
    //todo
  })
}

export default eosService