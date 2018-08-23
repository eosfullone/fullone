import { getRequest } from './request'
import config from '../config'
const DOMAIN = config.DOMAIN

const getEosPrice = async function (param) {
  let url = DOMAIN.COINMAKET + "/v2/ticker/1765/"
  return getRequest(url,param)
}

export default { getEosPrice }


