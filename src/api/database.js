import request from '@/utils/request'
import  qs from 'qs'


// 数据库列表
export function geDatabaseList(data) {
  return request({
    url: '/dbdetail',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 数据库idc环境列表
export function getIdc(data) {
  return request({
    url: '/idcget',
    method: 'post',
    data:qs.stringify(data)
  })
}


// 新增数据库
export function dbadd(data) {
  return request({
    url: '/dbadd',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 编辑数据库
export function dbupconninfo(data) {
  return request({
    url: '/dbupconninfo',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 删除数据库
export function dbdelconninfo(data) {
  return request({
    url: '/dbdelconninfo',
    method: 'post',
    data:qs.stringify(data)
  })
}

