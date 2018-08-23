import axios from 'axios'
import { getQueryStr } from '../utils/utils'
import store from '../store'

axios.defaults.timeout = 30 * 1000
let auth = getQueryStr('auth')
if(auth){
  axios.defaults.headers.common['auth']   = auth
}
axios.defaults.headers.post['Content-Type'] = 'application/json'

/**
 * getRequest => http get
 * @param url
 * @param params
 * @returns {*}
 */
export const getRequest = async (url, params) => {
  let urlStr = url + `?${translateParams(params)}`
  let parameters = {
    url: params ? urlStr : url,
    method: 'get'
  }
  if(store && store.state && store.state.auth){
    parameters.headers = {'auth': store.state.auth}
  }

  let data = await axios.request(parameters)
  return data.data
}

/**
 * postRequest => http post
 * @param url
 * @param params
 * @returns {*}
 */
export const postRequest = async (url, params, formData) => {
  let parameters = {
    url: url,
    method: 'post',
    data: translateParams(params),
    headers:{}
  }
  if (formData) {
    parameters.headers['Content-Type'] = 'multipart/form-data'
    parameters.data = formData
  }
  if(store && store.state && store.state.auth){
    parameters.headers['auth'] = store.state.auth
  }
  let data = await axios.request(parameters)
  return data.data
}

/**
 * translate obj params to string with &
 * @param params
 * @returns {string}
 */
export function translateParams (params) {
  let url = ''
  for (let param in params) {
    url += `${param}=${encodeURIComponent(params[param])}&`
  }
  return url.substring(0, url.length - 1)
}