import { LIMIT_LIST, LIMIT_EDIT, LIMIT_GETBYID, LIMIT_REMOVE, LIMIT_BATCHREMOVE } from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(LIMIT_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(LIMIT_GETBYID, METHOD.GET, id)
}

export async function remove(id) {
  return request(LIMIT_REMOVE, METHOD.GET, id)
}

export async function batchRemove(ids) {
  return request(LIMIT_BATCHREMOVE, METHOD.POST, ids)
}

export async function edit(fields) {
  return request(LIMIT_EDIT, METHOD.POST, fields)
}



export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove
}