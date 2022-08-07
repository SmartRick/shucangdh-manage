import request from './request'

const modulePath = '/platform/';
export function ADD(data) {
  return request({
    url: modulePath,
    method: 'post',
    data
  })
}
export function UPDATE(data) {
  return request({
    url: modulePath,
    method: 'put',
    data
  })
}

export function PAGE(data) {
  return request({
    url: modulePath+'page',
    method: 'post',
    data
  })
}

export function GET(id) {
  return request({
    url:modulePath + id,
    method: 'get'
  })
}

export function REMOVES(data) {
  return request({
    url:modulePath+'removes',
    method: 'delete',
    data
  })
}

export function REMOVE(id) {
  return request({
    url: modulePath + id,
    method: 'delete'
  })
}
export default {
  ADD,
  UPDATE,
  PAGE,
  GET,
  REMOVES,
  REMOVE
}

