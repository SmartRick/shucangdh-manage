import request from './request'

const TAG_TYPE = [
  //客户端类型
  {
    name: '客户端',
    code: 1
  },
  //背景信息标签
  {
    name: '背景调查',
    code: 2
  },
  //服务公众号
  {
    name: '服务公众号',
    code: 3
  },
  //小程序
  {
    name: '小程序',
    code: 4
  },
]

//客户端类型
const CLIENT_TYPE = {
  WX_GZH: "微信公众号",
  WX_XCX: "微信小程序",
  BD_XCX: "百度小程序",
  YSF_XCX: "云闪付小程序",
  ZFB_XCX: "支付宝小程序",
  APP: "APP客户端",
  H5: "网页端"
}


const modulePath = '/tag/';

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
    url: modulePath + 'page',
    method: 'post',
    data
  })
}

export function GET(id) {
  return request({
    url: modulePath + id,
    method: 'get'
  })
}

export function REMOVES(data) {
  return request({
    url: modulePath + 'removes',
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
  CLIENT_TYPE,
  TAG_TYPE,
  ADD,
  UPDATE,
  PAGE,
  GET,
  REMOVES,
  REMOVE
}

