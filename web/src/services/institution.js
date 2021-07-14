import { INSTITUTION_LIST, INSTITUTION_EDIT, INSTITUTION_GETBYID, INSTITUTION_REMOVE, INSTITUTION_BATCHREMOVE } from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(INSTITUTION_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(INSTITUTION_GETBYID, METHOD.GET, id)
}

export async function remove(id) {
  return request(INSTITUTION_REMOVE, METHOD.GET, id)
}

export async function batchRemove(ids) {
  return request(INSTITUTION_BATCHREMOVE, METHOD.POST, ids)
}

export async function edit(fields) {
  return request(INSTITUTION_EDIT, METHOD.POST, fields)
}



export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove
}