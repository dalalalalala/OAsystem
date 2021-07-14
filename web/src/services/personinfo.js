import { PERSONINFO_LIST, PERSONINFO_EDIT, PERSONINFO_GETBYID, PERSONINFO_REMOVE, PERSONINFO_BATCHREMOVE } from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(PERSONINFO_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(PERSONINFO_GETBYID, METHOD.GET, id)
}

export async function remove(id) {
  return request(PERSONINFO_REMOVE, METHOD.GET, id)
}

export async function batchRemove(ids) {
  return request(PERSONINFO_BATCHREMOVE, METHOD.POST, ids)
}

export async function edit(fields) {
  return request(PERSONINFO_EDIT, METHOD.POST, fields)
}



export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove
}