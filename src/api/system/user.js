import request from '@/utils/request'
import  qs from 'qs'


// 登录
export function login(data) {
  return request({
    url: '/userlogin',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 获取当前用户用户登录信息
export function currentUser() {
  return request({
    url: '/usergetusinfo',
    method: 'post'
   
  })
}

// 获取用户列表
export function userList(data) {
  return request({
    url: '/userget',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 新增用户
export function userAdd(data) {
  return request({
    url: '/useradd',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 修改用户信息
export function userupuserinfo(data) {
  return request({
    url: '/userupuserinfo',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 重置用户密码
export function useruppasswd(data) {
  return request({
    url: '/useruppasswd',
    method: 'post',
    data:qs.stringify(data)
  })
}

// 删除用户
export function userdel(data) {
  return request({
    url: '/userdel',
    method: 'post',
    data:qs.stringify(data)
  })
}


// 启用禁用用户
export function userupenabled(data) {
  return request({
    url: '/userupenabled',
    method: 'post',
    data:qs.stringify(data)
  })
}

// modifyPassWord
export function modifyPassWord(data) {
  return request({
    url: '/usergetusinfo',
    method: 'post',
    data:qs.stringify(data)
  })
}

// logout
export function logout(data) {
  return request({
    url: '/usergetusinfo',
    method: 'post',
    data:qs.stringify(data)
  })
}