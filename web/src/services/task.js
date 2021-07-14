import { TASK_LIST, TASK_EDIT, TASK_GETBYID, TASK_REMOVE, TASK_BATCHREMOVE,
  TASK_GETBYITEMANDUSER } from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(TASK_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(TASK_GETBYID, METHOD.GET, id)
}

export async function getByitemAndUser(fields) {
  return request(TASK_GETBYITEMANDUSER, METHOD.POST,fields)
}

export async function remove(id) {
  return request(TASK_REMOVE, METHOD.GET, id)
}

export async function batchRemove(ids) {
  return request(TASK_BATCHREMOVE, METHOD.POST, ids)
}

export async function edit(fields) {
  return request(TASK_EDIT, METHOD.POST, fields)
}



export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove,
  getByitemAndUser
}