import { NOTE_LIST, NOTE_EDIT, NOTE_GETBYID, NOTE_REMOVE, NOTE_BATCHREMOVE } from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(NOTE_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(NOTE_GETBYID, METHOD.GET, id)
}

export async function remove(id) {
  return request(NOTE_REMOVE, METHOD.GET, id)
}

export async function batchRemove(ids) {
  return request(NOTE_BATCHREMOVE, METHOD.POST, ids)
}

export async function edit(fields) {
  return request(NOTE_EDIT, METHOD.POST, fields)
}



export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove
}