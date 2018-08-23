let env = process.env.NODE_ENV || 'production'
let config = {
  development: {
    DOMAIN: {
      COINMAKET: 'https://api.coinmarketcap.com',
    },
    EOSCONF: {
      chainId: '',
      httpEndpoint: '',
      expireInSeconds: 60,
      broadcast: true,
      debug: false,
      sign: true,
      code: 'eosiofullone',
      scope: 'eosiofullone'
    }
  },
  production: {
    DOMAIN: {
      COINMAKET: 'https://api.coinmarketcap.com',
    },
    EOSCONF: {
      chainId: '', 
      httpEndpoint: '',
      expireInSeconds: 60,
      broadcast: true,
      debug: false,
      sign: true,
      code: 'eosiofullone',
      scope: 'eosiofullone'
    }
  }
}

export default config[env]