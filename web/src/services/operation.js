import { OPERATION_LIST, OPERATION_EDIT, OPERATION_GETBYID, OPERATION_REMOVE, OPERATION_BATCHREMOVE } from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(OPERATION_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(OPERATION_GETBYID, METHOD.GET, id)
}

export async function remove(id) {
  return request(OPERATION_REMOVE, METHOD.GET, id)
}


export async function edit(fields) {
  return request(OPERATION_EDIT, METHOD.POST, fields)
}

export async function batchRemove(ids) {
  return request(OPERATION_BATCHREMOVE, METHOD.POST, ids)
}



export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove,
}