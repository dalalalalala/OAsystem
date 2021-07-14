import { ITEMSTEP_LIST, ITEMSTEP_EDIT, ITEMSTEP_GETBYID, ITEMSTEP_REMOVE, ITEMSTEP_BATCHREMOVE } from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(ITEMSTEP_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(ITEMSTEP_GETBYID, METHOD.GET, id)
}

export async function remove(id) {
  return request(ITEMSTEP_REMOVE, METHOD.GET, id)
}

export async function batchRemove(ids) {
  return request(ITEMSTEP_BATCHREMOVE, METHOD.POST, ids)
}

export async function edit(fields) {
  return request(ITEMSTEP_EDIT, METHOD.POST, fields)
}



export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove
}