import { ROLE_LIST, ROLE_EDIT, ROLE_GETBYID, ROLE_REMOVE, ROLE_BATCHREMOVE, ROLE_BATCHAdd } from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(ROLE_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(ROLE_GETBYID, METHOD.GET, id)
}

export async function remove(id) {
  return request(ROLE_REMOVE, METHOD.GET, id)
}


export async function edit(fields) {
  return request(ROLE_EDIT, METHOD.POST, fields)
}

export async function batchRemove(ids) {
  return request(ROLE_BATCHREMOVE, METHOD.POST, ids)
}

export async function batchAdd(fields) {
  return request(ROLE_BATCHAdd, METHOD.POST, fields)
}


export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove,
  batchAdd
}