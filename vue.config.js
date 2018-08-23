/**
 * Created by gavin on 2018/6/26.
 */
// vue.config.js
const baseUrl = process.env.NODE_ENV == "development" ? "/" : "./"
module.exports = {
  // options...
  baseUrl: baseUrl,
  productionSourceMap: false
}
