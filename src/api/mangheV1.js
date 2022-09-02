// import request from '@/utils/request'
import qs from 'querystring'
import axios from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:8080', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000, // request timeout
  withCredentials: true
})
// 登陆
export function login({ pwd, mobile }) {
  const path = '/login'

  // const contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
  const data = {
    pwd,
    mobile
  }

  return service({
    url: path,
    method: 'POST',
    data: qs.stringify(data)
  })
}
// 上架列表
export function list({ page, status, type }) {
  const path = `/list?type=${type}&page=${page}&status=${status}`
  return service({
    url: path,
    method: 'get'
  })
}

// 详情页
export function detail({ id, type }) {
  const path = `/detail?type=${type}&id=${id}`
  return service({
    url: path,
    method: 'get'
  })
}

// 上架详情页
export function saleDetail({ id }) {
  const path = `/saleDetail?id=${id}`

  return service({
    url: path,
    method: 'get'
  })
}
