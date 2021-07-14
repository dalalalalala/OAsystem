import { APPLICATION_LIST, APPLICATION_EDIT, APPLICATION_GETBYID, APPLICATION_REMOVE, APPLICATION_BATCHREMOVE, APPLICATION_EDITAPPROVE, APPLICATION_BATCHAPPROVE} from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(APPLICATION_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(APPLICATION_GETBYID, METHOD.GET, id)
}

export async function remove(id) {
  return request(APPLICATION_REMOVE, METHOD.GET, id)
}

export async function batchRemove(ids) {
  return request(APPLICATION_BATCHREMOVE, METHOD.POST, ids)
}

export async function edit(fields) {
  return request(APPLICATION_EDIT, METHOD.POST, fields)
}

export async function editApprove(fields) {
  return request(APPLICATION_EDITAPPROVE, METHOD.POST, fields)
}

export async function batchApprove(ids) {
  return request(APPLICATION_BATCHAPPROVE, METHOD.POST, ids)
}


export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove,
  editApprove,
  batchApprove
}