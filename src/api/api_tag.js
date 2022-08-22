import request from './request'

const modulePath = '/tag/'

/**
 * 标签类型MAP
 * @type {{"1": string, "2": string, "3": string, "4": string}}
 */
const TAG_MAP = {
  // 客户端类型
  1: '客户端',
  // 背景信息标签
  2: '背景调查',
  // 服务公众号
  3: '服务公众号',
  // 小程序
  4: '小程序'
}

/**
 * 客户端类型
 * @type {{APP: string, WX_XCX: string, ZFB_XCX: string, YSF_XCX: string, BD_XCX: string, H5: string, WX_GZH: string}}
 */
const CLIENT_TYPE = {
  WX_GZH: '微信公众号',
  WX_XCX: '微信小程序',
  BD_XCX: '百度小程序',
  YSF_XCX: '云闪付小程序',
  ZFB_XCX: '支付宝小程序',
  APP: 'APP客户端',
  H5: '网页端'
}

/**
 * 接口请求方法
 */
export default {
  TAG_MAP,
  CLIENT_TYPE,
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
  },
  TAG_NAMES(tagType) {
    return request({
      url: modulePath + 'tagNames/' + tagType,
      method: 'get'
    })
  }
}
