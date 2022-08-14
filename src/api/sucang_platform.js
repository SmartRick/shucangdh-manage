import request from './request'

const modulePath = '/platform/'

const MARKET_MODULE = [
  {
    label: '二级市场',
    value: '1'
  },
  {
    label: '场外转赠',
    value: '2'
  },
  {
    label: '交易市场',
    value: '3'
  }
]

export default {
  MARKET_MODULE,
  ADD(data) {
    return request({
      url: modulePath,
      method: 'post',
      data
    })
  },
  UPDATE(data) {
    return request({
      url: modulePath,
      method: 'put',
      data
    })
  },
  PAGE(data) {
    return request({
      url: modulePath + 'page',
      method: 'post',
      data
    })
  },
  GET(id) {
    return request({
      url: modulePath + id,
      method: 'get'
    })
  },
  REMOVES(data) {
    return request({
      url: modulePath + 'removes',
      method: 'delete',
      data
    })
  },
  REMOVE(id) {
    return request({
      url: modulePath + id,
      method: 'delete'
    })
  }
}

