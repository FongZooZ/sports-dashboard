const redis = require('redis')
const crypto = require('crypto')
const bluebird = require('bluebird')

const config = require('../config')

const client = redis.createClient(config.redis.host)
const ONE_DAY = 86400

// It will add `Async` after every async function
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports.redisClient = client

const set = async (key, data, expire) => {
  try {
    data = JSON.stringify(data)
    await client.setAsync(key, data, 'EX', ONE_DAY)
    return Promise.resolve('ok')
  } catch (err) {
    return Promise.reject(err)
  }
}

const get = async key => {
  try {
    let data = await client.getAsync(key)
    return Promise.resolve(JSON.parse(data))
  } catch (err) {
    return Promise.reject(err)
  }
}

const getOrSet = async (key, expire, getDataFunc) => {
  try {
    let data = await client.getAsync(key)
    if (data) return Promise.resolve(JSON.parse(data))

    // Get data then save cache if cache is missing
    data = typeof(getDataFunc) == 'function' ? await getDataFunc() : await getDataFunc
    let cacheData = JSON.stringify(data)
    await client.setAsync(key, cacheData, 'EX', ONE_DAY)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

const getOrSetFunc = async (expire, getDataFunc) => {
  try {
    const  funcId = getDataFunc.toString()
    const key = crypto.createHash('md5').update(funcId).digest('hex')
    await module.exports.getOrSet(key, expire, getDataFunc)
  } catch (err) {
    return Promise.reject(err)
  }
}

const remove = async key => {
  try {
    await client.delAsync(key)
    return Promise.resolve('ok')
  } catch (err) {
    return Promise.reject(err)
  }
}

const removeByPattern = async keyPattern => {
  try {
    const keys = await client.keysAsync(keyPattern)
    await Promise.all(keys.map(async key => {
      await module.exports.remove(key)
    }))
    return Promise.resolve('ok')
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = {
  set,
  get,
  getOrSet,
  getOrSetFunc,
  remove,
  removeByPattern
}