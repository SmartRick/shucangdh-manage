import request from './request'

export function ADD(data) {
  return request({
    url: '/blockchain/',
    method: 'post',
    data
  })
}

export function UPDATE(data) {
  return request({
    url: '/blockchain/',
    method: 'put',
    data
  })
}

export function PAGE(data) {
  return request({
    url: '/blockchain/page',
    method: 'post',
    data
  })
}

export function GET(id) {
  return request({
    url: '/blockchain/' + id,
    method: 'get'
  })
}

export function REMOVES(data) {
  return request({
    url: '/blockchain/removes',
    method: 'delete',
    data
  })
}

export function REMOVE(id) {
  return request({
    url: '/blockchain/' + id,
    method: 'delete'
  })
}
