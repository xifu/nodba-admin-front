import request from '@/utils/request'
import  qs from 'qs'


// 根据链接串 + 用户查看权限api 接口
export function getgrantusers(data) {
  return request({
    url: '/getgrantusers',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 获取用户列表 
export function usergetpri(data) {
  return request({
    url: '/usergetpri',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 查询审核人api 
export function dbreviewuser(data) {
  return request({
    url: '/dbreviewuser',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 新增用户权限提交api 
export function dbadduserdbpri(data) {
  return request({
    url: '/dbadduserdbpri',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 编辑用户权限提交api 
export function dbupuserdbpri(data) {
  return request({
    url: '/dbupuserdbpri',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 用户启用 or 禁用权限
export function dbuserendisable(data) {
  return request({
    url: '/dbuserendisable',
    method: 'post',
    data:qs.stringify(data)
  })
}



