import request from '@/utils/request'
import  qs from 'qs'


// 根据部门 + 工作流名称查看流程
export function getworkflows(data) {
  return request({
    url: '/getworkflows',
    method: 'post',
    data:qs.stringify(data)
  })
}



