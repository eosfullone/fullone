let env = process.env.NODE_ENV || 'production'
let config = {
  development: {
    DOMAIN: {
      COINMAKET: 'https://api.coinmarketcap.com',
    },
    EOSCONF: {
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
      httpEndpoint: 'https://api1.eosasia.one',
      expireInSeconds: 60,
      broadcast: true,
      debug: false, // API and transactions
      sign: true
    },
    CONTRACTS: ['eosiofullone']
  },
  production: {
    DOMAIN: {
      COINMAKET: 'https://api.coinmarketcap.com',
    },
    EOSCONF: {
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
      httpEndpoint: 'https://api1.eosasia.one',
      expireInSeconds: 60,
      broadcast: true,
      debug: false, // API and transactions
      sign: true
    },
    CONTRACTS: ['eosiofullone']
  }
}

export default config[env]