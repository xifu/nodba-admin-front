import request from '@/utils/request'

export function searchRole(data) {
  return request({
    url: '/manageRole/search',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/manageRole/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/manageRole/update',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/manageRole/changeStatus',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/manageRole/delete',
    method: 'post',
    data
  })
}

export function roleBindMenus(data) {
  return request({
    url: '/manageRole/roleBindMenus',
    method: 'post',
    data
  })
}
