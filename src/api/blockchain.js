import request from './request'
const modulePath = '/blockchain/'

export default {
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
      url: '/blockchain/' + id,
      method: 'delete'
    })
  }
}
